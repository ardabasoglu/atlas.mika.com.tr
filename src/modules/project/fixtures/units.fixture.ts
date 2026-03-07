import { Unit } from "../types";

const UNIT_PREFIX = "unit-";

const baseUnits: Array<{
  projectId: string;
  code: string;
  type: Unit["type"];
  sizeSqm: number;
  price?: number;
  status: Unit["status"];
  floor?: number;
  dealId?: string;
  personId?: string;
}> = [
  { projectId: "project-1", code: "A-101", type: "apartment", sizeSqm: 95, price: 2850000, status: "available", floor: 1 },
  { projectId: "project-1", code: "A-102", type: "apartment", sizeSqm: 95, price: 2900000, status: "reserved", floor: 1, dealId: "deal-1", personId: "person-1" },
  { projectId: "project-1", code: "A-201", type: "apartment", sizeSqm: 110, price: 3200000, status: "sold", floor: 2, dealId: "deal-5", personId: "person-5" },
  { projectId: "project-1", code: "B-101", type: "parking", sizeSqm: 25, price: 350000, status: "available", floor: -1 },
  { projectId: "project-2", code: "OF-01", type: "commercial", sizeSqm: 180, price: 4500000, status: "sold", floor: 1 },
  { projectId: "project-2", code: "OF-02", type: "commercial", sizeSqm: 220, status: "available", floor: 2 },
  { projectId: "project-2", code: "OF-03", type: "commercial", sizeSqm: 150, price: 3800000, status: "reserved", floor: 3, dealId: "deal-2", personId: "person-2" },
  { projectId: "project-3", code: "K-101", type: "apartment", sizeSqm: 85, price: 2100000, status: "available", floor: 1 },
  { projectId: "project-3", code: "K-102", type: "apartment", sizeSqm: 85, price: 2150000, status: "available", floor: 1 },
  { projectId: "project-3", code: "K-201", type: "apartment", sizeSqm: 120, price: 3100000, status: "available", floor: 2 },
  { projectId: "project-4", code: "V-01", type: "apartment", sizeSqm: 280, price: 8500000, status: "available", floor: 0 },
  { projectId: "project-4", code: "V-02", type: "apartment", sizeSqm: 320, status: "available", floor: 0 },
];

function buildUnits(): Unit[] {
  return baseUnits.map((unit, index) => ({
    id: `${UNIT_PREFIX}${index + 1}`,
    projectId: unit.projectId,
    code: unit.code,
    type: unit.type,
    sizeSqm: unit.sizeSqm,
    price: unit.price,
    status: unit.status,
    floor: unit.floor,
    dealId: unit.dealId,
    personId: unit.personId,
    createdAt: "2025-01-15",
    updatedAt: "2026-02-10",
  }));
}

export const units: Unit[] = buildUnits();
