import { useState } from "react";
import { Pencil, Trash2, Eye, MoreHorizontal, Calendar, CheckSquare } from "lucide-react";
import type { Task, TaskStatus } from "../../types";
import { PriorityBadge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Tooltip } from "../ui/Tooltip";
import { formatDate } from "../../utils/formatDate";
import { STATUS_OPTIONS, STATUS_CONFIG } from "../../utils/constants";

interface TaskBoardProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  currentUser?: { id: string; role: "USER" | "ADMIN"; name: string; isTeamMember?: boolean } | null;
}

export function TaskBoard({
  tasks,
  loading,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  currentUser,
}: TaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDragOverColumn, setActiveDragOverColumn] = useState<TaskStatus | null>(null);
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<string | null>(null);

  const isTeamMember = !!currentUser?.isTeamMember;
  const isAdmin = currentUser?.role === "ADMIN";

  // Native Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (activeDragOverColumn !== status) {
      setActiveDragOverColumn(status);
    }
  };

  const handleDragLeave = () => {
    setActiveDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setActiveDragOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    
    if (!taskId) return;

    // Find the task to verify edit permission
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isAssignee = task.assignedTo === currentUser?.id;
    const canEdit = isTeamMember && (isAdmin || isAssignee);

    if (!canEdit) {
      return;
    }

    if (task.status !== newStatus) {
      await onStatusChange(taskId, newStatus);
    }
  };

  // Group tasks by status
  const groupedTasks = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {STATUS_OPTIONS.map((status) => (
          <div key={status} className="glass-panel rounded-3xl p-5 flex flex-col gap-4 min-h-[500px]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="skeleton w-28 h-5 rounded" />
              <div className="skeleton w-6 h-5 rounded-full" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="skeleton w-full h-32 rounded-2xl" />
              <div className="skeleton w-full h-24 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start animate-fade-in select-none">
      {STATUS_OPTIONS.map((status) => {
        const columnTasks = groupedTasks[status] || [];
        const isDragOver = activeDragOverColumn === status;
        const config = STATUS_CONFIG[status];

        return (
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
            className={`
              glass-panel rounded-3xl p-5 flex flex-col min-h-[550px] transition-all duration-300
              ${isDragOver ? "bg-blue-500/5 border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-2 ring-blue-500/30 scale-[1.01]" : ""}
            `}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${config.dot} shadow-[0_0_8px_currentColor]`} />
                <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  {config.label}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[var(--bg-hover-strong)] text-[var(--text-secondary)] border border-[var(--border-glass)]">
                {columnTasks.length}
              </span>
            </div>

            {/* Task list container */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 max-h-[600px] scrollbar-thin">
              {columnTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-[var(--border-glass)] rounded-2xl min-h-[150px]">
                  <CheckSquare size={24} className="text-[var(--text-dimmed)] mb-2" />
                  <p className="text-xs font-medium text-[var(--text-muted)]">No tasks in this stage</p>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isAssignee = task.assignedTo === currentUser?.id;
                  const canEdit = isTeamMember && (isAdmin || isAssignee);
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";
                  const isTaskDragged = draggedTaskId === task.id;
                  const isMenuOpen = menuOpenTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      draggable={canEdit}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onView(task)}
                      className={`
                        glass-card rounded-2xl p-4 border border-[var(--border-glass)] hover:border-[var(--border-medium)]
                        transition-all duration-200 cursor-pointer flex flex-col gap-3 shadow-md
                        hover:shadow-lg hover:bg-[var(--bg-hover)] relative
                        ${canEdit ? "cursor-grab active:cursor-grabbing" : ""}
                        ${isTaskDragged ? "opacity-30 border-dashed border-blue-500/50 scale-[0.98]" : ""}
                        ${isMenuOpen ? "z-30" : "z-10"}
                      `}
                    >
                      {/* Card Header: Priority & Action Trigger */}
                      <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <PriorityBadge priority={task.priority} />
                        
                        {(isAdmin || canEdit) && (
                          <div className="relative">
                            <button
                              onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)}
                              className="p-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-sm"
                              title="Actions"
                            >
                              <MoreHorizontal size={14} />
                            </button>

                            {menuOpenTaskId === task.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setMenuOpenTaskId(null)}
                                />
                                <div className="absolute right-0 top-8 z-20 w-48 bg-[var(--bg-elevated)] backdrop-blur-2xl border border-[var(--border-medium)] rounded-2xl shadow-2xl overflow-hidden py-1">
                                  <button
                                    onClick={() => {
                                      onView(task);
                                      setMenuOpenTaskId(null);
                                    }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover-strong)] transition-colors cursor-pointer"
                                  >
                                    <Eye size={14} className="text-blue-400" />
                                    View Details
                                  </button>
                                  
                                  {canEdit && (
                                    <button
                                      onClick={() => {
                                        onEdit(task);
                                        setMenuOpenTaskId(null);
                                      }}
                                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover-strong)] transition-colors cursor-pointer"
                                    >
                                      <Pencil size={14} className="text-indigo-400" />
                                      Edit Task
                                    </button>
                                  )}

                                  {/* Fallback status changer (crucial for mobile/accessibility) */}
                                  {canEdit && (
                                    <div className="border-t border-[var(--border-glass)] my-1">
                                      <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                        Move To Status
                                      </p>
                                      {STATUS_OPTIONS.map((opt) => {
                                        if (opt === task.status) return null;
                                        return (
                                          <button
                                            key={opt}
                                            onClick={async () => {
                                              setMenuOpenTaskId(null);
                                              await onStatusChange(task.id, opt);
                                            }}
                                            className="flex items-center gap-2 w-full px-5 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover-strong)] transition-colors text-left"
                                          >
                                            <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[opt].dot}`} />
                                            {STATUS_CONFIG[opt].label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {isAdmin && isTeamMember && (
                                    <button
                                      onClick={() => {
                                        onDelete(task);
                                        setMenuOpenTaskId(null);
                                      }}
                                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/15 border-t border-[var(--border-glass)] transition-colors cursor-pointer"
                                    >
                                      <Trash2 size={14} />
                                      Delete Task
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Content: Title & description */}
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-[var(--text-muted)] line-clamp-3 mt-1 font-normal leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Due Date & Assignee Avatar */}
                      <div className="flex items-center justify-between border-t border-[var(--border-glass)] pt-3 mt-1">
                        {task.dueDate ? (
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? "text-rose-400 font-semibold" : "text-[var(--text-muted)]"}`}>
                            <Calendar size={13} className={isOverdue ? "animate-pulse" : ""} />
                            <span>{formatDate(task.dueDate)}</span>
                            {isOverdue && <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-500/10 px-1 rounded border border-rose-500/20">Overdue</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--text-dimmed)]">No due date</span>
                        )}

                        <div>
                          {task.user ? (
                            <Tooltip content={`Assigned to ${task.user.name}`}>
                              <div className="flex items-center">
                                <Avatar name={task.user.name} size="sm" />
                              </div>
                            </Tooltip>
                          ) : (
                            <span className="text-xs text-[var(--text-dimmed)] italic">Unassigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
