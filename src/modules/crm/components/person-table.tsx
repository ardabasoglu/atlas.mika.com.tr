"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { createTextColumn, createDateColumn } from "@/components/table-column-factory";
import { Person } from "../types";
import { DataTableShell } from "./data-table-shell";
import { useEntityTable } from "../hooks";
import { PersonRowActions } from "./person-row-actions";

interface PersonTableProps {
  persons: Person[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

const columns: ColumnDef<Person>[] = [
  createTextColumn<Person>("name", "Ad", { cellClassName: "font-medium" }),
  createTextColumn<Person>("email", "E-posta"),
  createTextColumn<Person>("phone", "Telefon", { placeholder: "-" }),
  createDateColumn<Person>("createdAt", "Oluşturulma", { locale: "tr-TR" }),
  {
    id: "actions",
    cell: ({ row }) => <PersonRowActions person={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];

export function PersonTable({ persons, toolbar }: PersonTableProps) {
  const router = useRouter();
  const { table } = useEntityTable({
    data: persons,
    columns,
    getRowId: (row) => row.id,
    enableRowSelection: false,
    meta: {
      onRowClick: (person: Person) => {
        router.push(`/crm/persons/${person.id}`);
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
