import { Request, Response, NextFunction } from "express";
import { externalService } from "../services/external.service";

/**
 * GET /api/external/users
 * Returns list of team suggestions / public users from external API.
 */
export async function getExternalUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await externalService.getExternalUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
