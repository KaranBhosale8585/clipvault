import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { unlimitedAccessRequestsTable } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [latestRequest] = await db
      .select()
      .from(unlimitedAccessRequestsTable)
      .where(eq(unlimitedAccessRequestsTable.userId, user.id))
      .orderBy(desc(unlimitedAccessRequestsTable.createdAt))
      .limit(1);

    return NextResponse.json({ data: latestRequest || null });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Fetch request error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for existing pending request
    const [pendingRequest] = await db
      .select()
      .from(unlimitedAccessRequestsTable)
      .where(
        and(
          eq(unlimitedAccessRequestsTable.userId, user.id),
          eq(unlimitedAccessRequestsTable.status, "PENDING")
        )
      )
      .limit(1);

    if (pendingRequest) {
      return NextResponse.json(
        { error: "Conflict", message: "You already have a pending request." },
        { status: 409 }
      );
    }

    const body = await req.json();
    const { name, email, useCase, expectedUsage, notes } = body;

    if (!name || !email || !useCase || !expectedUsage) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing required fields." },
        { status: 400 }
      );
    }

    await db.insert(unlimitedAccessRequestsTable).values({
      userId: user.id,
      name,
      email,
      useCase,
      expectedUsage,
      notes: notes || null,
      status: "PENDING",
    });

    return NextResponse.json({ message: "Request submitted successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Create request error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
