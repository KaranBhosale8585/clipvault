import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { setAuthCookie } from "@/utils/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required!" },
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

    const check = bcrypt.compareSync(password, user.password);

    if (!check) {
      return NextResponse.json(
        { message: "Invalid Credentials!" },
        {
          status: 400,
        },
      );
    }

    await setAuthCookie({
      id: user.id,
      isVerified: user.isVerified,
      role: user.role,
    });

    return NextResponse.json(
      { message: "User Logged In Successfully!" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 400 },
    );
  }
}
