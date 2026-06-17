import { NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { logsTable } from "@/db/schema";

export async function POST() {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(logsTable);

    return NextResponse.json({ message: "Logs cleared successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to clear logs" }, { status: 500 });
  }
}
