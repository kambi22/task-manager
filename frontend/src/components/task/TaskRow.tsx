import { Pencil, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import type { Task } from "../../types";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { formatDate } from "../../utils/formatDate";
import { Tooltip } from "../ui/Tooltip";

interface TaskRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  currentUser?: { id: string; role: "USER" | "ADMIN"; name: string; isTeamMember?: boolean } | null;
}

export function TaskRow({ task, onEdit, onDelete, onView, currentUser }: TaskRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  const isTeamMember = !!currentUser?.isTeamMember;
  const isAdmin = currentUser?.role === "ADMIN";
  const isAssignee = task.assignedTo === currentUser?.id;
  const canEdit = isTeamMember && (isAdmin || isAssignee);

  return (
    <tr
      className="group hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
      onClick={() => onView(task)}
    >
      {/* Task Title */}
      <td className="px-5 py-4 max-w-[320px]">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors truncate">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5 font-normal">
              {task.description}
            </p>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <StatusBadge status={task.status} />
      </td>

      {/* Priority */}
      <td className="px-4 py-4 whitespace-nowrap">
        <PriorityBadge priority={task.priority} />
      </td>

      {/* Assignee */}
      <td className="px-4 py-4 whitespace-nowrap">
        {task.user ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={task.user.name} size="sm" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">{task.user.name}</span>
          </div>
        ) : (
          <span className="text-sm text-[var(--text-muted)]">Unassigned</span>
        )}
      </td>

      {/* Due Date */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {formatDate(task.dueDate)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {canEdit ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-sm"
              title="Edit task"
            >
              <Pencil size={14} />
            </button>
          ) : (
            isAdmin && !isTeamMember ? (
              <Tooltip content="Only Team Member can Access">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full border border-[var(--border-glass)] bg-[var(--bg-input)] text-[var(--text-dimmed)] cursor-not-allowed opacity-50 shadow-sm"
                  title="Edit task (Locked)"
                >
                  <Pencil size={14} />
                </button>
              </Tooltip>
            ) : null
          )}

          {(isAdmin || canEdit) && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-sm"
                title="More actions"
              >
                <MoreHorizontal size={14} />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 top-10 z-20 w-48 bg-[var(--bg-elevated)] backdrop-blur-2xl border border-[var(--border-medium)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(task);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover-strong)] transition-colors cursor-pointer"
                    >
                      <Eye size={15} className="text-blue-400" />
                      View Details
                    </button>
                    {isAdmin ? (
                      isTeamMember ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task);
                            setShowMenu(false);
                          }}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                          Delete Task
                        </button>
                      ) : (
                        <Tooltip content="Only Team Member can Access">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-[var(--text-dimmed)] cursor-not-allowed opacity-50"
                            disabled
                          >
                            <Trash2 size={15} />
                            Delete Task (Locked)
                          </button>
                        </Tooltip>
                      )
                    ) : null}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
