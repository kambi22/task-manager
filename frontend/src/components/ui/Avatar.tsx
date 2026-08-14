interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Generate a consistent color from a name string
function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-600",
    "bg-emerald-600",
    "bg-purple-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-cyan-600",
    "bg-indigo-600",
    "bg-teal-600",
    "bg-orange-600",
    "bg-pink-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const sizeClasses = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-12 h-12 text-sm",
};

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const bg = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`
        ${sizeClasses[size]} ${bg}
        rounded-full flex items-center justify-center
        text-white font-semibold
        ring-2 ring-[var(--bg-primary)]
        flex-shrink-0
        ${className}
      `}
      title={name}
    >
      {initials}
    </div>
  );
}
