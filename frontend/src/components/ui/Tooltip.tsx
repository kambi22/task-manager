import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({ content, children, disabled = false, className = "" }: TooltipProps) {
  if (disabled || !content) return <>{children}</>;

  return (
    <div className={`relative group inline-block w-full ${className}`}>
      {children}
      
      {/* Tooltip Content panel */}
      <div className="
        absolute z-[9999] bottom-full left-1/2 -translate-x-1/2 mb-2
        hidden group-hover:flex flex-col items-center
        pointer-events-none transition-all duration-200
        opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100
      ">
        <div className="
          bg-slate-950/95 backdrop-blur-md border border-white/10 text-white text-xs font-semibold
          px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap text-center
          max-w-xs leading-normal tracking-wide
        ">
          {content}
        </div>
        
        {/* Pointer Arrow */}
        <div className="w-2.5 h-2.5 bg-slate-950 border-r border-b border-white/10 rotate-45 -mt-1.5 shadow-sm" />
      </div>
    </div>
  );
}
