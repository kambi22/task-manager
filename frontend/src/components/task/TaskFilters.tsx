import { useState, useEffect } from "react";
import { SearchBar } from "../ui/SearchBar";
import { Plus } from "lucide-react";
import type { TaskStatus, TaskPriority, TaskQueryParams, User } from "../../types";
import { STATUS_OPTIONS, PRIORITY_OPTIONS, STATUS_CONFIG, PRIORITY_CONFIG } from "../../utils/constants";
import { useDebounce } from "../../hooks/useDebounce";

interface TaskFiltersProps {
  params: TaskQueryParams;
  onUpdateParams: (params: Partial<TaskQueryParams>) => void;
  onCreateClick: () => void;
  users?: User[];
}

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest" },
  { value: "createdAt:asc", label: "Oldest" },
  { value: "dueDate:asc", label: "Earliest" },
  { value: "dueDate:desc", label: "Latest" },
  { value: "priority:desc", label: "High to Low" },
  { value: "priority:asc", label: "Low to High" },
  { value: "title:asc", label: "A - Z" },
  { value: "title:desc", label: "Z - A" },
];

export function TaskFilters({
  params,
  onUpdateParams,
  onCreateClick,
  users = [],
}: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(params.search || "");
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch !== params.search) {
      onUpdateParams({ search: debouncedSearch || undefined });
    }
  }, [debouncedSearch]);

  const currentSortValue =
    params.sortBy && params.sortOrder ? `${params.sortBy}:${params.sortOrder}` : "";

  const handleSortChange = (value: string) => {
    if (!value) {
      onUpdateParams({ sortBy: undefined, sortOrder: undefined });
    } else {
      const [sortBy, sortOrder] = value.split(":");
      onUpdateParams({ sortBy, sortOrder: sortOrder as "asc" | "desc" });
    }
  };

  const filterSelectClass = `
    flex-1 sm:flex-none px-4 py-2.5 rounded-2xl
    glass-input text-sm font-medium text-[var(--text-secondary)]
    focus:outline-none transition-all cursor-pointer appearance-none
    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')]
    bg-[position:right_14px_center] bg-no-repeat pr-10
  `;

  return (
    <div className="space-y-3 mb-2">
      {/* Top Filter Row: Search, Assignee, Status, Priority & Create Task */}
      <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-3">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search tasks by title or description..."
        />

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Assignee Filter */}
          <select
            id="filter-assignee"
            value={params.assignee || ""}
            onChange={(e) =>
              onUpdateParams({
                assignee: e.target.value || undefined,
              })
            }
            className={`${filterSelectClass} min-w-[150px]`}
          >
            <option value="" className="bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
              All Assignees
            </option>
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                {u.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            id="filter-status"
            value={params.status || ""}
            onChange={(e) =>
              onUpdateParams({
                status: (e.target.value as TaskStatus) || undefined,
              })
            }
            className={`${filterSelectClass} min-w-[150px]`}
          >
            <option value="" className="bg-[var(--bg-elevated)] text-[var(--text-secondary)]">Filter by Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            id="filter-priority"
            value={params.priority || ""}
            onChange={(e) =>
              onUpdateParams({
                priority: (e.target.value as TaskPriority) || undefined,
              })
            }
            className={`${filterSelectClass} min-w-[140px]`}
          >
            <option value="" className="bg-[var(--bg-elevated)] text-[var(--text-secondary)]">Priority</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p} className="bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                {PRIORITY_CONFIG[p].label}
              </option>
            ))}
          </select>
        </div>

        {/* Create Task button */}
        <button
          onClick={onCreateClick}
          className="
            w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-2
            px-5 py-2.5 rounded-2xl text-sm font-semibold text-white
            bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600
            hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98]
            shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
            transition-all duration-200 cursor-pointer border border-white/20
          "
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {/* Sort filter: Below Create Task button, above table top right corner */}
      <div className="flex justify-end">
        <select
          id="filter-sort"
          aria-label="Sort tasks"
          value={currentSortValue}
          onChange={(e) => handleSortChange(e.target.value)}
          className={`${filterSelectClass} min-w-[130px]`}
        >
          <option value="" className="bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
            Sort By
          </option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
