import type { Task } from "../../types";
import { TaskRow } from "./TaskRow";
import { EmptyState } from "../ui/EmptyState";
import { ArrowUpDown } from "lucide-react";

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
}

const columns = [
  { key: "title", label: "Task Title", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "priority", label: "Priority", sortable: true },
  { key: "assignee", label: "Assignee", sortable: false },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "actions", label: "", sortable: false },
];

// Skeleton row
function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      <td className="px-5 py-4">
        <div className="space-y-2">
          <div className="skeleton w-48 h-4" />
          <div className="skeleton w-32 h-3" />
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="skeleton w-24 h-6 rounded-full" />
      </td>
      <td className="px-4 py-4">
        <div className="skeleton w-20 h-6 rounded-full" />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="skeleton w-7 h-7 rounded-full" />
          <div className="skeleton w-20 h-4" />
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="skeleton w-24 h-4" />
      </td>
      <td className="px-4 py-4">
        <div className="skeleton w-12 h-4" />
      </td>
    </tr>
  );
}

export function TaskTable({
  tasks,
  loading,
  onEdit,
  onDelete,
  onView,
  sortBy,
  sortOrder,
  onSort,
}: TaskTableProps) {
  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider
                    ${col.sortable && onSort ? "cursor-pointer hover:text-white transition-colors select-none" : ""}
                  `}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && sortBy === col.key && (
                      <ArrowUpDown
                        size={13}
                        className={`text-blue-400 ${
                          sortOrder === "asc" ? "rotate-180" : ""
                        } transition-transform`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState />
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

