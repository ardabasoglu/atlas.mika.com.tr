export const queryKeys = {
  crm: {
    all: ["crm"] as const,
    deals: () => [...queryKeys.crm.all, "deals"] as const,
    deal: (id: string) => [...queryKeys.crm.all, "deal", id] as const,
    dealWithUnit: (id: string) =>
      [...queryKeys.crm.deal(id), "withUnit"] as const,
    dealWithPaymentPlan: (id: string) =>
      [...queryKeys.crm.deal(id), "withPaymentPlan"] as const,
    person: (id: string) => [...queryKeys.crm.all, "person", id] as const,
    personDeals: (personId: string) =>
      [...queryKeys.crm.all, "person", personId, "deals"] as const,
    paymentPlan: (dealId: string) =>
      [...queryKeys.crm.all, "paymentPlan", dealId] as const,
    lifecycles: () => [...queryKeys.crm.all, "lifecycles"] as const,
  },
  project: {
    all: ["project"] as const,
    projects: () => [...queryKeys.project.all, "projects"] as const,
    project: (id: string) => [...queryKeys.project.all, "project", id] as const,
    units: (projectId: string) =>
      [...queryKeys.project.all, "units", projectId] as const,
    unit: (id: string) => [...queryKeys.project.all, "unit", id] as const,
    unitsAll: () => [...queryKeys.project.all, "units"] as const,
  },
};
