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
    <div className="relative flex-1 min-w-[200px]">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-4 py-2.5 rounded-lg
          bg-slate-800/50 border border-slate-700/50
          text-slate-100 placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30
          transition-all duration-200
          text-sm
        "
      />
    </div>
  );
}
