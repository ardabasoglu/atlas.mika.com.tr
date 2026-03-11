import { describe, expect, it } from "vitest";
import {
  mapPrismaDeal,
  mapPrismaLead,
  mapPrismaLeadSource,
  mapPrismaLifecycle,
  mapPrismaPaymentPlan,
  mapPrismaPerson,
  mapPrismaTimelineEvent,
} from "./mappers";

describe("crm mappers", () => {
  it("maps PrismaPerson to Person", () => {
    const now = new Date();
    const prismaPerson: any = {
      id: "person-1",
      leadId: "lead-1",
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "123",
      notes: "note",
      createdAt: now,
      updatedAt: now,
    };

    const result = mapPrismaPerson(prismaPerson);

    expect(result).toEqual({
      id: "person-1",
      leadId: "lead-1",
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "123",
      notes: "note",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it("maps PrismaPaymentPlan to PaymentPlan", () => {
    const now = new Date();
    const prismaPlan: any = {
      id: "plan-1",
      dealId: "deal-1",
      downPaymentAmount: 1000,
      installmentCount: 10,
      installmentAmount: 500,
      balloonAmount: 0,
      balloonDueMonth: null,
      createdAt: now,
      updatedAt: now,
    };

    const result = mapPrismaPaymentPlan(prismaPlan);

    expect(result).toEqual({
      id: "plan-1",
      dealId: "deal-1",
      downPaymentAmount: 1000,
      installmentCount: 10,
      installmentAmount: 500,
      balloonAmount: 0,
      balloonDueMonth: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it("maps PrismaDeal with optional paymentPlan", () => {
    const now = new Date();
    const prismaDeal: any = {
      id: "deal-1",
      personId: "person-1",
      unitId: null,
      title: "Deal",
      value: 10000,
      currency: null,
      stage: "offer",
      lifecycleId: null,
      expectedCloseDate: now,
      paymentPlan: null,
      createdAt: now,
      updatedAt: now,
    };

    const result = mapPrismaDeal(prismaDeal);

    expect(result).toEqual({
      id: "deal-1",
      personId: "person-1",
      unitId: undefined,
      title: "Deal",
      value: 10000,
      currency: undefined,
      stage: "offer",
      lifecycleId: undefined,
      expectedCloseDate: now.toISOString(),
      paymentPlan: undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it("maps PrismaLead with nullable fields and person relation", () => {
    const now = new Date();
    const prismaLead: any = {
      id: "lead-1",
      name: "Lead Name",
      email: "lead@example.com",
      phone: null,
      sourceId: null,
      status: "new",
      lifecycleId: null,
      notes: null,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
      person: { id: "person-1" },
      duplicateOfLeadId: null,
      sourceType: null,
      sourcePlatform: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      gclid: null,
      fbclid: null,
      consentMarketing: null,
      consentMarketingSource: null,
    };

    const result = mapPrismaLead(prismaLead);

    expect(result).toEqual({
      id: "lead-1",
      name: "Lead Name",
      email: "lead@example.com",
      phone: undefined,
      sourceId: undefined,
      status: "new",
      lifecycleId: undefined,
      notes: undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      archivedAt: undefined,
      personId: "person-1",
      duplicateOfLeadId: undefined,
      sourceType: undefined,
      sourcePlatform: undefined,
      utmSource: undefined,
      utmMedium: undefined,
      utmCampaign: undefined,
      gclid: undefined,
      fbclid: undefined,
      consentMarketing: undefined,
      consentMarketingSource: undefined,
    });
  });

  it("maps PrismaLeadSource and Lifecycle", () => {
    const now = new Date();
    const prismaSource: any = {
      id: "source-1",
      name: "Google Ads",
      description: null,
      order: 1,
      color: null,
      createdAt: now,
      updatedAt: now,
    };
    const prismaLifecycle: any = {
      id: "lifecycle-1",
      name: "Yeni",
      description: null,
      order: 1,
      color: null,
      createdAt: now,
      updatedAt: now,
    };

    expect(mapPrismaLeadSource(prismaSource)).toEqual({
      id: "source-1",
      name: "Google Ads",
      description: undefined,
      order: 1,
      color: undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    expect(mapPrismaLifecycle(prismaLifecycle)).toEqual({
      id: "lifecycle-1",
      name: "Yeni",
      description: undefined,
      order: 1,
      color: undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it("maps PrismaTimelineEvent to TimelineEvent", () => {
    const now = new Date();
    const prismaEvent: any = {
      id: "event-1",
      entityType: "lead",
      entityId: "lead-1",
      type: "note",
      title: "Title",
      description: "Desc",
      metadata: { foo: "bar" },
      createdBy: "user-1",
      createdAt: now,
    };

    const result = mapPrismaTimelineEvent(prismaEvent);

    expect(result).toEqual({
      id: "event-1",
      entityType: "lead",
      entityId: "lead-1",
      type: "note",
      title: "Title",
      description: "Desc",
      metadata: { foo: "bar" },
      createdBy: "user-1",
      createdAt: now.toISOString(),
    });
  });
});

