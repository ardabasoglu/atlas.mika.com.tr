"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { Lifecycle } from "../types";
import { DataTableShell } from "./data-table-shell";
import { EntityActionMenu } from "./common/entity-action-menu";
import { useEntityTable } from "../hooks";

interface LifecycleTableProps {
  lifecycles: Lifecycle[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

const columns: ColumnDef<Lifecycle>[] = [
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
    accessorKey: "order",
    header: "Sıra",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.order}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Ad",
  },
  {
    accessorKey: "description",
    header: "Açıklama",
    cell: ({ row }) => row.original.description ?? "-",
  },
  {
    accessorKey: "color",
    header: "Renk",
    cell: ({ row }) =>
      row.original.color ? (
        <span
          className="inline-block size-4 rounded-full border"
          style={{ backgroundColor: row.original.color }}
          aria-hidden
        />
      ) : (
        "-"
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EntityActionMenu
        entityId={row.original.id}
        basePath="/crm/lifecycle"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export function LifecycleTable({ lifecycles, toolbar }: LifecycleTableProps) {
  const { table } = useEntityTable({
    data: lifecycles,
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
