"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { Unit } from "../types";
import { formatMoney } from "@/lib/currency";
import { DataTableShell } from "@/modules/crm/components/data-table-shell";
import { EntityActionMenu } from "@/modules/crm/components/common/entity-action-menu";
import { useEntityTable } from "@/modules/crm/hooks";

const unitTypeLabels: Record<Unit["type"], string> = {
  apartment: "Daire",
  commercial: "Ticari",
  parking: "Otopark",
  other: "Diğer",
};

const unitStatusLabels: Record<Unit["status"], string> = {
  available: "Müsait",
  reserved: "Rezerve",
  sold: "Satıldı",
};

interface UnitTableProps {
  units: Unit[];
  toolbar?: ReactNode;
}

const columns: ColumnDef<Unit>[] = [
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
