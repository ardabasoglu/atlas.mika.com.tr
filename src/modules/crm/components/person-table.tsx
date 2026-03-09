"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/table-select-column";
import { Person } from "../types";
import { DataTableShell } from "./data-table-shell";
import { EntityActionMenu } from "./common/entity-action-menu";
import { useEntityTable } from "../hooks";

interface PersonTableProps {
  persons: Person[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

const columns: ColumnDef<Person>[] = [
  createSelectColumn<Person>(),
  {
    accessorKey: "name",
    header: "Ad",
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
        basePath="/crm/persons"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export function PersonTable({ persons, toolbar }: PersonTableProps) {
  const { table } = useEntityTable({
    data: persons,
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
