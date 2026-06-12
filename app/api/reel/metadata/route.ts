import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { fetchReelMetadata, validateReelUrl } from "@/utils/instagram";
import { db } from "@/db";
import { downloadsTable } from "@/db/schema";
import { checkDownloadRateLimit } from "@/utils/rateLimit";
import { eq, and, desc, gte, isNull, count } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    const ip = req.headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";

    if (!user) {
      // Free tier logic: 1 free download
      const [anonStats] = await db
        .select({ total: count() })
        .from(downloadsTable)
        .where(
          and(
            isNull(downloadsTable.userId),
            eq(downloadsTable.ipAddress, ip)
          )
        );

      if (anonStats.total >= 1) {
        return NextResponse.json(
          { error: "Limit Exceeded", message: "Free trial limit reached. Please log in or sign up to continue downloading." },
          { status: 401 }
        );
      }
    } else {
      // Authenticated user rate limiting
      const isAllowed = await checkDownloadRateLimit(user.id);
      if (!isAllowed) {
        return NextResponse.json(
          { error: "Too Many Requests", message: "Download limit exceeded. Please wait 15 minutes." },
          { status: 429 }
        );
      }
    }

    const { url } = await req.json();

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

    let metadata;

    if (cachedDownload && cachedDownload.videoUrl && cachedDownload.thumbnailUrl) {
      console.log(`Cache hit for ${url}`);
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
          { error: "Extraction Failed", message: "Could not find video data. The Reel might be private or Instagram is blocking the request." },
          { status: 500 }
        );
      }
    }

    // Insert to track limits and build cache
    await db.insert(downloadsTable).values({
      userId: user ? user.id : null,
      ipAddress: ip,
      reelUrl: url,
      videoUrl: metadata.videoUrl,
      thumbnailUrl: metadata.thumbnailUrl,
      title: metadata.title,
      status: "completed",
    });

    return NextResponse.json({
      data: metadata,
      message: "Metadata extracted successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Reel extraction error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
