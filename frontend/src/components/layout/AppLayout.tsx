import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu, Zap } from "lucide-react";

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 flex flex-col lg:flex-row overflow-hidden selection:bg-blue-500/30">
      {/* ── Ambient Background Glow Blobs for Glassmorphism ───────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left Indigo / Cyan Glow */}
        <div className="absolute -top-32 -left-20 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/25 via-blue-600/20 to-cyan-500/20 rounded-full blur-[120px] opacity-70 animate-pulse duration-10000" />
        {/* Top-right Purple / Magenta Glow */}
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/20 via-pink-600/15 to-blue-600/20 rounded-full blur-[140px] opacity-60" />
        {/* Bottom-left Emerald / Teal Glow */}
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-gradient-to-tl from-teal-600/20 via-emerald-600/15 to-indigo-600/20 rounded-full blur-[150px] opacity-50" />
        {/* Overlay grid subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.15]" />
      </div>

      {/* Mobile Header Bar (< 1024px) */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-md shadow-blue-500/30">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            TaskFlow
          </span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content area — 100% width on mobile, offset on desktop */}
      <main className="relative z-10 flex-1 w-full lg:ml-[230px] min-h-screen p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <Outlet />
      </main>


    </div>
  );
}

