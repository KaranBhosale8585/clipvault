import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissionsTable } from "@/db/schema";
import { getUser } from "@/utils/getUser";
import { eq } from "drizzle-orm";
import { logger } from "@/utils/logger";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    await db
      .update(contactSubmissionsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactSubmissionsTable.id, id));

    logger.info(`Contact submission ${id} marked as ${status} by ${user.email}`, "admin-api");

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating contact submission", "admin-api", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, id));

    logger.warn(`Contact submission ${id} deleted by ${user.email}`, "admin-api");

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting contact submission", "admin-api", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
