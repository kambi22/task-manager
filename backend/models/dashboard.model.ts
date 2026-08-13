export interface DashboardStats {
  totalTasks: number;
  totalUsers: number;
  overdueCount: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  recentTasks: any[];
}
