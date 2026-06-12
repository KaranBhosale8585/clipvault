import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { usersTable, downloadsTable, logsTable } from "@/db/schema";
import { count, desc, eq, lt, gte, sql, isNull, isNotNull } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden", message: "Administrative access required." },
        { status: 403 }
      );
    }

    // SCALABILITY: Periodic Cleanup (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    db.delete(logsTable).where(lt(logsTable.createdAt, thirtyDaysAgo)).execute();
    db.delete(downloadsTable).where(lt(downloadsTable.createdAt, thirtyDaysAgo)).execute();

    // 1. Basic Stats
    const [userCount] = await db.select({ total: count() }).from(usersTable);
    const [downloadCount] = await db.select({ total: count() }).from(downloadsTable);
    
    // 2. Advanced Stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [downloadsToday] = await db
      .select({ total: count() })
      .from(downloadsTable)
      .where(gte(downloadsTable.createdAt, todayStart));

    const [anonDownloads] = await db
      .select({ total: count() })
      .from(downloadsTable)
      .where(isNull(downloadsTable.userId));

    const [regDownloads] = await db
      .select({ total: count() })
      .from(downloadsTable)
      .where(isNotNull(downloadsTable.userId));

    // 3. Top URLs (Aggregated)
    const topUrls = await db
      .select({
        url: downloadsTable.reelUrl,
        title: downloadsTable.title,
        count: count(downloadsTable.id),
      })
      .from(downloadsTable)
      .groupBy(downloadsTable.reelUrl, downloadsTable.title)
      .orderBy(desc(count(downloadsTable.id)))
      .limit(5);

    const recentDownloads = await db
      .select({
        id: downloadsTable.id,
        title: downloadsTable.title,
        reelUrl: downloadsTable.reelUrl,
        createdAt: downloadsTable.createdAt,
        userName: usersTable.name,
      })
      .from(downloadsTable)
      .leftJoin(usersTable, eq(downloadsTable.userId, usersTable.id)) // Changed to left join for anon
      .orderBy(desc(downloadsTable.createdAt))
      .limit(15);

    const latestLogs = await db
      .select()
      .from(logsTable)
      .orderBy(desc(logsTable.createdAt))
      .limit(30);

    return NextResponse.json({
      data: {
        stats: {
          totalUsers: Number(userCount.total),
          totalDownloads: Number(downloadCount.total),
          downloadsToday: Number(downloadsToday.total),
          anonDownloads: Number(anonDownloads.total),
          regDownloads: Number(regDownloads.total),
        },
        topUrls,
        recentDownloads,
        latestLogs,
      },
      message: "Admin stats fetched successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Admin stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
