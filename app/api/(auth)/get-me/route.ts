import { getUser } from "@/utils/getUser";
import { logger } from "@/utils/logger";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await getUser();
    if (!res) {
      return NextResponse.json(null);
    }
    return NextResponse.json(res);
  } catch (error) {
    await logger.error("Get user error", "auth/get-me", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
