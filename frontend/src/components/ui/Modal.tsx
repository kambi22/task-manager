import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 sm:p-6 overflow-y-auto">
      {/* Overlay background covering full screen with blur */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md animate-overlay"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className={`
          relative w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col
          bg-slate-900 border border-slate-700/70
          rounded-2xl shadow-2xl shadow-black/80
          animate-slide-up my-auto z-10 overflow-hidden
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-700/50 bg-slate-900/90 flex-shrink-0">
            <h2 className="text-base sm:text-lg font-semibold text-slate-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}
