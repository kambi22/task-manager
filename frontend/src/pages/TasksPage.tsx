import { useState, useCallback } from "react";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { PageHeader } from "../components/layout/PageHeader";
import { TaskFilters } from "../components/task/TaskFilters";
import { TaskTable } from "../components/task/TaskTable";
import { TaskForm } from "../components/task/TaskForm";
import { TaskDetail } from "../components/task/TaskDetail";
import { Pagination } from "../components/ui/Pagination";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { createTask, updateTask, deleteTask } from "../api/taskApi";
import type { Task, CreateTaskData, UpdateTaskData } from "../types";
import toast from "react-hot-toast";

export default function TasksPage() {
  const { tasks, pagination, loading, params, updateParams, refresh } =
    useTasks();
  const { users } = useUsers();

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewTaskId, setViewTaskId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Tasks"
        subtitle={`${pagination?.total ?? pagination?.totalCount ?? 0} total tasks`}
      />

      {/* Filters */}
      <TaskFilters
        params={params}
        onUpdateParams={updateParams}
        onCreateClick={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
      />

      {/* Task table */}
      <TaskTable
        tasks={tasks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(task) => setDeleteTarget(task)}
        onView={(task) => setViewTaskId(task.id)}
        sortBy={params.sortBy}
        sortOrder={params.sortOrder}
        onSort={handleSort}
      />

      {/* Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={(page) => updateParams({ page })}
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
      />

      {/* Task detail slide-over */}
      <TaskDetail
        taskId={viewTaskId}
        onClose={() => setViewTaskId(null)}
        users={users}
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
