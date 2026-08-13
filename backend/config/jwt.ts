import jwt, { type SignOptions } from "jsonwebtoken";
import type { Role } from "../models/user.model";

export interface JwtPayload {
  userId: string;
  role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Generate a signed JWT for the given user.
 */
export function generateToken(userId: string, role: Role): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as string as any,
  };
  return jwt.sign({ userId, role } as JwtPayload, JWT_SECRET, options);
}

/**
 * Verify and decode a JWT. Throws if invalid/expired.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
