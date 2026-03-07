"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { Project } from "../types";
import { DataTableShell } from "@/modules/crm/components/data-table-shell";
import { EntityActionMenu } from "@/modules/crm/components/common/entity-action-menu";
import { useEntityTable } from "@/modules/crm/hooks";

const projectStatusLabels: Record<Project["status"], string> = {
  planning: "Planlama",
  construction: "İnşaat",
  completed: "Tamamlandı",
  on_hold: "Beklemede",
};

interface ProjectTableProps {
  projects: Project[];
  toolbar?: ReactNode;
}

const columns: ColumnDef<Project>[] = [
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
    header: "Proje Adı",
    cell: ({ row }) => (
      <Link
        href={`/project/projects/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) =>
      projectStatusLabels[row.original.status] ?? row.original.status,
  },
  {
    accessorKey: "address",
    header: "Adres",
    cell: ({ row }) => row.original.address ?? "-",
  },
  {
    accessorKey: "startDate",
    header: "Başlangıç",
    cell: ({ row }) =>
      row.original.startDate
        ? new Date(row.original.startDate).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "createdAt",
    header: "Oluşturulma",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EntityActionMenu
        entityId={row.original.id}
        basePath="/project/projects"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export function ProjectTable({ projects, toolbar }: ProjectTableProps) {
  const { table } = useEntityTable({
    data: projects,
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
