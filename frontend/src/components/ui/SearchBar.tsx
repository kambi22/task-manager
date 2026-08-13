import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search tasks, members, projects...",
}: SearchBarProps) {
  return (
    <div className="relative flex-1 min-w-[240px]">
      <Search
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-11 pr-4 py-2.5 rounded-2xl
          glass-input text-slate-100 placeholder-slate-400
          focus:outline-none transition-all duration-200
          text-sm font-medium shadow-inner
        "
      />
    </div>
  );
}

