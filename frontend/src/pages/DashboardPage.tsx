import { ListTodo, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { StatsCard, StatsCardSkeleton } from "../components/ui/StatsCard";
import { PageHeader } from "../components/layout/PageHeader";
import { TaskTable } from "../components/task/TaskTable";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { useState } from "react";
import type { Task } from "../types";
import { TaskDetail } from "../components/task/TaskDetail";

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useDashboard();
  const { tasks, loading: tasksLoading } = useTasks({ limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  const { users } = useUsers();
  const [viewTaskId, setViewTaskId] = useState<string | null>(null);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your project tasks and team activity"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 stagger-children">
        {statsLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatsCard
              title="Total Tasks"
              value={stats.totalTasks}
              icon={<ListTodo size={20} />}
              gradient="blue"
            />
            <StatsCard
              title="In Progress"
              value={stats.byStatus?.InProgress || 0}
              icon={<Clock size={20} />}
              gradient="teal"
            />
            <StatsCard
              title="Completed"
              value={stats.byStatus?.Completed || 0}
              icon={<CheckCircle2 size={20} />}
              gradient="orange"
            />
            <StatsCard
              title="Overdue"
              value={stats.overdueCount}
              icon={<AlertTriangle size={20} />}
              gradient="pink"
            />
          </>
        ) : null}
      </div>

      {/* Recent tasks */}
      <div>
        <h2 className="text-base font-semibold text-slate-300 mb-4">
          Recent Tasks
        </h2>
        <TaskTable
          tasks={tasks}
          loading={tasksLoading}
          onEdit={() => {}}
          onDelete={() => {}}
          onView={(task: Task) => setViewTaskId(task.id)}
        />
      </div>

      {/* Task detail slide-over */}
      <TaskDetail
        taskId={viewTaskId}
        onClose={() => setViewTaskId(null)}
        users={users}
      />
    </div>
  );
}
