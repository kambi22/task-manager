import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay background covering full screen with blur */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md animate-overlay"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl animate-slide-up p-6 z-10">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-red-500/15">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
