"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { 
  getDeals, 
  getDealById, 
  getDealWithUnit, 
  getDealWithPaymentPlan, 
  getPersonById, 
  getDealsByPersonId, 
  getPaymentPlanByDealId, 
  getLifecycles 
} from "../services";

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

export function usePersonDeals(personId: string) {
  return useQuery({
    queryKey: queryKeys.crm.personDeals(personId),
    queryFn: () => getDealsByPersonId(personId),
    enabled: !!personId,
  });
}

export function usePaymentPlan(dealId: string) {
  return useQuery({
    queryKey: queryKeys.crm.paymentPlan(dealId),
    queryFn: () => getPaymentPlanByDealId(dealId),
    enabled: !!dealId,
  });
}

export function useLifecycles() {
  return useQuery({
    queryKey: queryKeys.crm.lifecycles(),
    queryFn: () => getLifecycles(),
  });
}
