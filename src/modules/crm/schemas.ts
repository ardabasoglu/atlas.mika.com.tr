import { z } from "zod";

/** Non-empty string; use z.string().email() in form/API schemas if stricter validation is needed. */
const emailLike = z.string().min(1);

const leadStatusEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "lost",
  "converted",
]);

export const leadSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  email: emailLike,
  source: z.string().optional(),
  status: leadStatusEnum,
  lifecycleId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const personSchema = z.object({
  id: z.string(),
  leadId: z.string().optional(),
  name: z.string(),
  phone: z.string().optional(),
  email: emailLike,
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paymentPlanSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  downPaymentAmount: z.number(),
  installmentCount: z.number(),
  installmentAmount: z.number(),
  balloonAmount: z.number(),
  balloonDueMonth: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const dealStageEnum = z.enum([
  "inquiry",
  "meeting",
  "offer",
  "negotiation",
  "won",
  "lost",
]);

export const dealSchema = z.object({
  id: z.string(),
  personId: z.string(),
  unitId: z.string().optional(),
  title: z.string(),
  value: z.number(),
  currency: z.string().optional(),
  stage: dealStageEnum,
  lifecycleId: z.string().optional(),
  expectedCloseDate: z.string().optional(),
  paymentPlan: paymentPlanSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const timelineEventEntityTypeEnum = z.enum(["lead", "person", "deal"]);
const timelineEventTypeEnum = z.enum([
  "note",
  "call",
  "meeting",
  "email",
  "status_change",
  "deal_created",
  "deal_stage_changed",
]);

export const timelineEventSchema = z.object({
  id: z.string(),
  entityType: timelineEventEntityTypeEnum,
  entityId: z.string(),
  type: timelineEventTypeEnum,
  title: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdBy: z.string().optional(),
  createdAt: z.string(),
});

export const lifecycleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  order: z.number(),
  color: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: emailLike,
  role: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const leadArraySchema = z.array(leadSchema);
export const personArraySchema = z.array(personSchema);
export const dealArraySchema = z.array(dealSchema);
export const paymentPlanArraySchema = z.array(paymentPlanSchema);
export const timelineEventArraySchema = z.array(timelineEventSchema);
export const lifecycleArraySchema = z.array(lifecycleSchema);
export const teamArraySchema = z.array(teamSchema);

export type Lead = z.infer<typeof leadSchema>;
export type Person = z.infer<typeof personSchema>;
export type PaymentPlan = z.infer<typeof paymentPlanSchema>;
export type Deal = z.infer<typeof dealSchema>;
export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type Lifecycle = z.infer<typeof lifecycleSchema>;
export type Team = z.infer<typeof teamSchema>;
