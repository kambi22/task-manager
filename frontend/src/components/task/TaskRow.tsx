import { Pencil, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import type { Task } from "../../types";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { formatDate } from "../../utils/formatDate";

interface TaskRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
}

export function TaskRow({ task, onEdit, onDelete, onView }: TaskRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr
      className="group border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors cursor-pointer"
      onClick={() => onView(task)}
    >
      {/* Task Title */}
      <td className="px-5 py-4 max-w-[300px]">
        <div>
          <p className="text-sm font-medium text-slate-200 truncate">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {task.description}
            </p>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <StatusBadge status={task.status} />
      </td>

      {/* Priority */}
      <td className="px-4 py-4">
        <PriorityBadge priority={task.priority} />
      </td>

      {/* Assignee */}
      <td className="px-4 py-4">
        {task.user ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={task.user.name} size="sm" />
            <span className="text-sm text-slate-300">{task.user.name}</span>
          </div>
        ) : (
          <span className="text-sm text-slate-600">Unassigned</span>
        )}
      </td>

      {/* Due Date */}
      <td className="px-4 py-4">
        <span className="text-sm text-slate-400">
          {formatDate(task.dueDate)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Edit task"
          >
            <Pencil size={14} />
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
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
                <div className="absolute right-0 top-8 z-20 w-40 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(task);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
