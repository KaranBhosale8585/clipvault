import { cookies } from "next/headers";
import { signToken } from "./jwt";

interface User {
  id: string;
  isVerified: boolean;
  role: string;
}

/**
 * Sets the refresh token cookie for the user.
 * For use in API routes and Server Actions.
 */
export async function setAuthCookie(user: User) {
  const token = await signToken(user);
  const cookieStore = await cookies();

  cookieStore.set("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

/**
 * Clears the auth cookie.
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return { message: "Logged out successfully" };
}
