import { ListTodo, Clock, CheckCircle2, AlertTriangle, PieChart, Wrench, Filter, FileText, Hourglass, User } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { StatsCard, StatsCardSkeleton } from "../components/ui/StatsCard";
import { PageHeader } from "../components/layout/PageHeader";
import { TaskTable } from "../components/task/TaskTable";
import { useTasks } from "../hooks/useTasks";
import { useState } from "react";
import type { Task } from "../types";
import { TaskDetail } from "../components/task/TaskDetail";

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useDashboard();
  const { tasks, loading: tasksLoading } = useTasks({ limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  const [viewTaskId, setViewTaskId] = useState<string | null>(null);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of team tasks, metrics, and activity"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 stagger-children">
        {statsLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
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
              secondaryIcon={<FileText size={18} />}
              gradient="blue"
              change="+12%"
            />
            <StatsCard
              title="Pending"
              value={stats.byStatus?.Pending || 0}
              icon={<Hourglass size={20} />}
              secondaryIcon={<Clock size={18} />}
              gradient="purple"
              change="+2%"
            />
            <StatsCard
              title="In Progress"
              value={stats.byStatus?.InProgress || 0}
              icon={<Clock size={20} />}
              secondaryIcon={<PieChart size={18} />}
              gradient="teal"
              change="+5%"
            />
            <StatsCard
              title="Completed"
              value={stats.byStatus?.Completed || 0}
              icon={<CheckCircle2 size={20} />}
              secondaryIcon={<Wrench size={18} />}
              gradient="orange"
              change="+18%"
            />
            <StatsCard
              title="Overdue"
              value={stats.overdueCount}
              icon={<AlertTriangle size={20} />}
              secondaryIcon={<Filter size={18} />}
              gradient="pink"
              change="+3%"
            />
            <StatsCard
              title="Assigned to Me"
              value={stats.myTasksCount || 0}
              icon={<User size={20} />}
              secondaryIcon={<CheckCircle2 size={18} />}
              gradient="blue"
              change=""
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
      />
    </div>
  );
}
