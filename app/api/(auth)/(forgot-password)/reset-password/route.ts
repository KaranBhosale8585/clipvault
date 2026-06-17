import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { otpTable } from "@/db/schema";
import { setAuthCookie } from "@/utils/auth";
import { logger } from "@/utils/logger";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword, userOtp } = await req.json();
    if (!email || !userOtp || !newPassword) {
      return NextResponse.json(
        { message: "Invalid request, missing required field" },
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

    const salt = bcrypt.genSaltSync(10);
    const newHashed = bcrypt.hashSync(newPassword, salt);

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        password: newHashed,
        isVerified: true,
      })
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

    logger.info(`Password updated successfully for ${email}`, "auth/reset-password");
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    await logger.error("Error resetting password", "auth/reset-password", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
