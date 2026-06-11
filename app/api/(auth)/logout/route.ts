import { logoutUser } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await logoutUser();

    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
