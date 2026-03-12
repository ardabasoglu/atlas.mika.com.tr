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
  createPersonPayloadSchema,
  updatePersonDetailsPayloadSchema,
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
  DealStage,
  LeadStatus,
} from "@/generated/prisma/client";
import {
  mapPrismaDeal,
  mapPrismaLead,
  mapPrismaLeadSource,
  mapPrismaLifecycle,
  mapPrismaPaymentPlan,
  mapPrismaPerson,
  mapPrismaTimelineEvent,
} from "./mappers";

// --- Services ---

export async function getPersons(): Promise<Person[]> {
  const persons = await prisma.person.findMany({
    where: { archivedAt: null },
    orderBy: { createdAt: "desc" },
  });
  return persons.map(mapPrismaPerson);
}

export async function getArchivedPersons(): Promise<Person[]> {
  const persons = await prisma.person.findMany({
    where: { archivedAt: { not: null } },
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

export async function createPerson(
  payload: Parameters<typeof createPersonPayloadSchema.parse>[0],
): Promise<Person> {
  const payloadResult = createPersonPayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }

  const validatedPayload = payloadResult.data;
  const normalizedEmail = normalizeEmail(validatedPayload.email);

  const person = await prisma.person.create({
    data: {
      name: validatedPayload.name,
      email: normalizedEmail,
      phone: validatedPayload.phone,
      notes: validatedPayload.notes,
    },
  });

  return mapPrismaPerson(person);
}

export async function updatePersonDetails(
  personId: string,
  payload: Parameters<typeof updatePersonDetailsPayloadSchema.parse>[0],
): Promise<Person | undefined> {
  const personIdResult = idParamSchema.safeParse(personId);
  if (!personIdResult.success) {
    throw new Error(formatZodError(personIdResult.error));
  }

  const payloadResult = updatePersonDetailsPayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }

  const validatedPayload = payloadResult.data;
  const normalizedEmail = normalizeEmail(validatedPayload.email);

  const person = await prisma.person.update({
    where: { id: personIdResult.data },
    data: {
      name: validatedPayload.name,
      email: normalizedEmail,
      phone: validatedPayload.phone,
      notes: validatedPayload.notes,
    },
  });

  return mapPrismaPerson(person);
}

export async function archivePerson(personId: string): Promise<void> {
  const personIdResult = idParamSchema.safeParse(personId);
  if (!personIdResult.success) {
    throw new Error(formatZodError(personIdResult.error));
  }

  const person = await prisma.person.findUnique({
    where: { id: personIdResult.data },
    select: { id: true, archivedAt: true },
  });
  if (!person) {
    throw new Error("Kişi bulunamadı.");
  }
  if (person.archivedAt) {
    return;
  }

  await prisma.person.update({
    where: { id: personIdResult.data },
    data: { archivedAt: new Date() },
  });
}

export async function unarchivePerson(personId: string): Promise<void> {
  const personIdResult = idParamSchema.safeParse(personId);
  if (!personIdResult.success) {
    throw new Error(formatZodError(personIdResult.error));
  }

  const person = await prisma.person.findUnique({
    where: { id: personIdResult.data },
    select: { id: true },
  });
  if (!person) {
    throw new Error("Kişi bulunamadı.");
  }

  await prisma.person.update({
    where: { id: personIdResult.data },
    data: { archivedAt: null },
  });
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

  if (
    validatedPayload.stage !== undefined &&
    currentDeal.stage !== validatedPayload.stage
  ) {
    await prisma.timelineEvent.create({
      data: {
        entityType: "deal",
        entityId: updatedDeal.id,
        type: "deal_stage_changed",
        title: "Fırsat aşaması değişti",
        description: `Aşama ${currentDeal.stage} → ${validatedPayload.stage} olarak güncellendi.`,
        metadata: {
          previousStage: currentDeal.stage,
          newStage: validatedPayload.stage,
        },
      },
    });
  }

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

export async function getArchivedLeads(): Promise<Lead[]> {
  const leads = await prisma.lead.findMany({
    where: { archivedAt: { not: null } },
    include: { person: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
  return leads.map(mapPrismaLead);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Returns the id of the canonical (oldest) non-archived lead matching the given email or phone, or null. */
async function findCanonicalDuplicateLeadId(
  email: string,
  phone: string,
): Promise<string | null> {
  const normalizedEmail = normalizeEmail(email);
  const candidates = await prisma.lead.findMany({
    where: {
      archivedAt: null,
      OR: [
        { email: { equals: normalizedEmail, mode: "insensitive" } },
        { phone },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 1,
    select: { id: true },
  });
  return candidates[0]?.id ?? null;
}

/**
 * Resolves the Person to attach to a new lead: reuse canonical lead's person,
 * or find by email/phone, or create. Returns personId and whether we created the person.
 */
async function findOrCreatePersonForLead(
  name: string,
  email: string,
  phone: string | null,
  notes: string | null,
  canonicalLeadId: string | null,
): Promise<{ personId: string; personCreated: boolean }> {
  if (canonicalLeadId) {
    const canonicalLead = await prisma.lead.findUnique({
      where: { id: canonicalLeadId },
      select: { personId: true },
    });
    if (canonicalLead?.personId) {
      return { personId: canonicalLead.personId, personCreated: false };
    }
  }

  const normalizedEmail = normalizeEmail(email);
  const existingPerson = await prisma.person.findFirst({
    where: {
      OR: [
        { email: { equals: normalizedEmail, mode: "insensitive" } },
        ...(phone ? [{ phone }] : []),
      ],
    },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (existingPerson) {
    return { personId: existingPerson.id, personCreated: false };
  }

  const newPerson = await prisma.person.create({
    data: { name, email, phone: phone ?? undefined, notes: notes ?? undefined },
    select: { id: true },
  });
  return { personId: newPerson.id, personCreated: true };
}

export async function createLead(
  payload: Parameters<typeof createLeadPayloadSchema.parse>[0],
): Promise<Lead> {
  const payloadResult = createLeadPayloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    throw new Error(formatZodError(payloadResult.error));
  }
  const validatedPayload = payloadResult.data;

  const canonicalLeadId = await findCanonicalDuplicateLeadId(
    validatedPayload.email,
    validatedPayload.phone,
  );

  const { personId, personCreated } = await findOrCreatePersonForLead(
    validatedPayload.name,
    validatedPayload.email,
    validatedPayload.phone ?? null,
    validatedPayload.notes ?? null,
    canonicalLeadId,
  );

  const lead = await prisma.lead.create({
    data: {
      name: validatedPayload.name,
      email: validatedPayload.email,
      phone: validatedPayload.phone ?? undefined,
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

      duplicateOfLeadId: canonicalLeadId ?? undefined,
      personId,
    },
  });

  if (personCreated) {
    await prisma.person.update({
      where: { id: personId },
      data: { leadId: lead.id },
    });
  }

  if (canonicalLeadId) {
    await prisma.timelineEvent.create({
      data: {
        entityType: "lead",
        entityId: lead.id,
        type: "note",
        title: "Yinelenen aday",
        description: `Mevcut adayla eşleşti (kayıt: ${canonicalLeadId}).`,
      },
    });
  } else {
    await prisma.timelineEvent.create({
      data: {
        entityType: "lead",
        entityId: lead.id,
        type: "note",
        title: "Aday oluşturuldu",
        description: `${validatedPayload.name} aday olarak eklendi.`,
      },
    });
  }

  return mapPrismaLead({ ...lead, person: { id: personId } });
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { person: { select: { id: true } } },
  });
  return lead ? mapPrismaLead(lead) : undefined;
}

/** Returns leads that are marked as duplicates of the given lead (canonical). */
export async function getDuplicatesOfLead(leadId: string): Promise<Lead[]> {
  const leads = await prisma.lead.findMany({
    where: { duplicateOfLeadId: leadId, archivedAt: null },
    include: { person: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
  return leads.map(mapPrismaLead);
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

  const previousLead =
    validatedPayload.status !== undefined
      ? await prisma.lead.findUnique({
          where: { id: leadIdResult.data },
          select: { status: true },
        })
      : null;

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

  if (
    previousLead &&
    validatedPayload.status !== undefined &&
    previousLead.status !== validatedPayload.status
  ) {
    await prisma.timelineEvent.create({
      data: {
        entityType: "lead",
        entityId: lead.id,
        type: "status_change",
        title: "Durum değişikliği",
        description: `Aday durumu ${previousLead.status} → ${validatedPayload.status} olarak güncellendi.`,
        metadata: {
          previousStatus: previousLead.status,
          newStatus: validatedPayload.status,
        },
      },
    });
  }

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

export async function unarchiveLead(leadId: string): Promise<void> {
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

  await prisma.lead.update({
    where: { id: leadIdResult.data },
    data: { archivedAt: null },
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

  const result = await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findUnique({
      where: { id: leadIdResult.data },
      include: { person: { select: { id: true } } },
    });
    if (!lead) {
      throw new Error("Aday bulunamadı.");
    }

    if (lead.status === "lost") {
      throw new Error(`Aday dönüştürülemez: durumu ${lead.status}`);
    }

    // If already converted and linked to a person, behave idempotently.
    if (lead.status === "converted" && lead.person) {
      return { personId: lead.person.id, dealId: undefined as string | undefined };
    }

    // Lead already has a person (created with lead). Just mark converted and optionally create deal.
    if (lead.person) {
      const personIdToUse = lead.person.id;
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
            personId: personIdToUse,
          },
        });
        dealId = deal.id;
        await tx.timelineEvent.create({
          data: {
            entityType: "deal",
            entityId: deal.id,
            type: "deal_created",
            title: "Fırsat oluşturuldu",
            description: deal.title,
          },
        });
        await tx.timelineEvent.create({
          data: {
            entityType: "person",
            entityId: personIdToUse,
            type: "deal_created",
            title: "Yeni fırsat",
            description: deal.title,
          },
        });
      }
      await tx.lead.update({
        where: { id: lead.id },
        data: {
          status: "converted",
          convertedAt: lead.convertedAt ?? new Date(),
        },
      });
      await tx.timelineEvent.create({
        data: {
          entityType: "lead",
          entityId: lead.id,
          type: "status_change",
          title: "Aday dönüştürüldü",
          description: "Aday kişiye dönüştürüldü.",
        },
      });
      await tx.timelineEvent.create({
        data: {
          entityType: "person",
          entityId: personIdToUse,
          type: "status_change",
          title: "Aday kişiye dönüştürüldü",
          description: `${lead.name} adayı kişiye dönüştürüldü.`,
        },
      });
      return { personId: personIdToUse, dealId };
    }

    // Legacy path: lead has no person yet. If already converted but personId was not set, try to repair.
    if (lead.status === "converted" && !lead.person) {
      const personFromLead = await tx.person.findFirst({
        where: { leadId: lead.id },
        select: { id: true },
      });
      if (personFromLead) {
        await tx.lead.update({
          where: { id: lead.id },
          data: {
            personId: personFromLead.id,
            convertedAt: lead.convertedAt ?? new Date(),
          },
        });
        return { personId: personFromLead.id, dealId: undefined as string | undefined };
      }
    }

    // Handle duplicates: if this lead is marked as a duplicate and the canonical lead
    // is already converted, reuse its person.
    let personIdToUse: string | undefined;
    if (lead.duplicateOfLeadId) {
      const canonicalLead = await tx.lead.findUnique({
        where: { id: lead.duplicateOfLeadId },
        include: { person: { select: { id: true } } },
      });
      if (canonicalLead?.status === "converted" && canonicalLead.person) {
        personIdToUse = canonicalLead.person.id;
      } else if (canonicalLead) {
        throw new Error("Bu aday yinelenen bir kayıttır. Lütfen önce asıl adayı dönüştürün.");
      }
    }

    // If we do not yet have a person to use, try to find an existing one by email/phone.
    if (!personIdToUse) {
      const normalizedEmail = normalizeEmail(lead.email);
      const existingPerson = await tx.person.findFirst({
        where: {
          OR: [
            { email: { equals: normalizedEmail, mode: "insensitive" } },
            ...(lead.phone ? [{ phone: lead.phone }] : []),
          ],
        },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });

      if (existingPerson) {
        personIdToUse = existingPerson.id;
      }
    }

    // If still no person is chosen, create a new one originating from this lead.
    if (!personIdToUse) {
      const createdPerson = await tx.person.create({
        data: {
          leadId: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          notes: lead.notes,
        },
        select: { id: true },
      });
      personIdToUse = createdPerson.id;
    }

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
          personId: personIdToUse,
        },
      });
      dealId = deal.id;
      await tx.timelineEvent.create({
        data: {
          entityType: "deal",
          entityId: deal.id,
          type: "deal_created",
          title: "Fırsat oluşturuldu",
          description: deal.title,
        },
      });
      await tx.timelineEvent.create({
        data: {
          entityType: "person",
          entityId: personIdToUse,
          type: "deal_created",
          title: "Yeni fırsat",
          description: deal.title,
        },
      });
    }

    await tx.lead.update({
      where: { id: leadIdResult.data },
      data: {
        status: "converted",
        personId: personIdToUse,
        convertedAt: lead.convertedAt ?? new Date(),
      },
    });

    await tx.timelineEvent.create({
      data: {
        entityType: "lead",
        entityId: lead.id,
        type: "status_change",
        title: "Aday dönüştürüldü",
        description: "Aday kişiye dönüştürüldü.",
      },
    });
    await tx.timelineEvent.create({
      data: {
        entityType: "person",
        entityId: personIdToUse,
        type: "status_change",
        title: "Aday kişiye dönüştürüldü",
        description: `${lead.name} adayı kişiye dönüştürüldü.`,
      },
    });

    return { personId: personIdToUse, dealId };
  });

  return result;
}

// Individual exports are used as Server Actions
