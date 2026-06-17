import { db } from "@/db";
import { otpTable } from "@/db/schema";
import { getUser } from "@/utils/getUser";
import { checkRateLimit } from "@/utils/rateLimit";
import { sendOtp } from "@/utils/sendOtp";
import { logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  const allowed = await checkRateLimit(user.id);

  if (!allowed) {
    logger.warn(`OTP rate limit exceeded for user: ${user.email}`, "auth/send-otp");
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
    logger.info(`OTP sent successfully to ${user.email}`, "auth/send-otp");

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    await logger.error("Error sending OTP", "auth/send-otp", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
