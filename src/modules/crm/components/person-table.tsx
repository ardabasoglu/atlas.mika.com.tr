"use client";

import type { ReactNode } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/table-select-column";
import { createTextColumn, createDateColumn, createActionsColumn } from "@/components/table-column-factory";
import { Person } from "../types";
import { DataTableShell } from "./data-table-shell";
import { useEntityTable } from "../hooks";

interface PersonTableProps {
  persons: Person[];
  /** Rendered in the table toolbar row (e.g. "Add" button), to the left of Sütunları Özelleştir */
  toolbar?: ReactNode;
}

const columns: ColumnDef<Person>[] = [
  createSelectColumn<Person>(),
  createTextColumn<Person>("name", "Ad", { cellClassName: "font-medium" }),
  createTextColumn<Person>("email", "E-posta"),
  createTextColumn<Person>("phone", "Telefon", { placeholder: "-" }),
  createDateColumn<Person>("createdAt", "Oluşturulma", { locale: "tr-TR" }),
  createActionsColumn<Person>("/crm/persons"),
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
