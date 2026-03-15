import type {
  Deal,
  Lifecycle,
  Lead,
  LeadSource,
  PaymentPlan,
  Person,
  TimelineEvent,
} from "./types";
import type {
  Deal as PrismaDeal,
  Lifecycle as PrismaLifecycle,
  Lead as PrismaLead,
  LeadSource as PrismaLeadSource,
  PaymentPlan as PrismaPaymentPlan,
  Person as PrismaPerson,
  TimelineEvent as PrismaTimelineEvent,
} from "@/generated/prisma/client";

export function mapPrismaPerson(p: PrismaPerson): Person {
  return {
    id: p.id,
    leadId: p.leadId ?? undefined,
    name: p.name,
    email: p.email,
    phone: p.phone ?? undefined,
    notes: p.notes ?? undefined,
    archivedAt: p.archivedAt?.toISOString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function mapPrismaPaymentPlan(p: PrismaPaymentPlan): PaymentPlan {
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

export function mapPrismaDeal(
  deal: PrismaDeal & { paymentPlan?: PrismaPaymentPlan | null },
): Deal {
  return {
    id: deal.id,
    personId: deal.personId,
    unitId: deal.unitId ?? undefined,
    title: deal.title,
    value: Number(deal.value),
    currency: deal.currency ?? undefined,
    stage: deal.stage as Deal["stage"],
    lifecycleId: deal.lifecycleId ?? undefined,
    expectedCloseDate: deal.expectedCloseDate?.toISOString(),
    paymentPlan: deal.paymentPlan ? mapPrismaPaymentPlan(deal.paymentPlan) : undefined,
    createdAt: deal.createdAt.toISOString(),
    updatedAt: deal.updatedAt.toISOString(),
  };
}

export function mapPrismaLead(
  lead: PrismaLead & { person?: { id: string } | null },
): Lead {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? undefined,
    sourceId: lead.sourceId ?? undefined,
    status: lead.status as Lead["status"],
    lifecycleId: lead.lifecycleId ?? undefined,
    notes: lead.notes ?? undefined,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),

    archivedAt: lead.archivedAt?.toISOString(),
    personId:
      (lead as PrismaLead & { personId?: string | null }).personId ??
      lead.person?.id ??
      undefined,
    duplicateOfLeadId: lead.duplicateOfLeadId ?? undefined,

    sourceType: lead.sourceType ?? undefined,
    sourcePlatform: lead.sourcePlatform ?? undefined,
    utmSource: lead.utmSource ?? undefined,
    utmMedium: lead.utmMedium ?? undefined,
    utmCampaign: lead.utmCampaign ?? undefined,

    gclid: lead.gclid ?? undefined,
    fbclid: lead.fbclid ?? undefined,
    referrer: lead.referrer ?? undefined,

    consentMarketing: lead.consentMarketing ?? undefined,
    consentMarketingSource: lead.consentMarketingSource ?? undefined,
    consentInformative: lead.consentInformative ?? undefined,

    convertedAt: lead.convertedAt?.toISOString(),
    convertedByUserId: lead.convertedByUserId ?? undefined,
  };
}

export function mapPrismaLeadSource(source: PrismaLeadSource): LeadSource {
  return {
    id: source.id,
    name: source.name,
    description: source.description ?? undefined,
    order: source.order,
    color: source.color ?? undefined,
    createdAt: source.createdAt.toISOString(),
    updatedAt: source.updatedAt.toISOString(),
  };
}

export function mapPrismaLifecycle(lifecycle: PrismaLifecycle): Lifecycle {
  return {
    id: lifecycle.id,
    name: lifecycle.name,
    description: lifecycle.description ?? undefined,
    order: lifecycle.order,
    color: lifecycle.color ?? undefined,
    createdAt: lifecycle.createdAt.toISOString(),
    updatedAt: lifecycle.updatedAt.toISOString(),
  };
}

export function mapPrismaTimelineEvent(
  event: PrismaTimelineEvent,
): TimelineEvent {
  return {
    id: event.id,
    entityType: event.entityType as TimelineEvent["entityType"],
    entityId: event.entityId,
    type: event.type as TimelineEvent["type"],
    title: event.title ?? undefined,
    description: event.description ?? undefined,
    metadata: (event.metadata as Record<string, unknown> | null) ?? undefined,
    createdBy: event.createdBy ?? undefined,
    createdAt: event.createdAt.toISOString(),
  };
}

