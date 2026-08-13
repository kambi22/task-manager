import prisma from "../config/prisma";

export class DashboardRepository {
  async getDashboardData() {
    return Promise.all([
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
  }
}

export const dashboardRepository = new DashboardRepository();
