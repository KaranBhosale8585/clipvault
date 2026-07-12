import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { getVisitorId } from "@/utils/auth";
import { fetchReelMetadata, validateReelUrl } from "@/utils/instagram";
import { db } from "@/db";
import { downloadsTable, usersTable } from "@/db/schema";
import { revalidateTag } from "next/cache";

import { checkDownloadRateLimit, checkIPRateLimit } from "@/utils/rateLimit";
import { logger } from "@/utils/logger";
import { eq, and, desc, gte, isNull, count, or, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";

    // 1. Global IP Rate Limit (First Layer)
    const isIPAllowed = await checkIPRateLimit(ip, "extraction");
    if (!isIPAllowed) {
      return NextResponse.json(
        { error: "Too Many Requests", message: "Global rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const user = await getUser();
    const visitorId = await getVisitorId();

    if (!user) {
      // Free tier logic: 3 free downloads (Checked by IP OR Visitor ID)
      const [anonStats] = await db
        .select({ total: count() })
        .from(downloadsTable)
        .where(
          and(
            isNull(downloadsTable.userId),
            or(
              eq(downloadsTable.ipAddress, ip),
              eq(downloadsTable.visitorId, visitorId)
            )
          )
        );

      if (anonStats.total >= 3) {
        return NextResponse.json(
          { error: "Limit Exceeded", message: "Free trial limit reached (3 downloads). Please log in or sign up to continue downloading." },
          { status: 401 }
        );
      }
    } else {
      // Authenticated user logic: 10 downloads / day
      const [dbUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, user.id));

      if (dbUser) {
        // PRO users bypass all daily limits
        if (dbUser.isProAccess) {
          await logger.info(`PRO access bypass for user: ${dbUser.id}`, "reel/metadata");
        } else {
          const now = new Date();
          const lastReset = new Date(dbUser.lastDownloadReset);
          
          // Reset count if it's a new day (UTC based for consistency)
          if (now.getUTCFullYear() !== lastReset.getUTCFullYear() || 
              now.getUTCMonth() !== lastReset.getUTCMonth() || 
              now.getUTCDate() !== lastReset.getUTCDate()) {
            
            await db
              .update(usersTable)
              .set({ 
                dailyDownloadCount: 0, 
                lastDownloadReset: now 
              })
              .where(eq(usersTable.id, user.id));
            
            // Update local object to reflect reset
            dbUser.dailyDownloadCount = 0;
            await logger.info(`Daily count reset for user: ${dbUser.id}`, "reel/metadata");
          }

          if (dbUser.dailyDownloadCount >= 10 && dbUser.role !== 'admin') {
            return NextResponse.json(
              { error: "Daily Limit Reached", message: "You have reached your daily limit of 10 downloads. Please contact support to increase your limit." },
              { status: 403 }
            );
          }
        }
      }

      // Maintain legacy rate limit (15 min window) as additional protection (PRO users also bypass this)
      if (!dbUser?.isProAccess) {
        const isAllowed = await checkDownloadRateLimit(user.id);
        if (!isAllowed) {
          return NextResponse.json(
            { error: "Too Many Requests", message: "Burst limit reached. Please wait a few minutes." },
            { status: 429 }
          );
        }
      }
    }

    const { url, extensionData } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "Bad Request", message: "Reel URL is required." },
        { status: 400 }
      );
    }

    if (!validateReelUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL", message: "Please provide a valid Instagram Reel URL." },
        { status: 400 }
      );
    }

    let metadata;

    if (extensionData) {
      await logger.info(`Extension extraction register for ${url}`, "reel/metadata");
      metadata = {
        id: extensionData.id || url.split('/').filter(Boolean).pop() || "reel",
        reelUrl: url,
        videoUrl: extensionData.videoUrl,
        thumbnailUrl: extensionData.thumbnailUrl,
        title: extensionData.title || "Instagram Reel",
      };
    } else {
      // SCALABILITY: Check for cached metadata (within last 12 hours) to prevent excessive script execution
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      const [cachedDownload] = await db
        .select()
        .from(downloadsTable)
        .where(
          and(
            eq(downloadsTable.reelUrl, url),
            gte(downloadsTable.createdAt, twelveHoursAgo)
          )
        )
        .orderBy(desc(downloadsTable.createdAt))
        .limit(1);

      if (cachedDownload && cachedDownload.videoUrl && cachedDownload.thumbnailUrl) {
        await logger.info(`Cache hit for ${url}`, "reel/metadata");
        metadata = {
          id: cachedDownload.id,
          reelUrl: cachedDownload.reelUrl,
          videoUrl: cachedDownload.videoUrl,
          thumbnailUrl: cachedDownload.thumbnailUrl,
          title: cachedDownload.title || "Instagram Reel",
        };
      } else {
        // Proceed with real extraction if not cached or cache is old
        metadata = await fetchReelMetadata(url);

        if (!metadata) {
          return NextResponse.json(
            { error: "Extraction Failed", message: "Instagram is blocking the server request. Please install our browser extension to download this Reel." },
            { status: 500 }
          );
        }
      }
    }

    // Insert to track limits and build cache
    await db.insert(downloadsTable).values({
      userId: user ? user.id : null,
      visitorId: visitorId,
      ipAddress: ip,
      reelUrl: url,
      videoUrl: metadata.videoUrl,
      thumbnailUrl: metadata.thumbnailUrl,
      title: metadata.title,
      status: "completed",
    });

    // Increment authenticated user daily count
    if (user) {
      await db
        .update(usersTable)
        .set({ dailyDownloadCount: sql`${usersTable.dailyDownloadCount} + 1` })
        .where(eq(usersTable.id, user.id));
    }

    try {
      revalidateTag("admin-stats", "default");
    } catch (e) {
      console.error("Cache revalidation error:", e);
    }

    return NextResponse.json({
      data: metadata,
      message: "Metadata extracted successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    await logger.error("Reel extraction error", "reel/metadata", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
