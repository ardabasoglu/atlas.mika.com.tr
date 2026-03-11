import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";

export function invalidateDealCascade(queryClient: QueryClient, dealId: string): void {
  queryClient.invalidateQueries({
    queryKey: queryKeys.crm.paymentPlan(dealId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.crm.deal(dealId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.crm.deals(),
  });
}

export function invalidatePersonCascade(
  queryClient: QueryClient,
  personId: string,
): void {
  queryClient.invalidateQueries({
    queryKey: queryKeys.crm.person(personId),
  });
}

