import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { otpTable } from "@/db/schema";
import { getUser } from "@/utils/getUser";
import { setAuthCookie } from "@/utils/auth";
import { logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userOtp } = await req.json();
    if (!userOtp) {
      return NextResponse.json({ message: "OTP is required!" }, { status: 400 });
    }
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const [otpRecord] = await db
      .select()
      .from(otpTable)
      .where(eq(otpTable.email, user.email));

    if (!otpRecord) {
      return NextResponse.json({ message: "OTP not found!" }, { status: 404 });
    }
    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ message: "OTP expired!" }, { status: 400 });
    }

    if (otpRecord.otp !== userOtp) {
      return NextResponse.json({ message: "Invalid OTP!" }, { status: 400 });
    }

    const [updatedUser] = await db
      .update(usersTable)
      .set({ isVerified: true })
      .where(eq(usersTable.email, user.email))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    await db.delete(otpTable).where(eq(otpTable.email, user.email));
    await setAuthCookie({
      id: updatedUser.id,
      isVerified: updatedUser.isVerified,
      role: updatedUser.role,
    });

    logger.info(`User ${user.email} verified successfully`, "auth/verify-otp");
    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (error) {
    await logger.error("Error verifying OTP", "auth/verify-otp", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
