import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  UserCog,
  Zap,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar } from "../ui/Avatar";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/tasks", icon: CheckSquare, label: "Tasks" },
  { path: "/team", icon: Users, label: "Team" },
  { path: "/users", icon: UserCog, label: "Users" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const filteredNavItems = navItems.filter((item) => {
    if (item.path === "/users") {
      return user?.role === "ADMIN";
    }
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden animate-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside Drawer */}
      <aside
        className={`
          fixed top-0 left-0 lg:top-4 lg:left-4 h-screen lg:h-[calc(100vh-2rem)] w-[230px]
          glass-sidebar lg:rounded-3xl flex flex-col z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-lg shadow-blue-500/30 flex items-center justify-center">
              <Zap size={20} className="text-white fill-white/20" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-slate-700/40 text-white border border-white/15 shadow-lg shadow-black/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={19}
                    className={`transition-colors ${
                      isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span className="tracking-wide">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/80" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout Footer */}
        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          {user && (
            <div className="flex items-center gap-3 px-2">
              <Avatar name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
