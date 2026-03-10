"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/table-select-column";
import { LeadSource } from "../types";
import { DataTableShell } from "./data-table-shell";
import { EntityActionMenu } from "./common/entity-action-menu";
import { useEntityTable } from "../hooks";

interface LeadSourceTableProps {
  leadSources: LeadSource[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

const columns: ColumnDef<LeadSource>[] = [
  createSelectColumn<LeadSource>(),
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
        basePath="/crm/lead-sources"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export function LeadSourceTable({
  leadSources,
  toolbar,
}: LeadSourceTableProps) {
  const { table } = useEntityTable({
    data: leadSources,
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
