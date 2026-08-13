import { useState, useEffect } from "react";
import { SearchBar } from "../ui/SearchBar";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";
import type { TaskStatus, TaskPriority, TaskQueryParams } from "../../types";
import { STATUS_OPTIONS, PRIORITY_OPTIONS, STATUS_CONFIG, PRIORITY_CONFIG } from "../../utils/constants";
import { useDebounce } from "../../hooks/useDebounce";

interface TaskFiltersProps {
  params: TaskQueryParams;
  onUpdateParams: (params: Partial<TaskQueryParams>) => void;
  onCreateClick: () => void;
}

export function TaskFilters({
  params,
  onUpdateParams,
  onCreateClick,
}: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(params.search || "");
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch !== params.search) {
      onUpdateParams({ search: debouncedSearch || undefined });
    }
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-3 mb-5">
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        placeholder="Search tasks, members, projects..."
      />

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Status filter */}
        <select
          id="filter-status"
          value={params.status || ""}
          onChange={(e) =>
            onUpdateParams({
              status: (e.target.value as TaskStatus) || undefined,
            })
          }
          className="
            flex-1 sm:flex-none px-3.5 py-2.5 rounded-lg
            bg-slate-800/50 border border-slate-700/50
            text-sm text-slate-300
            focus:outline-none focus:ring-2 focus:ring-blue-500/30
            transition-all cursor-pointer appearance-none
            bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')]
            bg-[position:right_12px_center] bg-no-repeat pr-9 min-w-[140px]
          "
        >
          <option value="" className="bg-slate-800">Filter by Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-slate-800">
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
          className="
            flex-1 sm:flex-none px-3.5 py-2.5 rounded-lg
            bg-slate-800/50 border border-slate-700/50
            text-sm text-slate-300
            focus:outline-none focus:ring-2 focus:ring-blue-500/30
            transition-all cursor-pointer appearance-none
            bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')]
            bg-[position:right_12px_center] bg-no-repeat pr-9 min-w-[140px]
          "
        >
          <option value="" className="bg-slate-800">Filter by Priority</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p} className="bg-slate-800">
              {PRIORITY_CONFIG[p].label}
            </option>
          ))}
        </select>
      </div>

      {/* Create Task button */}
      <Button onClick={onCreateClick} className="w-full sm:w-auto sm:ml-auto">
        <Plus size={16} />
        Create Task
      </Button>
    </div>
  );
}
