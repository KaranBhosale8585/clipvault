import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { otpTable } from "@/db/schema";
import { checkRateLimit } from "@/utils/rateLimit";
import { sendOtp } from "@/utils/sendOtp";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "Invalid request, missing required field" },
      { status: 400 },
    );
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!user) {
    return NextResponse.json({ message: "User not found!" }, { status: 404 });
  }

  const allowed = await checkRateLimit(user.id);

  if (!allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try after 10 minutes." },
      { status: 429 },
    );
  }

  try {
    await db.delete(otpTable).where(eq(otpTable.email, user.email));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.insert(otpTable).values({
      userId: user.id,
      email: user.email,
      otp,
      expiresAt,
    });

    await sendOtp(user.email, user.name, otp);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 400 },
    );
  }
}
