"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { createTextColumn, createLifecycleColumn } from "@/components/table-column-factory";
import { Lead, Lifecycle, LeadSource } from "../types";
import { DataTableShell } from "./data-table-shell";
import { StatusBadge } from "./common/status-badge";
import { useEntityTable } from "../hooks";
import { LeadRowActions } from "./lead-row-actions";

interface LeadTableProps {
  leads: Lead[];
  lifecycles?: Lifecycle[];
  leadSources?: LeadSource[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

function buildColumns(
  lifecycles: Lifecycle[] | undefined,
  leadSources: LeadSource[] | undefined,
): ColumnDef<Lead>[] {
  const lifecycleById = lifecycles
    ? new Map(lifecycles.map((lifecycle) => [lifecycle.id, lifecycle]))
    : null;
  const sourceById = leadSources
    ? new Map(leadSources.map((source) => [source.id, source]))
    : null;

  return [
    createTextColumn<Lead>("name", "Ad Soyad", {
      cellClassName: "font-medium",
    }),
    createTextColumn<Lead>("email", "E-posta"),
    createTextColumn<Lead>("phone", "Telefon", { placeholder: "-" }),
    {
      accessorKey: "sourceId",
      header: "Kaynak",
      cell: ({ row }) => {
        const sourceId = row.original.sourceId;
        if (!sourceId) {
          return <span className="text-muted-foreground">-</span>;
        }
        const source = sourceById?.get(sourceId);
        return source ? source.name : sourceId;
      },
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} type="lead" />
      ),
    },
    createLifecycleColumn<Lead>(lifecycleById),
    {
      id: "actions",
      cell: ({ row }) => <LeadRowActions lead={row.original} />,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export function LeadTable({ leads, lifecycles, leadSources, toolbar }: LeadTableProps) {
  const router = useRouter();
  const columns = React.useMemo(
    () => buildColumns(lifecycles, leadSources),
    [lifecycles, leadSources]
  );
  const { table } = useEntityTable({
    data: leads,
    columns,
    getRowId: (row) => row.id,
    enableRowSelection: false,
    meta: {
      onRowClick: (lead: Lead) => {
        router.push(`/crm/leads/${lead.id}`);
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
