"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  type Row,
} from "@tanstack/react-table";

const DEFAULT_PAGE_SIZE = 10;

export interface UseEntityTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  defaultPageSize?: number;
  enableRowSelection?: boolean;
  getRowId?: (row: TData, index: number, parent?: Row<TData>) => string;
}

export interface UseEntityTableReturn<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  currentPage: number;
  pageSize: number;
}

export function useEntityTable<TData>({
  data,
  columns,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  enableRowSelection = true,
  getRowId,
}: UseEntityTableOptions<TData>): UseEntityTableReturn<TData> {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return {
    table,
    pagination,
    setPagination,
    currentPage: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  };
}

export { DEFAULT_PAGE_SIZE as TABLE_PAGE_SIZE };
