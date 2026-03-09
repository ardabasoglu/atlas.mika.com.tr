"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  type Row,
} from "@tanstack/react-table";
import type { Deal, PaymentPlan } from "./types";
import { getPaymentPlanTotal } from "./types";
import { queryKeys } from "@/lib/query/keys";
import {
  updateDeal,
  savePaymentPlan,
  convertLead,
  getDeals,
  getDealById,
  getDealWithUnit,
  getDealWithPaymentPlan,
  getPersonById,
  getPaymentPlanByDealId,
  getLifecycles
} from "./services";
import { createOptimisticMutation, type OptimisticContext } from "@/lib/mutation-factory";

// --- Table Hooks ---

const DEFAULT_PAGE_SIZE = 10;

export interface UseEntityTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  defaultPageSize?: number;
  enableRowSelection?: boolean;
  getRowId?: (row: TData, index: number, parent?: Row<TData>) => string;
  meta?: Record<string, unknown>;
}

export interface UseEntityTableReturn<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  currentPage: number;
  pageSize: number;
}

export function useEntityTable<TData>({
  data,
  columns,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  enableRowSelection = true,
  getRowId,
  meta,
}: UseEntityTableOptions<TData>): UseEntityTableReturn<TData> {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    ...(meta !== undefined && { meta }),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return {
    table,
    pagination,
    setPagination,
    currentPage: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  };
}

export { DEFAULT_PAGE_SIZE as TABLE_PAGE_SIZE };

// --- Query Hooks ---

export function useDeals() {
  return useQuery({
    queryKey: queryKeys.crm.deals(),
    queryFn: () => getDeals(),
  });
}

export function useDeal(dealId: string) {
  return useQuery({
    queryKey: queryKeys.crm.deal(dealId),
    queryFn: () => getDealById(dealId),
    enabled: !!dealId,
  });
}

export function useDealWithUnit(dealId: string) {
  return useQuery({
    queryKey: queryKeys.crm.dealWithUnit(dealId),
    queryFn: () => getDealWithUnit(dealId),
    enabled: !!dealId,
  });
}

export function useDealWithPaymentPlan(dealId: string) {
  return useQuery({
    queryKey: queryKeys.crm.dealWithPaymentPlan(dealId),
    queryFn: () => getDealWithPaymentPlan(dealId),
    enabled: !!dealId,
  });
}

export function usePerson(personId: string) {
  return useQuery({
    queryKey: queryKeys.crm.person(personId),
    queryFn: () => getPersonById(personId),
    enabled: !!personId,
  });
}

export function useLifecycles() {
  return useQuery({
    queryKey: queryKeys.crm.lifecycles(),
    queryFn: () => getLifecycles(),
  });
}

// --- Mutation Hooks ---

export type UpdateDealPayload = {
  title?: string;
  value?: number;
  stage?: Deal["stage"];
  lifecycleId?: string | null;
  personId?: string;
  unitId?: string | null;
  expectedCloseDate?: string | null;
};

export function useUpdateDeal() {
  return createOptimisticMutation<Deal, { dealId: string; payload: UpdateDealPayload }>({
    mutationFn: ({ dealId, payload }) => updateDeal(dealId, payload),
    getItemQueryKey: ({ dealId }) => queryKeys.crm.deal(dealId),
    getListQueryKey: () => queryKeys.crm.deals(),
    getOptimisticUpdate: (previousDeal, { payload }) => ({
      ...previousDeal,
      ...payload,
      unitId: payload.unitId ?? undefined,
      lifecycleId: payload.lifecycleId ?? undefined,
      expectedCloseDate: payload.expectedCloseDate ?? undefined,
    }),
  });
}

export type SavePaymentPlanData = Omit<
  PaymentPlan,
  "id" | "dealId" | "createdAt" | "updatedAt"
>;

export function useSavePaymentPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dealId,
      data,
    }: {
      dealId: string;
      data: SavePaymentPlanData;
    }) => savePaymentPlan(dealId, data),
    onMutate: async ({ dealId, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.crm.paymentPlan(dealId),
      });
      await queryClient.cancelQueries({ queryKey: queryKeys.crm.deal(dealId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.crm.deals() });

      const previousDeal = queryClient.getQueryData<Deal>(
        queryKeys.crm.deal(dealId)
      );
      const previousPaymentPlan = queryClient.getQueryData<PaymentPlan>(
        queryKeys.crm.paymentPlan(dealId)
      );
      const previousDeals = queryClient.getQueryData<Deal[]>(
        queryKeys.crm.deals()
      );

      const now = new Date().toISOString().slice(0, 10);
      const optimisticPlan: PaymentPlan = {
        id: `optimistic-${dealId}`,
        dealId,
        downPaymentAmount: data.downPaymentAmount,
        installmentCount: data.installmentCount,
        installmentAmount: data.installmentAmount,
        balloonAmount: data.balloonAmount,
        balloonDueMonth: data.balloonDueMonth,
        createdAt: now,
        updatedAt: now,
      };
      const newValue = getPaymentPlanTotal(optimisticPlan);

      queryClient.setQueryData<PaymentPlan>(
        queryKeys.crm.paymentPlan(dealId),
        optimisticPlan
      );
      if (previousDeal) {
        queryClient.setQueryData<Deal>(queryKeys.crm.deal(dealId), {
          ...previousDeal,
          value: newValue,
          updatedAt: now,
        });
      }
      if (previousDeals) {
        const updated = previousDeals.map((dealItem: Deal): Deal =>
          dealItem.id === dealId
            ? { ...dealItem, value: newValue, updatedAt: now }
            : dealItem
        );
        queryClient.setQueryData<Deal[]>(queryKeys.crm.deals(), updated);
      }

      return {
        previousDeal,
        previousPaymentPlan,
        previousDeals,
      };
    },
    onError: (_error, { dealId }, context) => {
      if (context?.previousPaymentPlan !== undefined) {
        queryClient.setQueryData(
          queryKeys.crm.paymentPlan(dealId),
          context.previousPaymentPlan
        );
      }
      if (context?.previousDeal) {
        queryClient.setQueryData(
          queryKeys.crm.deal(dealId),
          context.previousDeal
        );
      }
      if (context?.previousDeals) {
        queryClient.setQueryData(queryKeys.crm.deals(), context.previousDeals);
      }
    },
    onSettled: (_data, _error, { dealId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.crm.paymentPlan(dealId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.crm.deal(dealId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.crm.deals() });
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      createDeal,
    }: {
      leadId: string;
      createDeal?: boolean;
    }) => convertLead(leadId, { createDeal }),
    onSettled: (data) => {
      if (data?.personId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.crm.person(data.personId),
        });
      }
    },
  });
}
