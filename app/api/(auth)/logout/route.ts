import { clearAuthCookie } from "@/utils/auth";
import { logger } from "@/utils/logger";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await clearAuthCookie();

    return NextResponse.json(res);
  } catch (error) {
    await logger.error("Logout error", "auth/logout", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
