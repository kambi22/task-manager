import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder = "Select...",
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-3.5 py-2.5 rounded-lg
          bg-slate-900/50 border border-slate-700/50
          text-slate-100
          focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40
          transition-all duration-200
          text-sm appearance-none cursor-pointer
          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')]
          bg-[position:right_12px_center] bg-no-repeat
          ${error ? "border-red-500/50 focus:ring-red-500/40" : ""}
          ${className}
        `}
        {...props}
      >
        <option value="" className="bg-slate-800 text-slate-400">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-slate-800 text-slate-100"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
