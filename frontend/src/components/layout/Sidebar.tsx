import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  FolderKanban,
  Calendar,
  BarChart3,
  Settings,
  Zap,
  X,
} from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/tasks", icon: CheckSquare, label: "Tasks" },
  { path: "/team", icon: Users, label: "Team" },
  { path: "/projects", icon: FolderKanban, label: "Projects" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[220px] bg-slate-900/95 lg:bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-100 tracking-tight">
              TaskFlow
            </span>
          </div>

          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={18}
                    className={`transition-colors ${
                      isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800/60">
          <p className="text-[10px] text-slate-600 text-center">
            TaskFlow v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
