import { Deal } from "../types";

const titles = [
  "Enterprise Software License",
  "Consulting Services Contract",
  "Security System Upgrade",
  "AI Research Partnership",
  "Wand Customization Service",
  "Cloud Migration",
  "Support Agreement",
  "Training Package",
];
const stages: Deal["stage"][] = [
  "prospecting",
  "qualification",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
];

function buildDeals(): Deal[] {
  const items: Deal[] = [];
  for (let index = 1; index <= 50; index++) {
    const stage = stages[(index - 1) % stages.length];
    const probability =
      stage === "closed-won" ? 100 : stage === "closed-lost" ? 0 : 20 + (index % 80);
    items.push({
      id: String(index),
      title: `${titles[(index - 1) % titles.length]} #${index}`,
      value: (index * 5000 + 10000) % 500000,
      currency: "USD",
      stage,
      probability,
      customerId: String((index % 5) + 1),
      contactId: String((index % 7) + 1),
      companyId: String((index % 5) + 1),
      closeDate: "2026-03-31",
      createdAt: "2026-01-20",
      updatedAt: "2026-02-10",
    });
  }
  return items;
}

export const deals: Deal[] = buildDeals();
