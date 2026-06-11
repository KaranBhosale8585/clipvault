import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface User {
  id: string;
  isVerified: boolean;
  role: string;
}

export async function getRefreshToken(user: User) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = await new SignJWT({
    id: user.id.toString(),
    isVerified: user.isVerified,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  (await cookies()).set("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload) return null;
    return {
      id: payload.id as string,
      isVerified: payload.isVerified as boolean,
      role: payload.role as string,
    };
  } catch (error) {
    console.log("JWT verification failed:", error);
    return null;
  }
}

export async function logoutUser() {
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
