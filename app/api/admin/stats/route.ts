import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { usersTable, downloadsTable, logsTable } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden", message: "Administrative access required." },
        { status: 403 }
      );
    }

    const [userCount] = await db.select({ total: count() }).from(usersTable);
    const [downloadCount] = await db.select({ total: count() }).from(downloadsTable);
    
    const recentDownloads = await db
      .select({
        id: downloadsTable.id,
        title: downloadsTable.title,
        reelUrl: downloadsTable.reelUrl,
        createdAt: downloadsTable.createdAt,
        userName: usersTable.name,
      })
      .from(downloadsTable)
      .innerJoin(usersTable, eq(downloadsTable.userId, usersTable.id))
      .orderBy(desc(downloadsTable.createdAt))
      .limit(10);

    const latestLogs = await db
      .select()
      .from(logsTable)
      .orderBy(desc(logsTable.createdAt))
      .limit(20);

    return NextResponse.json({
      data: {
        stats: {
          totalUsers: userCount.total,
          totalDownloads: downloadCount.total,
        },
        recentDownloads,
        latestLogs,
      },
      message: "Admin stats fetched successfully.",
    });
  } catch (error: any) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
