import type { ColumnDef } from "@tanstack/react-table";
import { EntityActionMenu } from "@/modules/crm/components/common/entity-action-menu";

/**
 * Creates a standard text column with optional font-medium styling on the cell.
 */
export function createTextColumn<T extends { id: string }>(
  accessorKey: keyof T,
  header: string,
  options?: {
    cellClassName?: string;
    placeholder?: string;
  }
): ColumnDef<T> {
  const { cellClassName = "", placeholder = "-" } = options ?? {};

  return {
    accessorKey,
    header,
    cell: ({ row }) => {
      const value = row.original[accessorKey];
      const displayValue =
        value === null || value === undefined ? placeholder : String(value);

      if (cellClassName) {
        return <span className={cellClassName}>{displayValue}</span>;
      }

      return displayValue;
    },
  };
}

/**
 * Creates a date column that formats dates using toLocaleDateString.
 * Use locale "tr-TR" for DD.MM.YYYY format (e.g. 11.03.2026).
 */
export function createDateColumn<T extends { id: string }>(
  accessorKey: keyof T,
  header: string,
  options?: {
    placeholder?: string;
    /** Locale for formatting (e.g. "tr-TR" for DD.MM.YYYY). */
    locale?: string;
  }
): ColumnDef<T> {
  const { placeholder = "-", locale } = options ?? {};

  return {
    accessorKey,
    header,
    cell: ({ row }) => {
      const value = row.original[accessorKey];
      if (!value) return placeholder;

      const dateValue = value as Date | string | null;
      if (dateValue instanceof Date || typeof dateValue === "string") {
        return new Date(dateValue).toLocaleDateString(locale ?? undefined);
      }

      return placeholder;
    },
  };
}

/**
 * Creates an actions column with EntityActionMenu.
 */
export function createActionsColumn<T extends { id: string }>(
  basePath: string
): ColumnDef<T> {
  return {
    id: "actions",
    cell: ({ row }) => (
      <EntityActionMenu entityId={row.original.id} basePath={basePath} />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

/**
 * Creates a lifecycle column that resolves lifecycle name from ID.
 */
export function createLifecycleColumn<T extends { id: string; lifecycleId?: string | null }>(
  lifecycleById: Map<string, { name: string }> | null
): ColumnDef<T> {
  return {
    id: "lifecycle",
    header: "Yaşam döngüsü",
    cell: ({ row }) => {
      const lifecycleId = row.original.lifecycleId;
      if (!lifecycleId) return "-";
      const lifecycle = lifecycleById?.get(lifecycleId);
      return lifecycle ? lifecycle.name : lifecycleId;
    },
  };
}
