"use client";

import * as React from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { Lead, Lifecycle } from "../types";
import { DataTableShell } from "./data-table-shell";
import { StatusBadge } from "./common/status-badge";
import { EntityActionMenu } from "./common/entity-action-menu";
import { useEntityTable } from "../hooks";

interface LeadTableProps {
  leads: Lead[];
  lifecycles?: Lifecycle[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

function buildColumns(lifecycles: Lifecycle[] | undefined): ColumnDef<Lead>[] {
  const lifecycleById = lifecycles
    ? new Map(lifecycles.map((lifecycle) => [lifecycle.id, lifecycle]))
    : null;

  return [
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
    accessorKey: "name",
    header: "Ad Soyad",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "E-posta",
  },
  {
    accessorKey: "phone",
    header: "Telefon",
    cell: ({ row }) => row.original.phone ?? "-",
  },
  {
    accessorKey: "source",
    header: "Kaynak",
    cell: ({ row }) => row.original.source ?? "-",
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status} type="lead" />
    ),
  },
  {
    id: "lifecycle",
    header: "Yaşam döngüsü",
    cell: ({ row }) => {
      const lifecycleId = row.original.lifecycleId;
      if (!lifecycleId) return "-";
      const lifecycle = lifecycleById?.get(lifecycleId);
      return lifecycle ? lifecycle.name : lifecycleId;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EntityActionMenu
        entityId={row.original.id}
        basePath="/crm/leads"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
}

export function LeadTable({ leads, lifecycles, toolbar }: LeadTableProps) {
  const columns = React.useMemo(
    () => buildColumns(lifecycles),
    [lifecycles]
  );
  const { table } = useEntityTable({
    data: leads,
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
