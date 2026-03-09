"use client";

import type { ReactNode } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/table-select-column";
import { TimelineEvent } from "../types";
import { EVENT_TYPE_LABELS } from "../constants";
import { DataTableShell } from "./data-table-shell";
import { EntityActionMenu } from "./common/entity-action-menu";
import { useEntityTable } from "../hooks";
import Link from "next/link";

function getEntityHref(event: TimelineEvent): { href: string; label: string } | null {
  switch (event.entityType) {
    case "lead":
      return { href: `/crm/leads/${event.entityId}`, label: "Aday" };
    case "person":
      return { href: `/crm/persons/${event.entityId}`, label: "Kişi" };
    case "deal":
      return { href: `/crm/deals/${event.entityId}`, label: "Fırsat" };
    default:
      return null;
  }
}

interface ActivityTableProps {
  timelineEvents: TimelineEvent[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

const columns: ColumnDef<TimelineEvent>[] = [
  createSelectColumn<TimelineEvent>(),
  {
    accessorKey: "type",
    header: "Tür",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {EVENT_TYPE_LABELS[row.original.type]}
      </span>
    ),
  },
  {
    id: "titleDescription",
    header: "Açıklama",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.title ?? row.original.description ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Tarih",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "related",
    header: "İlişkili",
    cell: ({ row }) => {
      const related = getEntityHref(row.original);
      if (related) {
        return (
          <Link
            href={related.href}
            className="text-primary hover:underline"
          >
            {related.label} {row.original.entityId}
          </Link>
        );
      }
      return "-";
    },
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

export function ActivityTable({ timelineEvents, toolbar }: ActivityTableProps) {
  const { table } = useEntityTable({
    data: timelineEvents,
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
