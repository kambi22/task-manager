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
    const data = await dashboardService.getDashboardStats();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
