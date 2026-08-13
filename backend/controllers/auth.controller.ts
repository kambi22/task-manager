import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
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
