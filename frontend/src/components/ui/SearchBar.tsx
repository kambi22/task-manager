import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search tasks, members, projects...",
  onClear,
}: SearchBarProps) {
  return (
    <div className="relative flex-1 min-w-[240px]">
      <Search
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
      />
      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full pl-11 ${onClear ? "pr-10" : "pr-4"} py-2.5 rounded-2xl
          glass-input text-[var(--text-primary)] placeholder-[var(--text-muted)]
          focus:outline-none transition-all duration-200
          text-sm font-medium shadow-inner
        `}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
