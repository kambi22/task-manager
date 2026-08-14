import { Request, Response, NextFunction } from "express";
import { taskHistoryService } from "../services/task-history.service";
import type { HistoryQueryInput } from "../schemas/task-history.schema";

/**
 * GET /api/history
 * List task history events with filtering and pagination.
 */
export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as HistoryQueryInput;
    const { history, pagination } = await taskHistoryService.getHistory(query);

    res.json({
      success: true,
      data: history,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}
