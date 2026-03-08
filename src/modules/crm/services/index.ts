import {
  Deal,
  TimelineEvent,
  Lead,
  Lifecycle,
  Team,
  Person,
  PaymentPlan,
  getPaymentPlanTotal,
} from "../types";
import {
  persons as personFixtures,
  deals as dealFixtures,
  timelineEvents as timelineEventFixtures,
  leads as leadFixtures,
  lifecycles as lifecycleFixtures,
  teams as teamFixtures,
  paymentPlans as paymentPlanFixtures,
} from "../fixtures";
import { projectServices } from "@/modules/project/services";

function nextId(items: { id: string }[], prefix: string): string {
  const numbers = items
    .map((item) => {
      const match = item.id.match(new RegExp(`^${prefix}-(\\d+)$`));
      return match ? parseInt(match[1], 10) : NaN;
    })
    .filter((number) => !Number.isNaN(number));
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `${prefix}-${next}`;
}

export const crmServices = {
  // Person services
  getPersons: (): Promise<Person[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...personFixtures]), 200);
    });
  },

  getPersonById: (id: string): Promise<Person | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const person = personFixtures.find((personItem) => personItem.id === id);
        resolve(person);
      }, 200);
    });
  },

  // Deal services
  getDeals: (): Promise<Deal[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...dealFixtures]), 200);
    });
  },

  getDealById: (id: string): Promise<Deal | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deal = dealFixtures.find((d) => d.id === id);
        resolve(deal ? { ...deal } : undefined);
      }, 200);
    });
  },

  getDealsByPersonId: (personId: string): Promise<Deal[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = dealFixtures.filter((deal) => deal.personId === personId);
        resolve(deals.map((deal) => ({ ...deal })));
      }, 200);
    });
  },

  getDealWithUnit: async (
    dealId: string
  ): Promise<
    | { deal: Deal; unit: { id: string; code: string; projectId: string }; project: { id: string; name: string } }
    | undefined
  > => {
    const deal = dealFixtures.find((d) => d.id === dealId);
    if (!deal || !deal.unitId) return undefined;
    const unit = await projectServices.getUnitById(deal.unitId);
    if (!unit) return undefined;
    const project = await projectServices.getProjectById(unit.projectId);
    if (!project) return undefined;
    return {
      deal: { ...deal },
      unit: { id: unit.id, code: unit.code, projectId: unit.projectId },
      project: { id: project.id, name: project.name },
    };
  },

  getPaymentPlanByDealId: (dealId: string): Promise<PaymentPlan | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = paymentPlanFixtures.find((planItem) => planItem.dealId === dealId);
        resolve(plan ? { ...plan } : undefined);
      }, 100);
    });
  },

  getDealWithPaymentPlan: async (
    dealId: string
  ): Promise<(Deal & { paymentPlan?: PaymentPlan }) | undefined> => {
    const deal = dealFixtures.find((d) => d.id === dealId);
    if (!deal) return undefined;
    const plan = paymentPlanFixtures.find((planItem) => planItem.dealId === dealId);
    return { ...deal, ...(plan && { paymentPlan: { ...plan } }) };
  },

  savePaymentPlan: (
    dealId: string,
    data: Omit<PaymentPlan, "id" | "dealId" | "createdAt" | "updatedAt">
  ): Promise<PaymentPlan> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const deal = dealFixtures.find((d) => d.id === dealId);
        if (!deal) {
          reject(new Error("Deal not found"));
          return;
        }
        const now = new Date().toISOString().slice(0, 10);
        const existing = paymentPlanFixtures.find((planItem) => planItem.dealId === dealId);
        let plan: PaymentPlan;
        if (existing) {
          existing.downPaymentAmount = data.downPaymentAmount;
          existing.installmentCount = data.installmentCount;
          existing.installmentAmount = data.installmentAmount;
          existing.balloonAmount = data.balloonAmount;
          existing.balloonDueMonth = data.balloonDueMonth;
          existing.updatedAt = now;
          plan = { ...existing };
        } else {
          const newPlan: PaymentPlan = {
            id: nextId(paymentPlanFixtures, "payment-plan"),
            dealId,
            downPaymentAmount: data.downPaymentAmount,
            installmentCount: data.installmentCount,
            installmentAmount: data.installmentAmount,
            balloonAmount: data.balloonAmount,
            balloonDueMonth: data.balloonDueMonth,
            createdAt: now,
            updatedAt: now,
          };
          paymentPlanFixtures.push(newPlan);
          plan = { ...newPlan };
        }
        const total = getPaymentPlanTotal(plan);
        deal.value = total;
        deal.updatedAt = now;
        resolve(plan);
      }, 200);
    });
  },

  updateDeal: (
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
  ): Promise<Deal | undefined> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const deal = dealFixtures.find((d) => d.id === dealId);
        if (!deal) {
          resolve(undefined);
          return;
        }
        const previousUnitId = deal.unitId;
        const previousStage = deal.stage;

        if (payload.unitId !== undefined) {
          if (payload.unitId) {
            const unit = await projectServices.getUnitById(payload.unitId);
            if (unit?.dealId && unit.dealId !== dealId) {
              const otherDeal = dealFixtures.find((d) => d.id === unit.dealId);
              if (otherDeal) {
                otherDeal.unitId = undefined;
                otherDeal.updatedAt = new Date().toISOString().slice(0, 10);
                await projectServices.updateUnit(payload.unitId, {
                  status: "available",
                  dealId: null,
                  personId: null,
                });
              }
            }
          }
          deal.unitId = payload.unitId ?? undefined;
        }

        if (payload.title !== undefined) deal.title = payload.title;
        if (payload.value !== undefined) deal.value = payload.value;
        if (payload.lifecycleId !== undefined) {
          deal.lifecycleId = payload.lifecycleId ?? undefined;
          if (payload.lifecycleId) {
            const lifecycle = lifecycleFixtures.find((lifecycleItem) => lifecycleItem.id === payload.lifecycleId);
            if (lifecycle) {
              const orderToStage: Record<number, Deal["stage"]> = {
                1: "inquiry",
                2: "meeting",
                3: "offer",
                4: "negotiation",
                5: "won",
                6: "lost",
              };
              deal.stage = orderToStage[lifecycle.order] ?? deal.stage;
            }
          }
        }
        if (payload.stage !== undefined) deal.stage = payload.stage;
        if (payload.personId !== undefined) deal.personId = payload.personId;
        if (payload.expectedCloseDate !== undefined) deal.expectedCloseDate = payload.expectedCloseDate ?? undefined;

        const now = new Date().toISOString().slice(0, 10);
        deal.updatedAt = now;

        if (deal.stage === "won" && deal.unitId) {
          await projectServices.updateUnit(deal.unitId, {
            status: "sold",
            dealId: deal.id,
            personId: deal.personId,
          });
        }
        if ((deal.stage === "lost" || payload.unitId === null) && previousUnitId) {
          await projectServices.updateUnit(previousUnitId, {
            status: "available",
            dealId: null,
            personId: null,
          });
        }

        resolve({ ...deal });
      }, 200);
    });
  },

  // Timeline event services
  getTimelineEvents: (): Promise<TimelineEvent[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...timelineEventFixtures]), 200);
    });
  },

  getTimelineEventById: (id: string): Promise<TimelineEvent | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const event = timelineEventFixtures.find((eventItem) => eventItem.id === id);
        resolve(event);
      }, 200);
    });
  },

  // Lead services
  getLeads: (): Promise<Lead[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...leadFixtures]), 200);
    });
  },

  getLeadById: (id: string): Promise<Lead | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lead = leadFixtures.find((leadItem) => leadItem.id === id);
        resolve(lead);
      }, 200);
    });
  },

  updateLead: (
    leadId: string,
    payload: {
      status?: Lead["status"];
      lifecycleId?: string | null;
    }
  ): Promise<Lead | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lead = leadFixtures.find((leadItem) => leadItem.id === leadId);
        if (!lead) {
          resolve(undefined);
          return;
        }
        if (payload.lifecycleId !== undefined) {
          lead.lifecycleId = payload.lifecycleId ?? undefined;
          if (payload.lifecycleId) {
            const lifecycle = lifecycleFixtures.find((lifecycleItem) => lifecycleItem.id === payload.lifecycleId);
            if (lifecycle) {
              const orderToStatus: Record<number, Lead["status"]> = {
                1: "new",
                2: "qualified",
                3: "qualified",
                4: "qualified",
                5: "converted",
                6: "lost",
              };
              lead.status = orderToStatus[lifecycle.order] ?? lead.status;
            }
          }
        }
        if (payload.status !== undefined) lead.status = payload.status;
        lead.updatedAt = new Date().toISOString().slice(0, 10);
        resolve({ ...lead });
      }, 200);
    });
  },

  // Lifecycle services
  getLifecycles: (): Promise<Lifecycle[]> => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([...lifecycleFixtures].sort((a, b) => a.order - b.order)),
        200
      );
    });
  },

  getLifecycleById: (id: string): Promise<Lifecycle | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lifecycle = lifecycleFixtures.find((lifecycleItem) => lifecycleItem.id === id);
        resolve(lifecycle);
      }, 200);
    });
  },

  // Team services
  getTeams: (): Promise<Team[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...teamFixtures]), 200);
    });
  },

  getTeamById: (id: string): Promise<Team | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const team = teamFixtures.find((teamItem) => teamItem.id === id);
        resolve(team);
      }, 200);
    });
  },

  convertLead: (
    leadId: string,
    options?: { createDeal?: boolean }
  ): Promise<{
    personId: string;
    dealId?: string;
  }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lead = leadFixtures.find((leadItem) => leadItem.id === leadId);
        if (!lead) {
          reject(new Error("Lead not found"));
          return;
        }
        if (lead.status === "converted" || lead.status === "lost") {
          reject(
            new Error(
              `Lead cannot be converted: status is ${lead.status}`
            )
          );
          return;
        }

        const now = new Date().toISOString().slice(0, 10);
        const personId = nextId(personFixtures, "person");
        const newPerson: Person = {
          id: personId,
          leadId: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          notes: lead.notes,
          createdAt: now,
          updatedAt: now,
        };
        personFixtures.push(newPerson);

        let dealId: string | undefined;
        if (options?.createDeal) {
          dealId = nextId(dealFixtures, "deal");
          dealFixtures.push({
            id: dealId,
            title: lead.notes ? `Fırsat - ${lead.notes}` : "Yeni fırsat",
            value: 0,
            stage: "inquiry",
            lifecycleId: "lifecycle-1",
            personId,
            createdAt: now,
            updatedAt: now,
          });
        }

        lead.status = "converted";
        lead.updatedAt = now;

        resolve({
          personId,
          ...(dealId && { dealId }),
        });
      }, 200);
    });
  },
};
