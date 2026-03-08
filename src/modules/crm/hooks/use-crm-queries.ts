"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { crmServices } from "../services";

export function useDeals() {
  return useQuery({
    queryKey: queryKeys.crm.deals(),
    queryFn: () => crmServices.getDeals(),
  });
}

export function useDeal(dealId: string) {
  return useQuery({
    queryKey: queryKeys.crm.deal(dealId),
    queryFn: () => crmServices.getDealById(dealId),
    enabled: !!dealId,
  });
}

export function useDealWithUnit(dealId: string) {
  return useQuery({
    queryKey: queryKeys.crm.dealWithUnit(dealId),
    queryFn: () => crmServices.getDealWithUnit(dealId),
    enabled: !!dealId,
  });
}

export function useDealWithPaymentPlan(dealId: string) {
  return useQuery({
    queryKey: queryKeys.crm.dealWithPaymentPlan(dealId),
    queryFn: () => crmServices.getDealWithPaymentPlan(dealId),
    enabled: !!dealId,
  });
}

export function usePerson(personId: string) {
  return useQuery({
    queryKey: queryKeys.crm.person(personId),
    queryFn: () => crmServices.getPersonById(personId),
    enabled: !!personId,
  });
}

export function usePersonDeals(personId: string) {
  return useQuery({
    queryKey: queryKeys.crm.personDeals(personId),
    queryFn: () => crmServices.getDealsByPersonId(personId),
    enabled: !!personId,
  });
}

export function usePaymentPlan(dealId: string) {
  return useQuery({
    queryKey: queryKeys.crm.paymentPlan(dealId),
    queryFn: () => crmServices.getPaymentPlanByDealId(dealId),
    enabled: !!dealId,
  });
}

export function useLifecycles() {
  return useQuery({
    queryKey: queryKeys.crm.lifecycles(),
    queryFn: () => crmServices.getLifecycles(),
  });
}
