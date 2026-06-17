import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { logger } from "@/utils/logger";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 },
      );
    }

    const isUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (isUser.length > 0) {
      return NextResponse.json(
        { message: "User already exists!" },
        { status: 400 },
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    await db.insert(usersTable).values({
      name,
      email,
      password: hashed,
    });

    return NextResponse.json(
      { message: "Signup Successful!" },
      { status: 200 },
    );
  } catch (error) {
    await logger.error("Registration error", "auth/signup", error);
    return NextResponse.json(
      {
        error: "Server error. Please try again later.",
      },
      { status: 500 },
    );
  }
}
