import { z } from "zod";

const projectStatusEnum = z.enum([
  "planning",
  "construction",
  "completed",
  "on_hold",
]);

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  status: projectStatusEnum,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const unitTypeEnum = z.enum(["apartment", "commercial", "parking", "other"]);
const unitStatusEnum = z.enum(["available", "reserved", "sold"]);

export const unitSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  code: z.string(),
  type: unitTypeEnum,
  sizeSqm: z.number(),
  price: z.number().optional(),
  currency: z.string().optional(),
  status: unitStatusEnum,
  floor: z.number().optional(),
  dealId: z.string().optional(),
  personId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const projectArraySchema = z.array(projectSchema);
export const unitArraySchema = z.array(unitSchema);

export type Project = z.infer<typeof projectSchema>;
export type Unit = z.infer<typeof unitSchema>;
