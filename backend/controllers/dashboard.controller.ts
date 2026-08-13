import { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service";

/**
 * GET /api/dashboard
 * Returns aggregated task statistics.
 */
export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    const data = await dashboardService.getDashboardStats(userId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
