import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { unlimitedAccessRequestsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendRejectionEmail } from "@/utils/email";
import { logger } from "@/utils/logger";

export async function POST(req: NextRequest) {
  try {
    const admin = await getUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json({ error: "Bad Request", message: "Request ID is required." }, { status: 400 });
    }

    // 1. Fetch request
    const [request] = await db
      .select()
      .from(unlimitedAccessRequestsTable)
      .where(eq(unlimitedAccessRequestsTable.id, requestId))
      .limit(1);

    if (!request) {
      return NextResponse.json({ error: "Not Found", message: "Request not found." }, { status: 404 });
    }

    if (request.status !== "PENDING") {
      return NextResponse.json({ error: "Conflict", message: "Request is already reviewed." }, { status: 409 });
    }

    // 2. Update request status
    await db
      .update(unlimitedAccessRequestsTable)
      .set({
        status: "REJECTED",
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(unlimitedAccessRequestsTable.id, requestId));

    // 3. Send notification email (non-blocking)
    sendRejectionEmail(request.email, request.name);

    logger.info(`Admin ${admin.email} rejected PRO access for ${request.email}`, "admin-api", {
      requestId,
      userId: request.userId,
    });

    return NextResponse.json({ message: "Request rejected successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Reject request error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
