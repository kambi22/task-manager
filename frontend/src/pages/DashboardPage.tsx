import { ListTodo, Clock, CheckCircle2, AlertTriangle, PieChart, Wrench, Filter, FileText, Hourglass, User } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { StatsCard, StatsCardSkeleton } from "../components/ui/StatsCard";
import { PageHeader } from "../components/layout/PageHeader";
import { TaskTable } from "../components/task/TaskTable";
import { useTasks } from "../hooks/useTasks";
import { useState, useCallback } from "react";
import type { Task, CreateTaskData, UpdateTaskData } from "../types";
import { TaskDetail } from "../components/task/TaskDetail";
import { useAuth } from "../contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";
import { updateTask, deleteTask } from "../api/taskApi";
import { TaskForm } from "../components/task/TaskForm";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user: currentUser } = useAuth();
  const { stats, loading: statsLoading, refresh: refreshStats } = useDashboard();
  const { tasks, loading: tasksLoading, refresh: refreshTasks } = useTasks({ limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  const { users } = useUsers({ isTeamMember: true });
  const [viewTaskId, setViewTaskId] = useState<string | null>(null);

  // Modal states for edit/delete
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  }, []);

  const handleUpdate = useCallback(async (data: CreateTaskData | UpdateTaskData) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, data as UpdateTaskData);
      toast.success("Task updated successfully");
      setShowForm(false);
      setEditingTask(null);
      refreshStats();
      refreshTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to update task");
    }
  }, [editingTask, refreshStats, refreshTasks]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTask(deleteTarget.id);
      toast.success("Task deleted successfully");
      setDeleteTarget(null);
      refreshStats();
      refreshTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, refreshStats, refreshTasks]);

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
        <h2 className="text-base font-semibold text-[var(--text-secondary)] mb-4">
          Recent Tasks
        </h2>
        <TaskTable
          tasks={tasks}
          loading={tasksLoading}
          onEdit={handleEdit}
          onDelete={(task) => setDeleteTarget(task)}
          onView={(task: Task) => setViewTaskId(task.id)}
          currentUser={currentUser}
        />
      </div>

      {/* Task detail slide-over */}
      <TaskDetail
        taskId={viewTaskId}
        onClose={() => setViewTaskId(null)}
      />

      {/* Create / Edit modal */}
      <TaskForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
        onSubmit={handleUpdate}
        task={editingTask}
        users={users}
        currentUser={currentUser}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}
