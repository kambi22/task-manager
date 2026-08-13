import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  gradient: "blue" | "teal" | "orange" | "pink";
  change?: string;
}

const gradientClasses = {
  blue: "gradient-blue",
  teal: "gradient-teal",
  orange: "gradient-orange",
  pink: "gradient-pink",
};

export function StatsCard({
  title,
  value,
  icon,
  gradient,
  change,
}: StatsCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5
        ${gradientClasses[gradient]}
        hover:scale-[1.02] transition-transform duration-300 ease-out
        shadow-lg
      `}
    >
      {/* Background icon (decorative, top-right) */}
      <div className="absolute top-3 right-3 opacity-30 text-white">
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-white/20 text-white">{icon}</div>
          <span className="text-sm font-medium text-white/90">{title}</span>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-white tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {change && (
            <span className="text-xs font-semibold text-white/80 bg-white/20 px-2 py-0.5 rounded-full mb-1">
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton variant ─────────────────────────────────────────────────
export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl p-5 bg-slate-800/50 border border-slate-700/30">
      <div className="flex items-center gap-2 mb-3">
        <div className="skeleton w-8 h-8 rounded-lg" />
        <div className="skeleton w-20 h-4" />
      </div>
      <div className="skeleton w-24 h-9 mt-1" />
    </div>
  );
}
