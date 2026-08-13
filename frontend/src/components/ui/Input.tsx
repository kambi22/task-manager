import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3.5 py-2.5 rounded-lg
          bg-slate-900/50 border border-slate-700/50
          text-slate-100 placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40
          transition-all duration-200
          text-sm
          ${error ? "border-red-500/50 focus:ring-red-500/40" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Textarea variant ─────────────────────────────────────────────────
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full px-3.5 py-2.5 rounded-lg
          bg-slate-900/50 border border-slate-700/50
          text-slate-100 placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40
          transition-all duration-200
          text-sm resize-none
          ${error ? "border-red-500/50 focus:ring-red-500/40" : ""}
          ${className}
        `}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
