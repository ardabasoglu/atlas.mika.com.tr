"use server";

import { prisma } from "@/lib/prisma";
import { Project, Unit } from "./types";
import { 
  Project as PrismaProject, 
  Unit as PrismaUnit,
  ProjectStatus,
  UnitStatus,
  UnitType
} from "@/generated/prisma/client";

function mapPrismaProject(p: PrismaProject): Project {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    status: p.status as any, // Cast to match our Zod enum if needed
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function mapPrismaUnit(u: PrismaUnit): Unit {
  return {
    id: u.id,
    projectId: u.projectId,
    code: u.code,
    type: u.type as any,
    sizeSqm: u.sizeSqm,
    price: u.price ? Number(u.price) : undefined,
    currency: u.currency ?? undefined,
    status: u.status as any,
    floor: u.floor ?? undefined,
    personId: u.personId ?? undefined,
    dealId: undefined, // Handled via relation in some contexts if needed
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

export async function getProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return projects.map(mapPrismaProject);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const project = await prisma.project.findUnique({
    where: { id },
  });
  return project ? mapPrismaProject(project) : undefined;
}

export async function getUnits(): Promise<Unit[]> {
  const units = await prisma.unit.findMany({
    orderBy: { code: "asc" },
  });
  return units.map(mapPrismaUnit);
}

export async function getUnitsByProjectId(projectId: string): Promise<Unit[]> {
  const units = await prisma.unit.findMany({
    where: { projectId },
    orderBy: { code: "asc" },
  });
  return units.map(mapPrismaUnit);
}

export async function getUnitById(id: string): Promise<Unit | undefined> {
  const unit = await prisma.unit.findUnique({
    where: { id },
  });
  return unit ? mapPrismaUnit(unit) : undefined;
}

export async function updateUnit(
  unitId: string,
  payload: {
    status?: Unit["status"];
    dealId?: string | null;
    personId?: string | null;
  }
): Promise<Unit | undefined> {
  const unit = await prisma.unit.update({
    where: { id: unitId },
    data: {
      ...(payload.status && { status: payload.status as UnitStatus }),
      ...(payload.personId !== undefined && { personId: payload.personId }),
    },
  });
  return mapPrismaUnit(unit);
}

// Individual exports are used as Server Actions
