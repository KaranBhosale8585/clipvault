import { cookies } from "next/headers";
import { signToken, verifyToken, type VaultJWTPayload } from "./jwt";
import { v4 as uuidv4 } from "uuid";

interface User extends VaultJWTPayload {
  id: string;
  isVerified: boolean;
  role: string;
}

/**
 * Gets or creates a secure visitor ID for anonymous users.
 */
export async function getVisitorId() {
  const cookieStore = await cookies();
  const visitorCookie = cookieStore.get("visitor_id")?.value;

  if (visitorCookie) {
    try {
      const decoded = await verifyToken(visitorCookie);
      if (decoded && decoded.visitorId) {
        return decoded.visitorId as string;
      }
    } catch {
      // Invalid or expired token, generate new one
    }
  }

  const newVisitorId = uuidv4();
  const token = await signToken({ visitorId: newVisitorId });

  cookieStore.set("visitor_id", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return newVisitorId;
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
