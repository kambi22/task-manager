import { useState } from "react";
import { useAuditLogs } from "../hooks/useAuditLogs";
import { useUsers } from "../hooks/useUsers";
import { PageHeader } from "../components/layout/PageHeader";
import { Pagination } from "../components/ui/Pagination";
import { SearchBar } from "../components/ui/SearchBar";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { formatRelativeTime, formatDate } from "../utils/formatDate";
import {
  ShieldAlert,
  User,
  Terminal,
  Globe,
  Calendar,
  Eye,
  RefreshCw,
  Info,
  Server
} from "lucide-react";
import type { AuditLog } from "../types";

export default function AuditLogsPage() {
  const { users } = useUsers();
  const {
    auditLogs,
    pagination,
    loading,
    error,
    params,
    updateParams,
    refresh
  } = useAuditLogs({
    limit: 15,
  });

  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search });
  };

  const handleSearchClear = () => {
    setSearch("");
    updateParams({ search: "" });
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes("DELETE")) {
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
    if (action.includes("CREATE") || action.includes("ADD") || action.includes("UPLOAD") || action.includes("SIGNUP")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    if (action.includes("UPDATE") || action.includes("ROLE") || action.includes("EDIT")) {
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  const getResourceBadgeColor = (resource: string) => {
    switch (resource) {
      case "Auth":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "User":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Task":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Comment":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Attachment":
        return "bg-teal-500/10 text-teal-400 border-teal-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const userOptions = [
    { value: "", label: "All Users" },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title="Audit Logs"
          subtitle="System-wide security and data modification audit trails"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => refresh()}
          className="flex items-center gap-2 border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col gap-4 bg-[var(--bg-elevated)] p-5 rounded-2xl border border-[var(--border-subtle)] backdrop-blur-xl shadow-md">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search user, action, resource ID..."
              onClear={handleSearchClear}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto px-6 py-2">
            Search
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-[var(--text-muted)] font-medium mb-1.5 block">
              Filter by User
            </label>
            <Select
              value={params.userId || ""}
              onChange={(e) => updateParams({ userId: e.target.value || undefined })}
              options={userOptions}
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] font-medium mb-1.5 block">
              Filter by Resource
            </label>
            <Select
              value={params.resource || ""}
              onChange={(e) => updateParams({ resource: e.target.value || undefined })}
              options={[
                { value: "", label: "All Resources" },
                { value: "Auth", label: "Auth (Sign-in/out)" },
                { value: "User", label: "Users" },
                { value: "Task", label: "Tasks" },
                { value: "Comment", label: "Comments" },
                { value: "Attachment", label: "Attachments" },
              ]}
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] font-medium mb-1.5 block">
              Filter by Action Type
            </label>
            <Select
              value={params.action || ""}
              onChange={(e) => updateParams({ action: e.target.value || undefined })}
              options={[
                { value: "", label: "All Actions" },
                { value: "USER_LOGIN", label: "User Login" },
                { value: "USER_SIGNUP", label: "User Signup" },
                { value: "USER_CREATE", label: "User Create" },
                { value: "USER_UPDATE", label: "User Update" },
                { value: "USER_DELETE", label: "User Delete" },
                { value: "TASK_CREATE", label: "Task Create" },
                { value: "TASK_UPDATE", label: "Task Update" },
                { value: "TASK_DELETE", label: "Task Delete" },
                { value: "COMMENT_ADD", label: "Comment Add" },
                { value: "COMMENT_DELETE", label: "Comment Delete" },
                { value: "ATTACHMENT_UPLOAD", label: "Attachment Upload" },
                { value: "ATTACHMENT_DELETE", label: "Attachment Delete" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm flex gap-3 items-center">
          <Info size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="bg-[var(--bg-elevated)] rounded-3xl border border-[var(--border-subtle)] overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-hover)]">
                <th className="p-4 text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">
                  Action
                </th>
                <th className="p-4 text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">
                  Resource
                </th>
                <th className="p-4 text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">
                  User / Actor
                </th>
                <th className="p-4 text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">
                  IP Address
                </th>
                <th className="p-4 text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">
                  Time
                </th>
                <th className="p-4 text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-[var(--bg-hover)] rounded w-24" /></td>
                    <td className="p-4"><div className="h-4 bg-[var(--bg-hover)] rounded w-16" /></td>
                    <td className="p-4"><div className="h-4 bg-[var(--bg-hover)] rounded w-32" /></td>
                    <td className="p-4"><div className="h-4 bg-[var(--bg-hover)] rounded w-20" /></td>
                    <td className="p-4"><div className="h-4 bg-[var(--bg-hover)] rounded w-24" /></td>
                    <td className="p-4"><div className="h-4 bg-[var(--bg-hover)] rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-sm text-[var(--text-muted)]">
                    <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                      <ShieldAlert size={24} />
                    </div>
                    <p className="font-semibold text-[var(--text-primary)]">No audit logs found</p>
                    <p className="text-xs mt-1">Try adjusting search parameters or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-[var(--bg-hover)] transition-colors duration-150 text-sm group"
                  >
                    <td className="p-4">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-xl border ${getResourceBadgeColor(
                          log.resource
                        )}`}
                      >
                        {log.resource}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          <User size={12} className="text-[var(--text-muted)]" />
                          {log.userName}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] pl-5">
                          {log.userEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-[var(--text-secondary)]">
                      {log.ipAddress || "—"}
                    </td>
                    <td className="p-4 text-xs text-[var(--text-secondary)]">
                      <div className="flex flex-col">
                        <span>{formatRelativeTime(log.createdAt)}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 rounded-xl hover:bg-[var(--bg-hover-strong)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all duration-200"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={(page) => updateParams({ page })}
        />
      )}

      {/* Log Details Modal */}
      <Modal
        isOpen={selectedLog !== null}
        onClose={() => setSelectedLog(null)}
        title="Audit Log Entry Details"
      >
        {selectedLog && (
          <div className="space-y-5 animate-fade-in text-sm text-[var(--text-secondary)]">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-glass)]">
                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                  Event Action
                </p>
                <p className="mt-1 font-semibold text-[var(--text-primary)] font-mono text-xs">
                  {selectedLog.action}
                </p>
              </div>
              <div className="bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-glass)]">
                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                  Resource Layer
                </p>
                <p className="mt-1 font-semibold text-[var(--text-primary)]">
                  {selectedLog.resource}
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-glass)] space-y-3">
              <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-blue-400" />
                Actor Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[var(--text-muted)] font-medium">Name:</span>{" "}
                  <span className="text-[var(--text-primary)] font-semibold">
                    {selectedLog.userName}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] font-medium">Email:</span>{" "}
                  <span className="text-[var(--text-primary)] font-semibold">
                    {selectedLog.userEmail}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] font-medium">User ID:</span>{" "}
                  <span className="text-[var(--text-secondary)] font-mono">
                    {selectedLog.userId || "System Action"}
                  </span>
                </div>
                {selectedLog.user?.role && (
                  <div>
                    <span className="text-[var(--text-muted)] font-medium">Role:</span>{" "}
                    <span className="text-[var(--text-primary)] font-bold text-[10px] border border-blue-500/20 bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
                      {selectedLog.user.role}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-glass)] space-y-3">
              <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-1.5 flex items-center gap-1.5">
                <Globe size={13} className="text-cyan-400" />
                Request Context
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">IP Address:</span>
                  <span className="text-[var(--text-primary)] font-mono">
                    {selectedLog.ipAddress || "Unknown"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[var(--text-muted)]">User Agent (Browser):</span>
                  <span className="text-[var(--text-secondary)] bg-[var(--bg-hover)] p-2 rounded-lg font-mono text-[10px] break-all leading-normal border border-[var(--border-subtle)]">
                    {selectedLog.userAgent || "Unknown User Agent"}
                  </span>
                </div>
              </div>
            </div>

            {selectedLog.resourceId && (
              <div className="bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-glass)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-medium flex items-center gap-1.5">
                  <Server size={12} className="text-purple-400" />
                  Target Resource ID:
                </span>
                <span className="text-[var(--text-primary)] font-mono bg-[var(--bg-hover)] px-2 py-1 rounded border border-[var(--border-subtle)]">
                  {selectedLog.resourceId}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs text-[var(--text-primary)] font-semibold flex items-center gap-1.5">
                <Terminal size={14} className="text-emerald-400" />
                Event Metadata (details)
              </span>
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-2xl overflow-auto text-xs border border-slate-800/80 shadow-inner font-mono max-h-60 leading-relaxed scrollbar-thin">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>

            <div className="flex justify-between items-center text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)]">
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {new Date(selectedLog.createdAt).toLocaleString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
                className="py-1 px-4 text-xs font-semibold"
              >
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
