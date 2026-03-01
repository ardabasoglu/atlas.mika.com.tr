"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { Activity } from "../types";
import { DataTableShell } from "./data-table-shell";
import { StatusBadge } from "./common/status-badge";
import { EntityActionMenu } from "./common/entity-action-menu";
import { useEntityTable } from "../hooks";

interface ActivityTableProps {
  activities: Activity[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

const columns: ColumnDef<Activity>[] = [
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
    accessorKey: "type",
    header: "Tür",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
      </span>
    ),
  },
  {
    accessorKey: "subject",
    header: "Konu",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.subject}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Tarih",
    cell: ({ row }) =>
      new Date(row.original.date).toLocaleDateString(),
  },
  {
    accessorKey: "duration",
    header: "Süre",
    cell: ({ row }) =>
      row.original.duration ? `${row.original.duration} dk` : "-",
  },
  {
    accessorKey: "assignedTo",
    header: "Atanan",
  },
  {
    accessorKey: "completed",
    header: "Durum",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.completed ? "completed" : "pending"}
        type="activity"
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EntityActionMenu
        entityId={row.original.id}
        basePath="/crm/activities"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export function ActivityTable({ activities, toolbar }: ActivityTableProps) {
  const { table } = useEntityTable({
    data: activities,
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
