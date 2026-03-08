"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { getProjects, getProjectById, getUnitsByProjectId, getUnits, getUnitById } from "../services";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.project.projects(),
    queryFn: () => getProjects(),
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: queryKeys.project.project(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });
}

export function useUnits(projectId: string) {
  return useQuery({
    queryKey: queryKeys.project.units(projectId),
    queryFn: () => getUnitsByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useAllUnits() {
  return useQuery({
    queryKey: queryKeys.project.unitsAll(),
    queryFn: () => getUnits(),
  });
}

export function useUnit(unitId: string) {
  return useQuery({
    queryKey: queryKeys.project.unit(unitId),
    queryFn: () => getUnitById(unitId),
    enabled: !!unitId,
  });
}
