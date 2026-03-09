"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/table-select-column";
import { Unit } from "../types";
import { unitTypeLabels, unitStatusLabels } from "../unit-labels";
import { formatMoney } from "@/lib/currency";
import { DataTableShell } from "@/modules/crm/components/data-table-shell";
import { EntityActionMenu } from "@/modules/crm/components/common/entity-action-menu";
import { useEntityTable } from "@/modules/crm/hooks";

interface UnitTableProps {
  units: Unit[];
  toolbar?: ReactNode;
}

const columns: ColumnDef<Unit>[] = [
  createSelectColumn<Unit>(),
  {
    accessorKey: "code",
    header: "Kod",
    cell: ({ row }) => (
      <Link
        href={`/project/units/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.code}
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: "Tip",
    cell: ({ row }) => unitTypeLabels[row.original.type] ?? row.original.type,
  },
  {
    accessorKey: "sizeSqm",
    header: "m²",
    cell: ({ row }) => `${row.original.sizeSqm} m²`,
  },
  {
    accessorKey: "price",
    header: "Fiyat",
    cell: ({ row }) =>
      row.original.price != null
        ? formatMoney(row.original.price, row.original.currency)
        : "-",
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) =>
      unitStatusLabels[row.original.status] ?? row.original.status,
  },
  {
    accessorKey: "floor",
    header: "Kat",
    cell: ({ row }) => row.original.floor ?? "-",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EntityActionMenu
        entityId={row.original.id}
        basePath="/project/units"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export function UnitTable({ units, toolbar }: UnitTableProps) {
  const { table } = useEntityTable({
    data: units,
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
