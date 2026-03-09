import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Context for optimistic update operations.
 * Stores previous state for rollback on error.
 */
export interface OptimisticContext<T> {
  previousItem?: T;
  previousList?: T[];
  [key: string]: unknown;
}

/**
 * Configuration for creating an optimistic mutation.
 */
export interface OptimisticMutationConfig<TItem, TVariables> {
  /** Mutation function */
  mutationFn: (variables: TVariables) => Promise<unknown>;
  /** Get the item query key from variables */
  getItemQueryKey: (variables: TVariables) => readonly unknown[];
  /** Get the list query key from variables */
  getListQueryKey: (variables: TVariables) => readonly unknown[];
  /** Transform payload to partial item for optimistic update */
  getOptimisticUpdate: (previousItem: TItem, variables: TVariables) => Partial<TItem>;
  /** Called when mutation succeeds */
  onSuccess?: (data: unknown, variables: TVariables, context: OptimisticContext<TItem>) => void;
  /** Called when mutation settles (success or error) */
  onSettled?: (variables: TVariables) => void;
}

/**
 * Creates a mutation with optimistic updates and automatic rollback on error.
 * 
 * @example
 * ```ts
 * export function useUpdateDeal() {
 *   return createOptimisticMutation<Deal, UpdateDealPayload>({
 *     mutationFn: ({ dealId, payload }) => updateDeal(dealId, payload),
 *     getItemQueryKey: ({ dealId }) => queryKeys.crm.deal(dealId),
 *     getListQueryKey: () => queryKeys.crm.deals(),
 *     getOptimisticUpdate: (previousDeal, { dealId, payload }) => ({
 *       ...previousDeal,
 *       ...payload,
 *     }),
 *   });
 * }
 * ```
 */
export function createOptimisticMutation<TItem extends { id: string }, TVariables>({
  mutationFn,
  getItemQueryKey,
  getListQueryKey,
  getOptimisticUpdate,
  onSuccess,
  onSettled,
}: OptimisticMutationConfig<TItem, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      const itemQueryKey = getItemQueryKey?.(variables);
      const listQueryKey = getListQueryKey?.(variables);

      // Cancel outgoing queries
      if (itemQueryKey) {
        await queryClient.cancelQueries({ queryKey: itemQueryKey });
      }
      if (listQueryKey) {
        await queryClient.cancelQueries({ queryKey: listQueryKey });
      }

      // Get previous state
      const previousItem = itemQueryKey
        ? queryClient.getQueryData<TItem>(itemQueryKey)
        : undefined;
      const previousList = listQueryKey
        ? queryClient.getQueryData<TItem[]>(listQueryKey)
        : undefined;

      // Optimistically update
      if (previousItem && itemQueryKey) {
        const update = getOptimisticUpdate(previousItem, variables);
        queryClient.setQueryData<TItem>(itemQueryKey, {
          ...previousItem,
          ...update,
        });
      }

      if (previousList && listQueryKey) {
        const update = getOptimisticUpdate(previousItem!, variables);
        const updated = previousList.map((item) =>
          item.id === previousItem?.id
            ? { ...item, ...update }
            : item
        );
        queryClient.setQueryData<TItem[]>(listQueryKey, updated);
      }

      return { previousItem, previousList };
    },
    onError: (_error, variables, context) => {
      // Rollback on error
      const itemQueryKey = getItemQueryKey?.(variables);
      const listQueryKey = getListQueryKey?.(variables);

      if (context?.previousItem && itemQueryKey) {
        queryClient.setQueryData<TItem>(itemQueryKey, context.previousItem);
      }
      if (context?.previousList && listQueryKey) {
        queryClient.setQueryData<TItem[]>(listQueryKey, context.previousList);
      }
    },
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context);
    },
    onSettled: (data, error, variables) => {
      // Invalidate queries to refetch fresh data
      const itemQueryKey = getItemQueryKey?.(variables);
      const listQueryKey = getListQueryKey?.(variables);

      if (itemQueryKey) {
        queryClient.invalidateQueries({ queryKey: itemQueryKey });
      }
      if (listQueryKey) {
        queryClient.invalidateQueries({ queryKey: listQueryKey });
      }

      onSettled?.(variables);
    },
  });
}

/**
 * Simplified mutation hook for basic invalidate-only patterns.
 */
export interface InvalidateMutationConfig<TVariables> {
  mutationFn: (variables: TVariables) => Promise<unknown>;
  getInvalidateQueryKeys: (variables: TVariables) => (unknown[])[];
  onSuccess?: (data: unknown, variables: TVariables) => void;
}

export function createInvalidateMutation<TVariables>({
  mutationFn,
  getInvalidateQueryKeys,
  onSuccess,
}: InvalidateMutationConfig<TVariables>) {
  return useMutation({
    mutationFn,
    onSettled: (_data, _error, variables) => {
      const queryKeys = getInvalidateQueryKeys(variables);
      const queryClient = useQueryClient();
      
      queryKeys.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      onSuccess?.(_data, variables);
    },
  });
}
