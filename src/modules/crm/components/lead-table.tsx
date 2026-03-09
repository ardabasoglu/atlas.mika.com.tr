"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/table-select-column";
import { createTextColumn, createLifecycleColumn, createActionsColumn } from "@/components/table-column-factory";
import { Lead, Lifecycle } from "../types";
import { DataTableShell } from "./data-table-shell";
import { StatusBadge } from "./common/status-badge";
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
  createSelectColumn<Lead>(),
  createTextColumn<Lead>("name", "Ad Soyad", { cellClassName: "font-medium" }),
  createTextColumn<Lead>("email", "E-posta"),
  createTextColumn<Lead>("phone", "Telefon", { placeholder: "-" }),
  createTextColumn<Lead>("source", "Kaynak", { placeholder: "-" }),
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status} type="lead" />
    ),
  },
  createLifecycleColumn<Lead>(lifecycleById),
  createActionsColumn<Lead>("/crm/leads"),
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
