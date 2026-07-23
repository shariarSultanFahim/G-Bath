"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function DataPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: DataPaginationProps) {
  if (total === 0) return null;

  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 border-t border-border/40 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>
          Showing <strong className="text-foreground">{start}</strong> to{" "}
          <strong className="text-foreground">{end}</strong> of{" "}
          <strong className="text-foreground">{total}</strong> items
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-4">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-7 rounded-md border border-input bg-background px-2 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          title="First Page"
        >
          <ChevronsLeft className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          title="Previous Page"
        >
          <ChevronLeft className="size-3.5" />
        </Button>

        <span className="px-2 font-medium text-foreground">
          Page {page} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          title="Next Page"
        >
          <ChevronRight className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          title="Last Page"
        >
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
