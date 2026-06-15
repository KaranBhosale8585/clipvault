import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { unlimitedAccessRequestsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendApprovalEmail } from "@/utils/email";
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

    // 2. Security: User cannot approve own request
    if (request.userId === admin.id) {
      return NextResponse.json({ error: "Forbidden", message: "You cannot approve your own request." }, { status: 403 });
    }

    // 3. Update request status
    await db
      .update(unlimitedAccessRequestsTable)
      .set({
        status: "APPROVED",
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(unlimitedAccessRequestsTable.id, requestId));

    // 4. Update user status
    await db
      .update(usersTable)
      .set({
        isProAccess: true,
        proAccessGrantedAt: new Date(),
        proAccessGrantedBy: admin.id,
      })
      .where(eq(usersTable.id, request.userId));

    // 5. Send notification email (non-blocking)
    sendApprovalEmail(request.email, request.name);

    logger.info(`Admin ${admin.email} approved PRO access for ${request.email}`, "admin-api", {
      requestId,
      userId: request.userId,
    });

    return NextResponse.json({ message: "Request approved successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Approve request error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
