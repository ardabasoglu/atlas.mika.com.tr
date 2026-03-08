"use server";

import { prisma } from "@/lib/prisma";
import { formatZodError } from "@/lib/utils";
import { idParamSchema, updateUnitPayloadSchema } from "./schemas";
import { Project, Unit } from "./types";
import {
  Project as PrismaProject,
  Unit as PrismaUnit,
  UnitStatus,
} from "@/generated/prisma/client";

function mapPrismaProject(p: PrismaProject): Project {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    address: p.address ?? undefined,
    status: p.status as Project["status"],
    startDate: p.startDate ? p.startDate.toISOString() : undefined,
    endDate: p.endDate ? p.endDate.toISOString() : undefined,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function mapPrismaUnit(u: PrismaUnit): Unit {
  return {
    id: u.id,
    projectId: u.projectId,
    code: u.code,
    type: u.type as Unit["type"],
    sizeSqm: u.sizeSqm,
    price: u.price ? Number(u.price) : undefined,
    currency: u.currency ?? undefined,
    status: u.status as Unit["status"],
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
  const unitIdResult = idParamSchema.safeParse(unitId);
  if (!unitIdResult.success) {
    throw new Error(formatZodError(unitIdResult.error));
  }
  const payloadResult = updateUnitPayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }
  const validatedPayload = payloadResult.data;

  const unit = await prisma.unit.update({
    where: { id: unitIdResult.data },
    data: {
      ...(validatedPayload.status && { status: validatedPayload.status as UnitStatus }),
      ...(validatedPayload.personId !== undefined && { personId: validatedPayload.personId }),
    },
  });
  return mapPrismaUnit(unit);
}

// Individual exports are used as Server Actions
