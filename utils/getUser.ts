import { cookies } from "next/headers";
import {db} from "@/db";
import {usersTable } from "@/db/schema";
import { verifyToken } from "./jwt";
import { eq } from "drizzle-orm";

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    if (!payload) return null;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.id));

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  } catch (error) {
    console.error("Invalid token or DB error:", error);
    return null;
  }
}
