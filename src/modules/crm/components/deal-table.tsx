"use client";

import * as React from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/table-select-column";
import { createLifecycleColumn, createActionsColumn } from "@/components/table-column-factory";
import { Deal, Lifecycle } from "../types";
import { formatMoney } from "@/lib/currency";
import { DataTableShell } from "./data-table-shell";
import { StatusBadge } from "./common/status-badge";
import { useEntityTable } from "../hooks";

interface DealTableProps {
  deals: Deal[];
  lifecycles?: Lifecycle[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

function buildColumns(lifecycles: Lifecycle[] | undefined): ColumnDef<Deal>[] {
  const lifecycleById = lifecycles
    ? new Map(lifecycles.map((lifecycle) => [lifecycle.id, lifecycle]))
    : null;

  return [
  createSelectColumn<Deal>(),
  {
    accessorKey: "title",
    header: "Başlık",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "value",
    header: "Değer",
    cell: ({ row }) =>
      formatMoney(row.original.value, row.original.currency),
  },
  {
    accessorKey: "stage",
    header: "Aşama",
    cell: ({ row }) => (
      <StatusBadge status={row.original.stage} type="deal" />
    ),
  },
  createLifecycleColumn<Deal>(lifecycleById),
  {
    accessorKey: "expectedCloseDate",
    header: "Tahmini Kapanış",
    cell: ({ row }) =>
      row.original.expectedCloseDate
        ? new Date(
            row.original.expectedCloseDate,
          ).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "personId",
    header: "Kişi",
    cell: ({ row }) => (
      <Link
        href={`/crm/persons/${row.original.personId}`}
        className="text-primary hover:underline"
      >
        {row.original.personId}
      </Link>
    ),
  },
  createActionsColumn<Deal>("/crm/deals"),
];
}

export function DealTable({ deals, lifecycles, toolbar }: DealTableProps) {
  const columns = React.useMemo(
    () => buildColumns(lifecycles),
    [lifecycles]
  );
  const { table } = useEntityTable({
    data: deals,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <DataTableShell
      table={table}
      columnCount={columns.length}
      toolbar={toolbar}
    />
  );
}
