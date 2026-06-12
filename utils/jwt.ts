import { jwtVerify, SignJWT, type JWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export interface VaultJWTPayload extends JWTPayload {
  id?: string;
  isVerified?: boolean;
  role?: string;
  visitorId?: string;
}

/**
 * Signs a new JWT token with the provided payload.
 */
export async function signToken(payload: VaultJWTPayload) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT token and returns the payload.
 */
export async function verifyToken(token: string): Promise<VaultJWTPayload | null> {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as VaultJWTPayload;
  } catch {
    return null;
  }
}
