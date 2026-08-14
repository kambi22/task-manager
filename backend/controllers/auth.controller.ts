import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { auditLogService } from "../services/audit-log.service";
import type { SignupInput } from "../schemas/auth.schema";
import type { LoginInput } from "../schemas/auth.schema";

/**
 * POST /api/auth/signup
 */
export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = req.body as SignupInput;
    const result = await authService.signup(data);

    // Log signup event
    await auditLogService.logEvent({
      userId: result.user.id,
      action: "USER_SIGNUP",
      resource: "Auth",
      resourceId: result.user.id,
      details: { email: result.user.email, role: result.user.role },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = req.body as LoginInput;
    const result = await authService.login(data);

    // Log login event
    await auditLogService.logEvent({
      userId: result.user.id,
      action: "USER_LOGIN",
      resource: "Auth",
      resourceId: result.user.id,
      details: { email: result.user.email },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Requires authentication middleware to attach req.user.
 */
export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const user = await authService.getMe(userId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

