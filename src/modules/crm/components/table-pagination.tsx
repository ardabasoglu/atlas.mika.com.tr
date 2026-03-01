"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DEFAULT_PAGE_SIZE = 10;

export interface TablePaginationProps {
  totalCount: number;
  pageSize?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  totalCount,
  pageSize = DEFAULT_PAGE_SIZE,
  currentPage,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  if (totalCount <= pageSize) {
    return (
      <div className="text-muted-foreground text-sm py-2">
        Toplam {totalCount} kayıt
      </div>
    );
  }

  const pageNumbers: (number | "ellipsis")[] = [];
  const showPages = 3;
  let from = Math.max(1, currentPage - 1);
  let to = Math.min(totalPages, currentPage + 1);
  if (currentPage <= 2) to = Math.min(totalPages, showPages);
  if (currentPage >= totalPages - 1) from = Math.max(1, totalPages - showPages + 1);
  if (from > 1) pageNumbers.push(1, "ellipsis");
  for (let index = from; index <= to; index++) pageNumbers.push(index);
  if (to < totalPages) pageNumbers.push("ellipsis", totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-3">
      <p className="text-muted-foreground text-sm">
        {startItem}-{endItem} / {totalCount} kayıt
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              aria-disabled={currentPage <= 1}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
              }
              text="Önceki"
            />
          </PaginationItem>
          {pageNumbers.map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <span className="flex size-8 items-center justify-center px-0">
                  …
                </span>
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              aria-disabled={currentPage >= totalPages}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              text="Sonraki"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export const TABLE_PAGE_SIZE = DEFAULT_PAGE_SIZE;
