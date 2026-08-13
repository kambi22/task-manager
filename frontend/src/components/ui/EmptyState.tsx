import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No tasks found",
  message = "Get started by creating a new task.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30 mb-4">
        <Inbox size={40} className="text-slate-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-300">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-xs">{message}</p>
    </div>
  );
}
