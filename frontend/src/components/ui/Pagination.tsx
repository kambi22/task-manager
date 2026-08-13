import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "../../types";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, hasPrevPage, hasNextPage } = pagination;

  if (totalPages <= 1) return null;

  // Build page numbers to display
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <span className="text-sm text-slate-500">
        Page {page} of {totalPages} ({pagination.total} results)
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-500 text-sm">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`
                min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-white/5"
                }
              `}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
