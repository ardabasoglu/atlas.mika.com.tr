"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Deal, PaymentPlan } from "../types";
import { getPaymentPlanTotal } from "../types";
import { queryKeys } from "@/lib/query/keys";
import { crmServices } from "../services";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dealId,
      payload,
    }: {
      dealId: string;
      payload: UpdateDealPayload;
    }) => crmServices.updateDeal(dealId, payload),
    onMutate: async ({ dealId, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.crm.deal(dealId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.crm.deals() });

      const previousDeal = queryClient.getQueryData<Deal>(
        queryKeys.crm.deal(dealId)
      );
      const previousDeals = queryClient.getQueryData<Deal[]>(
        queryKeys.crm.deals()
      );

      if (previousDeal) {
        const optimistic: Deal = {
          ...previousDeal,
          ...payload,
          unitId: payload.unitId ?? undefined,
          lifecycleId: payload.lifecycleId ?? undefined,
          expectedCloseDate: payload.expectedCloseDate ?? undefined,
        };
        queryClient.setQueryData<Deal>(queryKeys.crm.deal(dealId), optimistic);
      }

      if (previousDeals) {
        const updated = previousDeals.map((dealItem): Deal =>
          dealItem.id === dealId
            ? {
                ...dealItem,
                ...payload,
                unitId: payload.unitId ?? undefined,
                lifecycleId: payload.lifecycleId ?? undefined,
                expectedCloseDate: payload.expectedCloseDate ?? undefined,
              }
            : dealItem
        );
        queryClient.setQueryData<Deal[]>(queryKeys.crm.deals(), updated);
      }

      return { previousDeal, previousDeals };
    },
    onError: (_error, { dealId }, context) => {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.crm.deal(dealId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.crm.deals() });
    },
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
    }) => crmServices.savePaymentPlan(dealId, data),
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
        const updated = previousDeals.map((dealItem): Deal =>
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
    }) => crmServices.convertLead(leadId, { createDeal }),
    onSettled: (data) => {
      if (data?.personId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.crm.person(data.personId),
        });
      }
    },
  });
}
