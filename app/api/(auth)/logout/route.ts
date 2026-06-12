import { clearAuthCookie } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await clearAuthCookie();

    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
