import { NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { downloadsTable } from "@/db/schema";
import { isNull } from "drizzle-orm";

import { revalidateTag } from "next/cache";

export async function POST() {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // "Cache" in our system is currently anonymous records used for 12h metadata caching
    await db.delete(downloadsTable).where(isNull(downloadsTable.userId));

    revalidateTag("admin-stats", "default");

    return NextResponse.json({ message: "Cache cleared successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
  }
}
