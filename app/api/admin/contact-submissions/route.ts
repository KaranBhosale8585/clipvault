import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissionsTable } from "@/db/schema";
import { getUser } from "@/utils/getUser";
import { desc } from "drizzle-orm";
import { logger } from "@/utils/logger";

export async function GET() {
  try {
    const user = await getUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.createdAt));

    return NextResponse.json({ data: submissions });
  } catch (error) {
    logger.error("Error fetching contact submissions", "admin-api", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
