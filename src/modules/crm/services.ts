"use server";

import { prisma } from "@/lib/prisma";
import {
  Deal,
  TimelineEvent,
  Lead,
  Lifecycle,
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
  PaymentPlan as PrismaPaymentPlan,
  TimelineEvent as PrismaTimelineEvent,
  LeadStatus,
  DealStage
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
    stage: d.stage as any,
    lifecycleId: d.lifecycleId ?? undefined,
    expectedCloseDate: d.expectedCloseDate?.toISOString(),
    paymentPlan: d.paymentPlan ? mapPrismaPaymentPlan(d.paymentPlan) : undefined,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}

function mapPrismaLead(l: PrismaLead): Lead {
  return {
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone ?? undefined,
    source: l.source ?? undefined,
    status: l.status as any,
    lifecycleId: l.lifecycleId ?? undefined,
    notes: l.notes ?? undefined,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
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
    entityType: e.entityType as any,
    entityId: e.entityId,
    type: e.type as any,
    title: e.title ?? undefined,
    description: e.description ?? undefined,
    metadata: (e.metadata as any) ?? undefined,
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
  const plan = await prisma.paymentPlan.upsert({
    where: { dealId },
    create: {
      dealId,
      downPaymentAmount: data.downPaymentAmount,
      installmentCount: data.installmentCount,
      installmentAmount: data.installmentAmount,
      balloonAmount: data.balloonAmount,
      balloonDueMonth: data.balloonDueMonth,
    },
    update: {
      downPaymentAmount: data.downPaymentAmount,
      installmentCount: data.installmentCount,
      installmentAmount: data.installmentAmount,
      balloonAmount: data.balloonAmount,
      balloonDueMonth: data.balloonDueMonth,
    },
  });

  const total = getPaymentPlanTotal(mapPrismaPaymentPlan(plan));
  await prisma.deal.update({
    where: { id: dealId },
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
  const currentDeal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!currentDeal) return undefined;
  
  const previousUnitId = currentDeal.unitId;

  if (payload.unitId !== undefined && previousUnitId && previousUnitId !== payload.unitId) {
    // Release previous unit explicitly
    await updateUnit(previousUnitId, {
      status: "available",
      dealId: null,
      personId: null,
    });
  }

  const updatedDeal = await prisma.deal.update({
    where: { id: dealId },
    data: {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.value !== undefined && { value: payload.value }),
      ...(payload.stage !== undefined && { stage: payload.stage as DealStage }),
      ...(payload.lifecycleId !== undefined && { lifecycleId: payload.lifecycleId }),
      ...(payload.personId !== undefined && { personId: payload.personId }),
      ...(payload.unitId !== undefined && { unitId: payload.unitId }),
      ...(payload.expectedCloseDate !== undefined && { 
        expectedCloseDate: payload.expectedCloseDate ? new Date(payload.expectedCloseDate) : null 
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
  } else if (payload.unitId === null && previousUnitId) {
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

export async function getTimelineEventById(id: string): Promise<TimelineEvent | undefined> {
  const event = await prisma.timelineEvent.findUnique({
    where: { id },
  });
  return event ? mapPrismaTimelineEvent(event) : undefined;
}

export async function getLeads(): Promise<Lead[]> {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
  return leads.map(mapPrismaLead);
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  const lead = await prisma.lead.findUnique({
    where: { id },
  });
  return lead ? mapPrismaLead(lead) : undefined;
}

export async function updateLead(
  leadId: string,
  payload: {
    status?: Lead["status"];
    lifecycleId?: string | null;
  }
): Promise<Lead | undefined> {
  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...(payload.status !== undefined && { status: payload.status as LeadStatus }),
      ...(payload.lifecycleId !== undefined && { lifecycleId: payload.lifecycleId }),
    },
  });
  return mapPrismaLead(lead);
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
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");
  if (lead.status === "converted" || lead.status === "lost") {
    throw new Error(`Lead cannot be converted: status is ${lead.status}`);
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
    if (options?.createDeal) {
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
      where: { id: leadId },
      data: { status: "converted" },
    });

    return { personId: person.id, dealId };
  });

  return result;
}

// Individual exports are used as Server Actions
