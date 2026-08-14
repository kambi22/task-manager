import { useState, useEffect } from "react";
import type { Comment } from "../../types";
import { getComments, createComment, deleteComment } from "../../api/commentApi";
import { Avatar } from "../ui/Avatar";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { formatRelativeTime } from "../../utils/formatDate";
import { Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

interface CommentSectionProps {
  taskId: string;
}

export function CommentSection({ taskId }: CommentSectionProps) {
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(taskId);
      setComments(data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    setSubmitting(true);
    try {
      await createComment(taskId, {
        comment: commentText,
        userId: currentUser.id,
      });
      setCommentText("");
      toast.success("Comment added");
      fetchComments();
    } catch (err: any) {
      toast.error(err.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteComment(taskId, deleteTarget.id);
      toast.success("Comment deleted");
      setDeleteTarget(null);
      fetchComments();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete comment");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comments list */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mb-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton w-24 h-3" />
                  <div className="skeleton w-full h-10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-[var(--text-dimmed)] text-center py-6">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 group animate-fade-in"
            >
              <Avatar name={comment.user.name} size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">
                    {comment.user.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-dimmed)]">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                  {currentUser && (currentUser.role === "ADMIN" || comment.userId === currentUser.id) && (
                    <button
                      onClick={() => setDeleteTarget(comment)}
                      className="ml-auto p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--text-dimmed)] hover:text-red-400 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg px-3 py-2">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        {currentUser && (
          <div className="flex-shrink-0">
            <Avatar name={currentUser.name} size="sm" />
          </div>
        )}
        <div className="relative flex-1">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="
              w-full px-3 py-2 pr-10 rounded-lg text-sm
              bg-[var(--bg-input)] border border-[var(--border-input)]
              text-[var(--text-secondary)] placeholder-[var(--text-dimmed)]
              focus:outline-none focus:ring-1 focus:ring-blue-500/30
              transition-all
            "
          />
          <button
            type="submit"
            disabled={!commentText.trim() || submitting}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              p-1 rounded text-blue-400 hover:text-blue-300
              disabled:text-[var(--text-dimmed)] disabled:cursor-not-allowed
              transition-colors cursor-pointer
            "
          >
            <Send size={14} />
          </button>
        </div>
      </form>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}
