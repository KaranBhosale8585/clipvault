import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { usersTable, downloadsTable } from "@/db/schema";
import { count, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    
    // Strict Admin Check
    // Note: We need to ensure the user object from getUser() includes the role.
    // Let's check getUser.ts first.
    
    // For now, I'll fetch the user again to be safe.
    const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.id, user?.id || ""));
    
    if (!dbUser || dbUser.role !== "admin") {
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

    return NextResponse.json({
      data: {
        stats: {
          totalUsers: userCount.total,
          totalDownloads: downloadCount.total,
        },
        recentDownloads,
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

import { eq } from "drizzle-orm";
