import { useState, useRef } from "react";
import type { Task, Attachment } from "../../types";
import { uploadAttachment, deleteAttachment } from "../../api/attachmentApi";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { formatRelativeTime } from "../../utils/formatDate";
import {
  FileText,
  Image as ImageIcon,
  FileArchive,
  FileSpreadsheet,
  Video,
  Music,
  File,
  Download,
  Trash2,
  Paperclip,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import axiosClient from "../../api/axiosClient";

interface AttachmentSectionProps {
  task: Task;
  onRefresh: () => void;
}

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function getFileIcon(mimeType: string) {
  const mimeLower = mimeType.toLowerCase();
  if (mimeLower.startsWith("image/")) return <ImageIcon className="text-emerald-400" size={18} />;
  if (mimeLower === "application/pdf") return <FileText className="text-rose-400" size={18} />;
  if (
    mimeLower.includes("zip") ||
    mimeLower.includes("tar") ||
    mimeLower.includes("rar") ||
    mimeLower.includes("7z")
  ) {
    return <FileArchive className="text-amber-400" size={18} />;
  }
  if (mimeLower.includes("sheet") || mimeLower.includes("excel") || mimeLower.includes("csv")) {
    return <FileSpreadsheet className="text-green-400" size={18} />;
  }
  if (mimeLower.startsWith("video/")) return <Video className="text-indigo-400" size={18} />;
  if (mimeLower.startsWith("audio/")) return <Music className="text-violet-400" size={18} />;
  return <File className="text-blue-400" size={18} />;
}

export function AttachmentSection({ task, onRefresh }: AttachmentSectionProps) {
  const { user: currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Attachment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const attachments = task.attachments || [];
  const isAdmin = currentUser?.role === "ADMIN";
  const isAssignee = task.assignedTo === currentUser?.id;
  const canModify = isAdmin || isAssignee;

  const getFullUrl = (relativeUrl: string) => {
    const base = axiosClient.defaults.baseURL || "http://localhost:3000/api";
    const serverBase = base.replace(/\/api$/, "");
    return `${serverBase}${relativeUrl}`;
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Enforce 10MB limit in client too
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit");
      return;
    }

    setUploading(true);
    try {
      await uploadAttachment(task.id, file);
      toast.success("File uploaded successfully");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAttachment(task.id, deleteTarget.id);
      toast.success("Attachment deleted");
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete file");
    } finally {
      setDeleting(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canModify) setDragOver(true);
  };

  const onDragLeave = () => {
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (canModify) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  return (
    <div className="mt-4 stagger-children">
      {/* Upload Zone */}
      {canModify ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
            ${
              dragOver
                ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
                : "border-[var(--border-input)] hover:border-blue-500/50 hover:bg-[var(--bg-hover)]"
            }
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="animate-spin text-blue-500" size={24} />
                <p className="text-sm font-medium text-[var(--text-secondary)]">Uploading file...</p>
              </>
            ) : (
              <>
                <Paperclip className="text-[var(--text-muted)] group-hover:text-blue-400 transition-colors" size={24} />
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  Drag & drop file here, or <span className="text-blue-400 hover:text-blue-300">browse</span>
                </p>
                <p className="text-xs text-[var(--text-dimmed)]">Maximum file size: 10MB</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-[var(--border-glass)] rounded-xl p-4 text-center bg-[var(--bg-card)]">
          <p className="text-xs text-[var(--text-dimmed)]">
            Only the task assignee and Admins can upload attachments.
          </p>
        </div>
      )}

      {/* Attachments List */}
      <div className="mt-6 space-y-2">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Files ({attachments.length})
        </h3>

        {attachments.length === 0 ? (
          <p className="text-xs text-[var(--text-dimmed)] text-center py-6">
            No attachments yet.
          </p>
        ) : (
          attachments.map((file) => (
            <div
              key={file.id}
              className="
                flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-glass)]
                hover:border-blue-500/20 group transition-all duration-300 animate-fade-in
              "
            >
              <div className="p-2 bg-[var(--bg-hover)] rounded-lg flex-shrink-0">
                {getFileIcon(file.mimeType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-secondary)] truncate group-hover:text-[var(--text-primary)] transition-colors">
                  {file.fileName}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[var(--text-dimmed)]">
                  <span>{formatBytes(file.fileSize)}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(file.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={getFullUrl(file.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.fileName}
                  className="
                    p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-blue-400
                    transition-all cursor-pointer
                  "
                  title="Download File"
                >
                  <Download size={14} />
                </a>
                {canModify && (
                  <button
                    onClick={() => setDeleteTarget(file)}
                    className="
                      p-1.5 rounded-lg hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-400
                      transition-all cursor-pointer
                    "
                    title="Delete File"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Attachment"
        message={`Are you sure you want to delete "${deleteTarget?.fileName}"? This action cannot be undone and will delete the file permanently.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}
