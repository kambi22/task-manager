import type { TaskStatus, TaskPriority } from "../types";

// ── Status configuration ─────────────────────────────────────────────
export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  Pending: {
    label: "Pending",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  InProgress: {
    label: "In Progress",
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  Completed: {
    label: "Completed",
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  Blocked: {
    label: "Blocked",
    bg: "bg-red-500/15",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

// ── Priority configuration ───────────────────────────────────────────
export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; bg: string; text: string }
> = {
  LOW: {
    label: "LOW",
    bg: "bg-slate-500/15",
    text: "text-slate-400",
  },
  MEDIUM: {
    label: "MEDIUM",
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
  },
  HIGH: {
    label: "HIGH",
    bg: "bg-orange-500/15",
    text: "text-orange-400",
  },
  URGENT: {
    label: "URGENT",
    bg: "bg-red-500/15",
    text: "text-red-400",
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
