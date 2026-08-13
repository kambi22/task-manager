import type { TaskStatus, TaskPriority } from "../types";

// ── Status configuration ─────────────────────────────────────────────
export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  Pending: {
    label: "Pending",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    dot: "bg-amber-400",
    border: "border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
  },
  InProgress: {
    label: "In Progress",
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    dot: "bg-blue-400",
    border: "border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.15)]",
  },
  Completed: {
    label: "Completed",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    border: "border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
  },
  Blocked: {
    label: "Blocked",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    dot: "bg-rose-400",
    border: "border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
  },
};

// ── Priority configuration ───────────────────────────────────────────
export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; bg: string; text: string; border: string }
> = {
  LOW: {
    label: "LOW",
    bg: "bg-cyan-500/10",
    text: "text-cyan-300",
    border: "border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]",
  },
  MEDIUM: {
    label: "MEDIUM",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
  },
  HIGH: {
    label: "HIGH",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    border: "border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
  },
  URGENT: {
    label: "URGENT",
    bg: "bg-red-500/15",
    text: "text-red-300",
    border: "border border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.25)]",
  },
};


// ── Dropdown options ─────────────────────────────────────────────────
export const STATUS_OPTIONS: TaskStatus[] = [
  "Pending",
  "InProgress",
  "Completed",
  "Blocked",
];

export const PRIORITY_OPTIONS: TaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

// ── Navigation items ─────────────────────────────────────────────────
export const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { path: "/tasks", label: "Tasks", icon: "CheckSquare" },
  { path: "/team", label: "Team", icon: "Users" },
] as const;
