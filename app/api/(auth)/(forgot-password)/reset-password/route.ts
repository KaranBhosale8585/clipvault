import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { otpTable } from "@/db/schema";
import { setAuthCookie } from "@/utils/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  try {
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

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 400 },
    );
  }
}
