import { useState, useCallback } from "react";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { PageHeader } from "../components/layout/PageHeader";
import { TaskFilters } from "../components/task/TaskFilters";
import { TaskTable } from "../components/task/TaskTable";
import { TaskBoard } from "../components/task/TaskBoard";
import { TaskForm } from "../components/task/TaskForm";
import { TaskDetail } from "../components/task/TaskDetail";
import { Pagination } from "../components/ui/Pagination";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { createTask, updateTask, deleteTask } from "../api/taskApi";
import type { Task, CreateTaskData, UpdateTaskData, TaskStatus } from "../types";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { List, LayoutGrid } from "lucide-react";

export default function TasksPage() {
  const { user: currentUser } = useAuth();
  const { tasks, pagination, loading, params, updateParams, refresh } =
    useTasks();
  const { users } = useUsers({ isTeamMember: true });

  // Modal and view states
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewTaskId, setViewTaskId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toggle view mode and dynamically adjust pagination limit
  const handleViewModeChange = useCallback(
    (mode: "table" | "kanban") => {
      setViewMode(mode);
      if (mode === "kanban") {
        updateParams({ limit: 100, page: 1 });
      } else {
        updateParams({ limit: 10, page: 1 });
      }
    },
    [updateParams]
  );

  // Create task
  const handleCreate = useCallback(async (data: CreateTaskData | UpdateTaskData) => {
    await createTask(data as CreateTaskData);
    toast.success("Task created successfully");
    refresh();
  }, [refresh]);

  // Edit task
  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  }, []);

  const handleUpdate = useCallback(async (data: CreateTaskData | UpdateTaskData) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, data as UpdateTaskData);
    toast.success("Task updated successfully");
    refresh();
  }, [editingTask, refresh]);

  // Drag and drop status change handler
  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      try {
        await updateTask(taskId, { status: newStatus });
        toast.success(`Status updated successfully`);
        refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to update status");
      }
    },
    [refresh]
  );

  // Delete task
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTask(deleteTarget.id);
      toast.success("Task deleted successfully");
      setDeleteTarget(null);
      refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, refresh]);

  // Sort
  const handleSort = useCallback(
    (field: string) => {
      const newOrder =
        params.sortBy === field && params.sortOrder === "desc" ? "asc" : "desc";
      updateParams({ sortBy: field, sortOrder: newOrder, page: params.page });
    },
    [params.sortBy, params.sortOrder, params.page, updateParams]
  );

  // Segmented control switcher for the PageHeader actions prop
  const headerActions = (
    <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-glass)] p-1 rounded-2xl">
      <button
        onClick={() => handleViewModeChange("table")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          viewMode === "table"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
        }`}
        title="Table View"
      >
        <List size={14} />
        <span>List</span>
      </button>
      <button
        onClick={() => handleViewModeChange("kanban")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          viewMode === "kanban"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
        }`}
        title="Kanban Board View"
      >
        <LayoutGrid size={14} />
        <span>Board</span>
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Tasks"
        subtitle={`${pagination?.total ?? pagination?.totalCount ?? 0} total tasks`}
        actions={headerActions}
      />

      {/* Filters */}
      <TaskFilters
        params={params}
        onUpdateParams={updateParams}
        users={users}
        onCreateClick={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
      />

      {/* Task Content: Table or Kanban Board */}
      {viewMode === "table" ? (
        <>
          <TaskTable
            tasks={tasks}
            loading={loading}
            onEdit={handleEdit}
            onDelete={(task) => setDeleteTarget(task)}
            onView={(task) => setViewTaskId(task.id)}
            sortBy={params.sortBy}
            sortOrder={params.sortOrder}
            onSort={handleSort}
            currentUser={currentUser}
          />

          {/* Pagination */}
          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={(page) => updateParams({ page })}
            />
          )}
        </>
      ) : (
        <TaskBoard
          tasks={tasks}
          loading={loading}
          onEdit={handleEdit}
          onDelete={(task) => setDeleteTarget(task)}
          onView={(task) => setViewTaskId(task.id)}
          onStatusChange={handleStatusChange}
          currentUser={currentUser}
        />
      )}

      {/* Create / Edit modal */}
      <TaskForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
        users={users}
        currentUser={currentUser}
      />

      {/* Task detail slide-over */}
      <TaskDetail
        taskId={viewTaskId}
        onClose={() => setViewTaskId(null)}
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

