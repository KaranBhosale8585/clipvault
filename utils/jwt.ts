import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface User {
  id: string;
  isVerified: boolean;
  role: string;
}

/**
 * Signs a new JWT token with user data.
 */
export async function signToken(user: User) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return await new SignJWT({
    id: user.id.toString(),
    isVerified: user.isVerified,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT token and returns the payload.
 */
export async function verifyToken(token: string) {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload) return null;
    
    return {
      id: payload.id as string,
      isVerified: payload.isVerified as boolean,
      role: payload.role as string,
    };
  } catch (error) {
    // Silently fail on invalid tokens in middleware
    return null;
  }
}
