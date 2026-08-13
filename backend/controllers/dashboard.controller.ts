import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";

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
    // Run all aggregation queries in parallel
    const [
      totalTasks,
      statusCounts,
      priorityCounts,
      overdueCount,
      recentTasks,
      totalUsers,
    ] = await Promise.all([
      // Total tasks
      prisma.task.count(),

      // Tasks grouped by status
      prisma.task.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      // Tasks grouped by priority
      prisma.task.groupBy({
        by: ["priority"],
        _count: { priority: true },
      }),

      // Overdue tasks (due date in the past and not completed)
      prisma.task.count({
        where: {
          dueDate: { lt: new Date() },
          status: { not: "Completed" },
        },
      }),

      // Recent 5 tasks
      prisma.task.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      }),

      // Total users
      prisma.user.count(),
    ]);

    // Transform status counts into an object
    const byStatus: Record<string, number> = {
      Pending: 0,
      InProgress: 0,
      Completed: 0,
      Blocked: 0,
    };
    for (const item of statusCounts) {
      byStatus[item.status] = item._count.status;
    }

    // Transform priority counts into an object
    const byPriority: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };
    for (const item of priorityCounts) {
      byPriority[item.priority] = item._count.priority;
    }

    res.json({
      success: true,
      data: {
        totalTasks,
        totalUsers,
        overdueCount,
        byStatus,
        byPriority,
        recentTasks,
      },
    });
  } catch (error) {
    next(error);
  }
}
