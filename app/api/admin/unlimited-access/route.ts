import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { unlimitedAccessRequestsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query;

    if (status && status !== "ALL") {
      query = db
        .select()
        .from(unlimitedAccessRequestsTable)
        .where(eq(unlimitedAccessRequestsTable.status, status))
        .orderBy(desc(unlimitedAccessRequestsTable.createdAt));
    } else {
      query = db
        .select()
        .from(unlimitedAccessRequestsTable)
        .orderBy(desc(unlimitedAccessRequestsTable.createdAt));
    }

    const requests = await query;

    return NextResponse.json({ data: requests });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Admin fetch requests error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
