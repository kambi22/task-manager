import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { Menu, Zap } from "lucide-react";

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col lg:flex-row">
      {/* Mobile Header Bar (< 1024px) */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-100 tracking-tight">
            TaskFlow
          </span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-300 focus:outline-none"
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content area — 100% width on mobile, offset on desktop */}
      <main className="flex-1 w-full lg:ml-[220px] min-h-screen p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(51, 65, 85, 0.5)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#1e293b",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1e293b",
            },
          },
        }}
      />
    </div>
  );
}
