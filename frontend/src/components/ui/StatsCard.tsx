import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  secondaryIcon?: ReactNode;
  gradient: "blue" | "teal" | "orange" | "pink" | "purple";
  change?: string;
}

const gradientClasses = {
  blue: "gradient-blue",
  teal: "gradient-teal",
  orange: "gradient-orange",
  pink: "gradient-pink",
  purple: "gradient-purple",
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
        relative overflow-hidden rounded-3xl p-6
        ${gradientClasses[gradient]}
        hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-out
        border border-white/20 shadow-xl group cursor-pointer
      `}
    >
      {/* Subtle overlay shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-sm">
            {icon}
          </div>
          <span className="text-sm font-semibold text-white/90 tracking-wide">
            {title}
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {change && (
            <span className="text-xs font-bold text-white bg-white/25 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30 shadow-sm">
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
    <div className="rounded-3xl p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="skeleton w-9 h-9 rounded-xl" />
          <div className="skeleton w-24 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between mt-2">
        <div className="skeleton w-28 h-9" />
        <div className="skeleton w-12 h-6 rounded-full" />
      </div>
    </div>
  );
}
