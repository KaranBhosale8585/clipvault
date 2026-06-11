import { getUser } from "@/utils/getUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await getUser();
    if (!res) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }
    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
