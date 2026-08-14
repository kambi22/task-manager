import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, User as UserIcon, Flag, Clock } from "lucide-react";
import type { Task } from "../../types";
import { getTaskById } from "../../api/taskApi";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { CommentSection } from "./CommentSection";
import { formatDate } from "../../utils/formatDate";

interface TaskDetailProps {
  taskId: string | null;
  onClose: () => void;
}

export function TaskDetail({ taskId, onClose }: TaskDetailProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    setLoading(true);
    getTaskById(taskId)
      .then(setTask)
      .catch(() => setTask(null))
      .finally(() => setLoading(false));
  }, [taskId]);

  // Close on Escape
  useEffect(() => {
    if (!taskId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [taskId, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (taskId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [taskId]);

  if (!taskId) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden">
      {/* Overlay background covering full screen with blur */}
      <div
        className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-md animate-overlay"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl h-full bg-[var(--bg-elevated)] border-l border-[var(--border-input)] shadow-2xl animate-slide-in-right overflow-y-auto z-10">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-elevated)] backdrop-blur-sm border-b border-[var(--border-glass)] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="space-y-4">
              <div className="skeleton w-3/4 h-7" />
              <div className="skeleton w-full h-4" />
              <div className="skeleton w-full h-4" />
              <div className="flex gap-3 mt-6">
                <div className="skeleton w-24 h-7 rounded-full" />
                <div className="skeleton w-20 h-7 rounded-full" />
              </div>
            </div>
          ) : !task ? (
            <p className="text-[var(--text-muted)] text-center py-10">
              Task not found.
            </p>
          ) : (
            <>
              {/* Title */}
              <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {task.title}
              </h1>

              {/* Badges */}
              <div className="flex items-center gap-3 mb-5">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>

              {/* Description */}
              {task.description && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-glass)]">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--border-glass)]">
                  <UserIcon size={16} className="text-[var(--text-muted)]" />
                  <div>
                    <p className="text-[10px] text-[var(--text-dimmed)] uppercase tracking-wider">
                      Assignee
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {task.user ? (
                        <>
                          <Avatar name={task.user.name} size="sm" />
                          <span className="text-sm text-[var(--text-secondary)]">
                            {task.user.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-[var(--text-dimmed)]">
                          Unassigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--border-glass)]">
                  <Calendar size={16} className="text-[var(--text-muted)]" />
                  <div>
                    <p className="text-[10px] text-[var(--text-dimmed)] uppercase tracking-wider">
                      Due Date
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--border-glass)]">
                  <Clock size={16} className="text-[var(--text-muted)]" />
                  <div>
                    <p className="text-[10px] text-[var(--text-dimmed)] uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--border-glass)]">
                  <Flag size={16} className="text-[var(--text-muted)]" />
                  <div>
                    <p className="text-[10px] text-[var(--text-dimmed)] uppercase tracking-wider">
                      Updated
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                      {formatDate(task.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[var(--border-glass)]" />

              {/* Comments */}
              <CommentSection taskId={task.id} />
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
