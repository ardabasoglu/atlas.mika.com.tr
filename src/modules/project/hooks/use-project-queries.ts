"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { projectServices } from "../services";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.project.projects(),
    queryFn: () => projectServices.getProjects(),
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: queryKeys.project.project(projectId),
    queryFn: () => projectServices.getProjectById(projectId),
    enabled: !!projectId,
  });
}

export function useUnits(projectId: string) {
  return useQuery({
    queryKey: queryKeys.project.units(projectId),
    queryFn: () => projectServices.getUnitsByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useAllUnits() {
  return useQuery({
    queryKey: queryKeys.project.unitsAll(),
    queryFn: () => projectServices.getUnits(),
  });
}

export function useUnit(unitId: string) {
  return useQuery({
    queryKey: queryKeys.project.unit(unitId),
    queryFn: () => projectServices.getUnitById(unitId),
    enabled: !!unitId,
  });
}
