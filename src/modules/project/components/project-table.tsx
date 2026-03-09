"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/table-select-column";
import { createTextColumn, createDateColumn, createActionsColumn } from "@/components/table-column-factory";
import { Project } from "../types";
import { DataTableShell } from "@/modules/crm/components/data-table-shell";
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
  createSelectColumn<Project>(),
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
  createTextColumn<Project>("address", "Adres", { placeholder: "-" }),
  createDateColumn<Project>("startDate", "Başlangıç", { placeholder: "-" }),
  createDateColumn<Project>("createdAt", "Oluşturulma"),
  createActionsColumn<Project>("/project/projects"),
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
