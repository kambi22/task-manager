import { Request, Response, NextFunction } from "express";
import { verifyToken, type JwtPayload } from "../config/jwt";
import ApiError from "../utils/ApiError";

/**
 * Authentication middleware.
 * Extracts Bearer token from Authorization header, verifies JWT,
 * and attaches the decoded payload to `req.user`.
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(ApiError.unauthorized("Authentication required"));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
