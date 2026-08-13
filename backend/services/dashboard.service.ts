import { dashboardRepository } from "../repositories/dashboard.repository";

export class DashboardService {
  async getDashboardStats(userId?: string) {
    const [
      totalTasks,
      statusCounts,
      priorityCounts,
      overdueCount,
      recentTasks,
      totalUsers,
      myTasksCount,
    ] = await dashboardRepository.getDashboardData(userId);

    const byStatus: Record<string, number> = {
      Pending: 0,
      InProgress: 0,
      Completed: 0,
      Blocked: 0,
    };
    for (const item of statusCounts) {
      byStatus[item.status] = item._count.status;
    }

    const byPriority: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };
    for (const item of priorityCounts) {
      byPriority[item.priority] = item._count.priority;
    }

    return {
      totalTasks,
      totalUsers,
      overdueCount,
      myTasksCount,
      byStatus,
      byPriority,
      recentTasks,
    };
  }
}

export const dashboardService = new DashboardService();
