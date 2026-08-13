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
      className="group hover:bg-slate-800/40 transition-colors cursor-pointer"
      onClick={() => onView(task)}
    >
      {/* Task Title */}
      <td className="px-5 py-4 max-w-[320px]">
        <div>
          <p className="text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors truncate">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
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
            <span className="text-sm font-medium text-slate-200">{task.user.name}</span>
          </div>
        ) : (
          <span className="text-sm text-slate-500">Unassigned</span>
        )}
      </td>

      {/* Due Date */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-slate-300">
          {formatDate(task.dueDate)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-2 rounded-full border border-white/10 bg-slate-800/50 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
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
              className="p-2 rounded-full border border-white/10 bg-slate-800/50 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
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
                <div className="absolute right-0 top-10 z-20 w-44 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-fade-in py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(task);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Eye size={15} className="text-blue-400" />
                    View Details
                  </button>
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
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

