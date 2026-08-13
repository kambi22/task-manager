/**
 * Format an ISO date string to "Oct 28, 2023" format.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date to relative time (e.g. "2 hours ago").
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(dateString);
}

/**
 * Check if a date is in the past (overdue).
 */
export function isOverdue(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
}
