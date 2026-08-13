import { Request, Response, NextFunction } from "express";
import { verifyToken, type JwtPayload } from "../config/jwt";
import ApiError from "../utils/ApiError";
import type { Role } from "../models/user.model";

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

/**
 * Role-based authorization middleware.
 * Checks if the authenticated user's role matches any of the required roles.
 */
export function authorize(allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user) {
      next(ApiError.unauthorized("Authentication required"));
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      next(ApiError.forbidden("Access denied: insufficient permissions"));
      return;
    }

    next();
  };
}

