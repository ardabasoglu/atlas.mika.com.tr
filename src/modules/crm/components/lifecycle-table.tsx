"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/table-select-column";
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
  createSelectColumn<Lifecycle>(),
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
  const router = useRouter();
  const { table } = useEntityTable({
    data: lifecycles,
    columns,
    getRowId: (row) => row.id,
    meta: {
      onRowClick: (lifecycle: Lifecycle) => {
        router.push(`/crm/lifecycle/${lifecycle.id}`);
      },
    },
  });

  return (
    <DataTableShell
      table={table}
      columnCount={columns.length}
      toolbar={toolbar}
    />
  );
}
