"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Unit } from "../types";
import { queryKeys } from "@/lib/query/keys";
import { projectServices } from "../services";

export type UpdateUnitPayload = {
  status?: Unit["status"];
  dealId?: string | null;
  personId?: string | null;
};

export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      unitId,
      payload,
    }: {
      unitId: string;
      payload: UpdateUnitPayload;
    }) => projectServices.updateUnit(unitId, payload),
    onMutate: async ({ unitId, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.project.unit(unitId) });

      const previousUnit = queryClient.getQueryData<Unit>(
        queryKeys.project.unit(unitId)
      );

      if (previousUnit) {
        const optimistic: Unit = {
          ...previousUnit,
          ...payload,
          dealId: payload.dealId ?? undefined,
          personId: payload.personId ?? undefined,
          updatedAt: new Date().toISOString().slice(0, 10),
        };
        queryClient.setQueryData<Unit>(
          queryKeys.project.unit(unitId),
          optimistic
        );
      }

      const previousUnitsList = queryClient.getQueryData<Unit[]>(
        queryKeys.project.units(previousUnit?.projectId ?? "")
      );
      if (previousUnit?.projectId && previousUnitsList) {
        const updated = previousUnitsList.map((unit): Unit =>
          unit.id === unitId
            ? {
                ...unit,
                ...payload,
                dealId: payload.dealId ?? undefined,
                personId: payload.personId ?? undefined,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : unit
        );
        queryClient.setQueryData<Unit[]>(
          queryKeys.project.units(previousUnit.projectId),
          updated
        );
      }

      return { previousUnit, previousUnitsList };
    },
    onError: (_error, { unitId }, context) => {
      if (context?.previousUnit) {
        queryClient.setQueryData(
          queryKeys.project.unit(unitId),
          context.previousUnit
        );
      }
      if (
        context?.previousUnit?.projectId &&
        context?.previousUnitsList
      ) {
        queryClient.setQueryData(
          queryKeys.project.units(context.previousUnit.projectId),
          context.previousUnitsList
        );
      }
    },
    onSettled: (_data, _error, { unitId }, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project.unit(unitId) });
      if (context?.previousUnit?.projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.project.units(context.previousUnit.projectId),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.project.all });
    },
  });
}
