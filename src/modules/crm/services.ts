"use server";

import { prisma } from "@/lib/prisma";
import { formatZodError } from "@/lib/utils";
import {
  idParamSchema,
  savePaymentPlanInputSchema,
  updateDealPayloadSchema,
  updateLeadPayloadSchema,
  convertLeadOptionsSchema,
  createLeadPayloadSchema,
  createLeadSourcePayloadSchema,
  updateLeadSourcePayloadSchema,
  updateLeadDetailsPayloadSchema,
} from "./schemas";
import {
  Deal,
  TimelineEvent,
  Lead,
  Lifecycle,
  LeadSource,
  Team,
  Person,
  PaymentPlan,
  getPaymentPlanTotal,
} from "./types";
import { getUnitById, getProjectById, updateUnit } from "@/modules/project/services";
import {
  Person as PrismaPerson,
  Deal as PrismaDeal,
  Lead as PrismaLead,
  Lifecycle as PrismaLifecycle,
  LeadSource as PrismaLeadSource,
  PaymentPlan as PrismaPaymentPlan,
  TimelineEvent as PrismaTimelineEvent,
  DealStage,
  LeadStatus,
} from "@/generated/prisma/client";

// --- Mappers ---

function mapPrismaPerson(p: PrismaPerson): Person {
  return {
    id: p.id,
    leadId: p.leadId ?? undefined,
    name: p.name,
    email: p.email,
    phone: p.phone ?? undefined,
    notes: p.notes ?? undefined,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function mapPrismaPaymentPlan(p: PrismaPaymentPlan): PaymentPlan {
  return {
    id: p.id,
    dealId: p.dealId,
    downPaymentAmount: Number(p.downPaymentAmount),
    installmentCount: p.installmentCount,
    installmentAmount: Number(p.installmentAmount),
    balloonAmount: Number(p.balloonAmount),
    balloonDueMonth: p.balloonDueMonth,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function mapPrismaDeal(d: PrismaDeal & { paymentPlan?: PrismaPaymentPlan | null }): Deal {
  return {
    id: d.id,
    personId: d.personId,
    unitId: d.unitId ?? undefined,
    title: d.title,
    value: Number(d.value),
    currency: d.currency ?? undefined,
    stage: d.stage as Deal["stage"],
    lifecycleId: d.lifecycleId ?? undefined,
    expectedCloseDate: d.expectedCloseDate?.toISOString(),
    paymentPlan: d.paymentPlan ? mapPrismaPaymentPlan(d.paymentPlan) : undefined,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}

function mapPrismaLead(l: PrismaLead & { person?: { id: string } | null }): Lead {
  return {
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone ?? undefined,
    sourceId: l.sourceId ?? undefined,
    status: l.status as Lead["status"],
    lifecycleId: l.lifecycleId ?? undefined,
    notes: l.notes ?? undefined,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),

    archivedAt: l.archivedAt?.toISOString(),
    personId: l.person?.id ?? undefined,

    sourceType: l.sourceType ?? undefined,
    sourcePlatform: l.sourcePlatform ?? undefined,
    utmSource: l.utmSource ?? undefined,
    utmMedium: l.utmMedium ?? undefined,
    utmCampaign: l.utmCampaign ?? undefined,

    gclid: l.gclid ?? undefined,
    fbclid: l.fbclid ?? undefined,

    consentMarketing: l.consentMarketing ?? undefined,
    consentMarketingSource: l.consentMarketingSource ?? undefined,
  };
}

function mapPrismaLeadSource(s: PrismaLeadSource): LeadSource {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? undefined,
    order: s.order,
    color: s.color ?? undefined,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

function mapPrismaLifecycle(l: PrismaLifecycle): Lifecycle {
  return {
    id: l.id,
    name: l.name,
    description: l.description ?? undefined,
    order: l.order,
    color: l.color ?? undefined,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  };
}

function mapPrismaTimelineEvent(e: PrismaTimelineEvent): TimelineEvent {
  return {
    id: e.id,
    entityType: e.entityType as TimelineEvent["entityType"],
    entityId: e.entityId,
    type: e.type as TimelineEvent["type"],
    title: e.title ?? undefined,
    description: e.description ?? undefined,
    metadata: (e.metadata as Record<string, unknown> | null) ?? undefined,
    createdBy: e.createdBy ?? undefined,
    createdAt: e.createdAt.toISOString(),
  };
}

// --- Services ---

export async function getPersons(): Promise<Person[]> {
  const persons = await prisma.person.findMany({
    orderBy: { createdAt: "desc" },
  });
  return persons.map(mapPrismaPerson);
}

export async function getPersonById(id: string): Promise<Person | undefined> {
  const person = await prisma.person.findUnique({
    where: { id },
  });
  return person ? mapPrismaPerson(person) : undefined;
}

export async function getDeals(): Promise<Deal[]> {
  const deals = await prisma.deal.findMany({
    include: { paymentPlan: true },
    orderBy: { createdAt: "desc" },
  });
  return deals.map(mapPrismaDeal);
}

export async function getDealById(id: string): Promise<Deal | undefined> {
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: { paymentPlan: true },
  });
  return deal ? mapPrismaDeal(deal) : undefined;
}

export async function getDealsByPersonId(personId: string): Promise<Deal[]> {
  const deals = await prisma.deal.findMany({
    where: { personId },
    include: { paymentPlan: true },
    orderBy: { createdAt: "desc" },
  });
  return deals.map(mapPrismaDeal);
}

export async function getDealWithUnit(
  dealId: string
): Promise<
  | { deal: Deal; unit: { id: string; code: string; projectId: string }; project: { id: string; name: string } }
  | undefined
> {
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { paymentPlan: true },
  });
  if (!deal || !deal.unitId) return undefined;
  
  const unit = await getUnitById(deal.unitId);
  if (!unit) return undefined;
  
  const project = await getProjectById(unit.projectId);
  if (!project) return undefined;
  
  return {
    deal: mapPrismaDeal(deal),
    unit: { id: unit.id, code: unit.code, projectId: unit.projectId },
    project: { id: project.id, name: project.name },
  };
}

export async function getPaymentPlanByDealId(dealId: string): Promise<PaymentPlan | undefined> {
  const plan = await prisma.paymentPlan.findUnique({
    where: { dealId },
  });
  return plan ? mapPrismaPaymentPlan(plan) : undefined;
}

export async function getDealWithPaymentPlan(
  dealId: string
): Promise<(Deal & { paymentPlan?: PaymentPlan }) | undefined> {
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { paymentPlan: true },
  });
  return deal ? mapPrismaDeal(deal) : undefined;
}

export async function savePaymentPlan(
  dealId: string,
  data: Omit<PaymentPlan, "id" | "dealId" | "createdAt" | "updatedAt">
): Promise<PaymentPlan> {
  const dealIdResult = idParamSchema.safeParse(dealId);
  if (!dealIdResult.success) {
    throw new Error(formatZodError(dealIdResult.error));
  }
  const dataResult = savePaymentPlanInputSchema.safeParse(data);
  if (!dataResult.success) {
    throw new Error(formatZodError(dataResult.error));
  }
  const plan = await prisma.paymentPlan.upsert({
    where: { dealId: dealIdResult.data },
    create: {
      dealId: dealIdResult.data,
      downPaymentAmount: dataResult.data.downPaymentAmount,
      installmentCount: dataResult.data.installmentCount,
      installmentAmount: dataResult.data.installmentAmount,
      balloonAmount: dataResult.data.balloonAmount,
      balloonDueMonth: dataResult.data.balloonDueMonth,
    },
    update: {
      downPaymentAmount: dataResult.data.downPaymentAmount,
      installmentCount: dataResult.data.installmentCount,
      installmentAmount: dataResult.data.installmentAmount,
      balloonAmount: dataResult.data.balloonAmount,
      balloonDueMonth: dataResult.data.balloonDueMonth,
    },
  });

  const total = getPaymentPlanTotal(mapPrismaPaymentPlan(plan));
  await prisma.deal.update({
    where: { id: dealIdResult.data },
    data: { value: total },
  });

  return mapPrismaPaymentPlan(plan);
}

export async function updateDeal(
  dealId: string,
  payload: {
    title?: string;
    value?: number;
    stage?: Deal["stage"];
    lifecycleId?: string | null;
    personId?: string;
    unitId?: string | null;
    expectedCloseDate?: string | null;
  }
): Promise<Deal | undefined> {
  const dealIdResult = idParamSchema.safeParse(dealId);
  if (!dealIdResult.success) {
    throw new Error(formatZodError(dealIdResult.error));
  }
  const payloadResult = updateDealPayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }
  const validatedPayload = payloadResult.data;

  const currentDeal = await prisma.deal.findUnique({ where: { id: dealIdResult.data } });
  if (!currentDeal) return undefined;
  
  const previousUnitId = currentDeal.unitId;

  if (validatedPayload.unitId !== undefined && previousUnitId && previousUnitId !== validatedPayload.unitId) {
    // Release previous unit explicitly
    await updateUnit(previousUnitId, {
      status: "available",
      dealId: null,
      personId: null,
    });
  }

  const updatedDeal = await prisma.deal.update({
    where: { id: dealIdResult.data },
    data: {
      ...(validatedPayload.title !== undefined && { title: validatedPayload.title }),
      ...(validatedPayload.value !== undefined && { value: validatedPayload.value }),
      ...(validatedPayload.stage !== undefined && { stage: validatedPayload.stage as DealStage }),
      ...(validatedPayload.lifecycleId !== undefined && { lifecycleId: validatedPayload.lifecycleId }),
      ...(validatedPayload.personId !== undefined && { personId: validatedPayload.personId }),
      ...(validatedPayload.unitId !== undefined && { unitId: validatedPayload.unitId }),
      ...(validatedPayload.expectedCloseDate !== undefined && { 
        expectedCloseDate: validatedPayload.expectedCloseDate ? new Date(validatedPayload.expectedCloseDate) : null 
      }),
    },
    include: { paymentPlan: true },
  });

  // Explicit service calls for state changes
  if (updatedDeal.stage === "won" && updatedDeal.unitId) {
    await updateUnit(updatedDeal.unitId, {
      status: "sold",
      dealId: updatedDeal.id,
      personId: updatedDeal.personId,
    });
  } else if (updatedDeal.stage === "lost") {
    if (updatedDeal.unitId) {
      await updateUnit(updatedDeal.unitId, {
        status: "available",
        dealId: null,
        personId: null,
      });
    }
  } else if (validatedPayload.unitId === null && previousUnitId) {
    await updateUnit(previousUnitId, {
      status: "available",
      dealId: null,
      personId: null,
    });
  }

  return mapPrismaDeal(updatedDeal);
}

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const events = await prisma.timelineEvent.findMany({
    orderBy: { createdAt: "desc" },
  });
  return events.map(mapPrismaTimelineEvent);
}

export async function getLeads(): Promise<Lead[]> {
  const leads = await prisma.lead.findMany({
    where: { archivedAt: null },
    include: { person: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
  return leads.map(mapPrismaLead);
}

export async function createLead(
  payload: Parameters<typeof createLeadPayloadSchema.parse>[0],
): Promise<Lead> {
  const payloadResult = createLeadPayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }
  const validatedPayload = payloadResult.data;

  const lead = await prisma.lead.create({
    data: {
      name: validatedPayload.name,
      email: validatedPayload.email,
      phone: validatedPayload.phone,
      sourceId: validatedPayload.sourceId ?? undefined,
      status: validatedPayload.status,
      lifecycleId: validatedPayload.lifecycleId ?? undefined,
      notes: validatedPayload.notes,

      sourceType: validatedPayload.sourceType,
      sourcePlatform: validatedPayload.sourcePlatform,
      utmSource: validatedPayload.utmSource,
      utmMedium: validatedPayload.utmMedium,
      utmCampaign: validatedPayload.utmCampaign,

      gclid: validatedPayload.gclid,
      fbclid: validatedPayload.fbclid,

      consentMarketing: validatedPayload.consentMarketing,
      consentMarketingSource: validatedPayload.consentMarketingSource,
    },
  });

  return mapPrismaLead(lead);
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { person: { select: { id: true } } },
  });
  return lead ? mapPrismaLead(lead) : undefined;
}

export async function updateLead(
  leadId: string,
  payload: {
    status?: Lead["status"];
    lifecycleId?: string | null;
    sourceId?: string | null;
  }
): Promise<Lead | undefined> {
  const leadIdResult = idParamSchema.safeParse(leadId);
  if (!leadIdResult.success) {
    throw new Error(formatZodError(leadIdResult.error));
  }
  const payloadResult = updateLeadPayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }
  const validatedPayload = payloadResult.data;

  const lead = await prisma.lead.update({
    where: { id: leadIdResult.data },
    data: {
      ...(validatedPayload.status !== undefined && { status: validatedPayload.status as LeadStatus }),
      ...(validatedPayload.lifecycleId !== undefined && { lifecycleId: validatedPayload.lifecycleId }),
      ...(validatedPayload.sourceId !== undefined && { sourceId: validatedPayload.sourceId }),
    },
  });
  return mapPrismaLead(lead);
}

export async function updateLeadDetails(
  leadId: string,
  payload: Parameters<typeof updateLeadDetailsPayloadSchema.parse>[0],
): Promise<Lead | undefined> {
  const leadIdResult = idParamSchema.safeParse(leadId);
  if (!leadIdResult.success) {
    throw new Error(formatZodError(leadIdResult.error));
  }
  const payloadResult = updateLeadDetailsPayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }
  const validatedPayload = payloadResult.data;

  const lead = await prisma.lead.update({
    where: { id: leadIdResult.data },
    data: {
      ...(validatedPayload.name !== undefined && { name: validatedPayload.name }),
      ...(validatedPayload.email !== undefined && { email: validatedPayload.email }),
      ...(validatedPayload.phone !== undefined && { phone: validatedPayload.phone }),
      ...(validatedPayload.sourceId !== undefined && { sourceId: validatedPayload.sourceId }),
      ...(validatedPayload.status !== undefined && {
        status: validatedPayload.status as LeadStatus,
      }),
      ...(validatedPayload.lifecycleId !== undefined && {
        lifecycleId: validatedPayload.lifecycleId,
      }),
      ...(validatedPayload.notes !== undefined && { notes: validatedPayload.notes }),

      ...(validatedPayload.sourceType !== undefined && {
        sourceType: validatedPayload.sourceType,
      }),
      ...(validatedPayload.sourcePlatform !== undefined && {
        sourcePlatform: validatedPayload.sourcePlatform,
      }),
      ...(validatedPayload.utmSource !== undefined && {
        utmSource: validatedPayload.utmSource,
      }),
      ...(validatedPayload.utmMedium !== undefined && {
        utmMedium: validatedPayload.utmMedium,
      }),
      ...(validatedPayload.utmCampaign !== undefined && {
        utmCampaign: validatedPayload.utmCampaign,
      }),

      ...(validatedPayload.gclid !== undefined && { gclid: validatedPayload.gclid }),
      ...(validatedPayload.fbclid !== undefined && { fbclid: validatedPayload.fbclid }),

      ...(validatedPayload.consentMarketing !== undefined && {
        consentMarketing: validatedPayload.consentMarketing,
      }),
      ...(validatedPayload.consentMarketingSource !== undefined && {
        consentMarketingSource: validatedPayload.consentMarketingSource,
      }),
    },
  });

  return mapPrismaLead(lead);
}

export async function archiveLead(leadId: string): Promise<void> {
  const leadIdResult = idParamSchema.safeParse(leadId);
  if (!leadIdResult.success) {
    throw new Error(formatZodError(leadIdResult.error));
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadIdResult.data },
  });
  if (!lead) {
    throw new Error("Aday bulunamadı.");
  }
  if (lead.status === "converted") {
    throw new Error("Dönüştürülmüş adaylar arşivlenemez.");
  }

  await prisma.lead.update({
    where: { id: leadIdResult.data },
    data: { archivedAt: new Date() },
  });
}

export async function getLifecycles(): Promise<Lifecycle[]> {
  const lifecycles = await prisma.lifecycle.findMany({
    orderBy: { order: "asc" },
  });
  return lifecycles.map(mapPrismaLifecycle);
}

export async function getLifecycleById(id: string): Promise<Lifecycle | undefined> {
  const lifecycle = await prisma.lifecycle.findUnique({
    where: { id },
  });
  return lifecycle ? mapPrismaLifecycle(lifecycle) : undefined;
}

export async function getLeadSources(): Promise<LeadSource[]> {
  const sources = await prisma.leadSource.findMany({
    orderBy: { order: "asc" },
  });
  return sources.map(mapPrismaLeadSource);
}

export async function getLeadSourceById(id: string): Promise<LeadSource | undefined> {
  const source = await prisma.leadSource.findUnique({
    where: { id },
  });
  return source ? mapPrismaLeadSource(source) : undefined;
}

export async function createLeadSource(
  payload: Parameters<typeof createLeadSourcePayloadSchema.parse>[0],
): Promise<LeadSource> {
  const payloadResult = createLeadSourcePayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }
  const validatedPayload = payloadResult.data;
  const source = await prisma.leadSource.create({
    data: {
      name: validatedPayload.name,
      description: validatedPayload.description,
      order: validatedPayload.order,
      color: validatedPayload.color,
    },
  });
  return mapPrismaLeadSource(source);
}

export async function updateLeadSource(
  id: string,
  payload: Parameters<typeof updateLeadSourcePayloadSchema.parse>[0],
): Promise<LeadSource | undefined> {
  const idResult = idParamSchema.safeParse(id);
  if (!idResult.success) {
    throw new Error(formatZodError(idResult.error));
  }
  const payloadResult = updateLeadSourcePayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }
  const validatedPayload = payloadResult.data;
  const source = await prisma.leadSource.update({
    where: { id: idResult.data },
    data: {
      ...(validatedPayload.name !== undefined && { name: validatedPayload.name }),
      ...(validatedPayload.description !== undefined && { description: validatedPayload.description }),
      ...(validatedPayload.order !== undefined && { order: validatedPayload.order }),
      ...(validatedPayload.color !== undefined && { color: validatedPayload.color }),
    },
  });
  return mapPrismaLeadSource(source);
}

export async function deleteLeadSource(id: string): Promise<void> {
  const idResult = idParamSchema.safeParse(id);
  if (!idResult.success) {
    throw new Error(formatZodError(idResult.error));
  }
  await prisma.leadSource.delete({
    where: { id: idResult.data },
  });
}

export async function getTeams(): Promise<Team[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role ?? "MEMBER",
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }));
}

export async function getTeamById(id: string): Promise<Team | undefined> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? "MEMBER",
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  } : undefined;
}

export async function convertLead(
  leadId: string,
  options?: { createDeal?: boolean }
): Promise<{
  personId: string;
  dealId?: string;
}> {
  const leadIdResult = idParamSchema.safeParse(leadId);
  if (!leadIdResult.success) {
    throw new Error(formatZodError(leadIdResult.error));
  }
  const optionsResult = convertLeadOptionsSchema.safeParse(options);
  if (!optionsResult.success) {
    throw new Error(formatZodError(optionsResult.error));
  }
  const validatedOptions = optionsResult.data;

  const lead = await prisma.lead.findUnique({ where: { id: leadIdResult.data } });
  if (!lead) throw new Error("Aday bulunamadı.");
  if (lead.status === "converted" || lead.status === "lost") {
    throw new Error(`Aday dönüştürülemez: durumu ${lead.status}`);
  }

  const result = await prisma.$transaction(async (tx) => {
    const person = await tx.person.create({
      data: {
        leadId: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        notes: lead.notes,
      },
    });

    let dealId: string | undefined;
    if (validatedOptions?.createDeal) {
      const defaultLifecycleId =
        process.env.DEFAULT_DEAL_LIFECYCLE_ID ??
        (await tx.lifecycle.findFirst({ orderBy: { order: "asc" } }))?.id ??
        null;
      const deal = await tx.deal.create({
        data: {
          title: lead.notes ? `Fırsat - ${lead.notes}` : "Yeni fırsat",
          value: 0,
          stage: "inquiry",
          lifecycleId: defaultLifecycleId,
          personId: person.id,
        },
      });
      dealId = deal.id;
    }

    await tx.lead.update({
      where: { id: leadIdResult.data },
      data: { status: "converted" },
    });

    return { personId: person.id, dealId };
  });

  return result;
}

// Individual exports are used as Server Actions
