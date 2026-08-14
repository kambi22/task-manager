import { useState } from "react";
import { useTaskHistory } from "../hooks/useTaskHistory";
import { PageHeader } from "../components/layout/PageHeader";
import { Pagination } from "../components/ui/Pagination";
import { SearchBar } from "../components/ui/SearchBar";
import { Select } from "../components/ui/Select";
import { formatRelativeTime } from "../utils/formatDate";
import { History, User as UserIcon, Calendar, Activity } from "lucide-react";

export default function TaskHistoryPage() {
  const { history, pagination, loading, params, updateParams } = useTaskHistory({
    limit: 15,
  });

  const [search, setSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // We can filter locally or update query param. Let's filter locally for title/user for instant search,
    // or let's use the local state to search through loaded rows or we can pass it if we want.
    // Since search is not directly supported by backend task-history API (which filters by exact taskId / userId),
    // local filtering of the loaded page is a great fallback, or we can just filter history locally.
    // Let's filter locally so it's super fast and interactive!
  };

  const filteredHistory = history.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.taskTitle.toLowerCase().includes(term) ||
      item.userName.toLowerCase().includes(term) ||
      (item.details?.message && item.details.message.toLowerCase().includes(term)) ||
      (item.details?.changes &&
        item.details.changes.some((c) => c.toLowerCase().includes(term)))
    );
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "UPDATE":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "DELETE":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Activity History"
        subtitle="Tracked audit logs of all task actions"
      />

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[var(--bg-elevated)] p-4 rounded-2xl border border-[var(--border-subtle)] backdrop-blur-xl">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search task or user..."
          />
        </form>

        <div className="flex gap-3 w-full md:w-auto justify-end">
          <div className="w-44">
            <Select
              value={params.action || ""}
              onChange={(e) => updateParams({ action: (e.target.value as any) || undefined, page: 1 })}
              options={[
                { value: "", label: "All Actions" },
                { value: "CREATE", label: "Created" },
                { value: "UPDATE", label: "Updated" },
                { value: "DELETE", label: "Deleted" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-[var(--bg-elevated)] rounded-3xl border border-[var(--border-subtle)] overflow-hidden backdrop-blur-xl shadow-xl">
        {loading ? (
          <div className="p-12 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-[var(--bg-hover)] rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--bg-hover)] rounded-md w-1/4" />
                  <div className="h-3 bg-[var(--bg-hover)] rounded-md w-1/2" />
                </div>
                <div className="w-24 h-4 bg-[var(--bg-hover)] rounded-md" />
              </div>
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <History size={28} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              No activity logs found
            </h3>
            <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mt-1">
              {search || params.action
                ? "Try adjusting your search query or filter settings."
                : "Activity history will appear here once tasks are modified."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-[var(--bg-hover)] transition-colors duration-200"
              >
                {/* Left side: Action Icon + Task + Details */}
                <div className="flex gap-4 items-start flex-1">
                  <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] flex-shrink-0">
                    <Activity size={20} className="text-blue-400" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-[var(--text-primary)] tracking-wide">
                        {item.taskTitle}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wider ${getActionBadgeColor(
                          item.action
                        )}`}
                      >
                        {item.action}
                      </span>
                    </div>

                    {/* Change logs */}
                    {item.details?.changes && item.details.changes.length > 0 ? (
                      <ul className="space-y-1 pl-1">
                        {item.details.changes.map((change, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-[var(--text-muted)] flex items-start gap-1.5"
                          >
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)]">
                        {item.details?.message || `Task activity logged.`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: User & Time */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium bg-[var(--bg-hover)] px-2.5 py-1 rounded-xl border border-[var(--border-glass)]">
                    <UserIcon size={12} className="text-[var(--text-muted)]" />
                    <span>{item.userName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-dimmed)]">
                    <Calendar size={11} />
                    <span>{formatRelativeTime(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={(page) => updateParams({ page })}
        />
      )}
    </div>
  );
}
