import { Deal } from "../types";

const baseDeals = [
  { title: "Kurumsal Yazılım Lisansı", stage: "prospecting" as const, value: 50000, probability: 25 },
  { title: "Danışmanlık Hizmetleri Sözleşmesi", stage: "qualification" as const, value: 120000, probability: 40 },
  { title: "Güvenlik Sistemi Yükseltmesi", stage: "proposal" as const, value: 85000, probability: 60 },
  { title: "Yapay Zeka Araştırma Ortaklığı", stage: "negotiation" as const, value: 250000, probability: 75 },
  { title: "Asa Özelleştirme Hizmeti", stage: "closed-won" as const, value: 45000, probability: 100 },
  { title: "Bulut Geçişi", stage: "closed-lost" as const, value: 180000, probability: 0 },
  { title: "Destek Sözleşmesi", stage: "prospecting" as const, value: 32000, probability: 20 },
  { title: "Eğitim Paketi", stage: "qualification" as const, value: 28000, probability: 50 },
];

function buildDeals(): Deal[] {
  return baseDeals.map((deal, index) => ({
    id: String(index + 1),
    title: deal.title,
    value: deal.value,
    currency: "TRY",
    stage: deal.stage,
    probability: deal.probability,
    customerId: String((index % 5) + 1),
    contactId: String((index % 5) + 1),
    companyId: String((index % 5) + 1),
    closeDate: "2026-03-31",
    createdAt: "2026-01-20",
    updatedAt: "2026-02-10",
  }));
}

export const deals: Deal[] = buildDeals();
