"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { Deal } from "../types";
import { DataTableShell } from "./data-table-shell";
import { StatusBadge } from "./common/status-badge";
import { EntityActionMenu } from "./common/entity-action-menu";
import { useEntityTable } from "../hooks";

interface DealTableProps {
  deals: Deal[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

const columns: ColumnDef<Deal>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Tümünü seç"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Satırı seç"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      `${row.original.currency === "USD" ? "$" : ""}${row.original.value.toLocaleString()}`,
  },
  {
    accessorKey: "stage",
    header: "Aşama",
    cell: ({ row }) => (
      <StatusBadge status={row.original.stage} type="deal" />
    ),
  },
  {
    accessorKey: "probability",
    header: "Olasılık",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.probability}%</span>
        <div className="bg-secondary h-2 w-16 rounded-full">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${row.original.probability}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    accessorKey: "customerId",
    header: "Müşteri",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EntityActionMenu
        entityId={row.original.id}
        basePath="/crm/deals"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export function DealTable({ deals, toolbar }: DealTableProps) {
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
