import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { downloadsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to view history." },
        { status: 401 }
      );
    }

    const history = await db
      .select()
      .from(downloadsTable)
      .where(eq(downloadsTable.userId, user.id))
      .orderBy(desc(downloadsTable.createdAt))
      .limit(10);

    return NextResponse.json({
      data: history,
      message: "History fetched successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to clear history." },
        { status: 401 }
      );
    }

    // SCALED DELETION: Only clear records for the current user
    await db.delete(downloadsTable).where(eq(downloadsTable.userId, user.id));

    return NextResponse.json({
      message: "Download history cleared successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Clear history error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
