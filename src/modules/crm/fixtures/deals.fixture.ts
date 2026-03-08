import { Deal } from "../types";

const DEAL_PREFIX = "deal-";

/** Maps deal stage to lifecycle id (lifecycle-1..6: İlk Temas, Niteliklendirme, Teklif, Müzakere, Kazanıldı, Kaybedildi). */
const stageToLifecycleId: Record<Deal["stage"], string> = {
  inquiry: "lifecycle-1",
  meeting: "lifecycle-2",
  offer: "lifecycle-3",
  negotiation: "lifecycle-4",
  won: "lifecycle-5",
  lost: "lifecycle-6",
};

const baseDeals: Array<{
  title: string;
  stage: Deal["stage"];
  value: number;
  personId: string;
  unitId?: string;
  expectedCloseDate?: string;
}> = [
  { title: "Bahçeşehir 3+1 Daire Satışı", stage: "inquiry", value: 2852000, personId: "person-1", unitId: "unit-2", expectedCloseDate: "2026-03-31" },
  { title: "Levent Ofis Katı Kiralama", stage: "meeting", value: 120000, personId: "person-2", unitId: "unit-7", expectedCloseDate: "2026-04-15" },
  { title: "Kartal Rezidans 2+1 Satışı", stage: "offer", value: 1950000, personId: "person-3", unitId: "unit-8", expectedCloseDate: "2026-03-20" },
  { title: "Beylikdüzü Villa Projesi", stage: "negotiation", value: 8500000, personId: "person-4", unitId: "unit-11", expectedCloseDate: "2026-05-01" },
  { title: "Ataşehir 4+1 Daire Satışı", stage: "won", value: 4200000, personId: "person-5", unitId: "unit-3", expectedCloseDate: "2026-02-28" },
  { title: "Kadıköy Arsa Ortaklığı", stage: "lost", value: 12000000, personId: "person-1" },
  { title: "Şişli İş Merkezi Kat Satışı", stage: "inquiry", value: 6500000, personId: "person-2", expectedCloseDate: "2026-04-30" },
  { title: "Çekmeköy Konut Projesi 3+1", stage: "meeting", value: 3100000, personId: "person-3", unitId: "unit-9", expectedCloseDate: "2026-03-15" },
];

function buildDeals(): Deal[] {
  return baseDeals.map((deal, index) => ({
    id: `${DEAL_PREFIX}${index + 1}`,
    title: deal.title,
    value: deal.value,
    stage: deal.stage,
    lifecycleId: stageToLifecycleId[deal.stage],
    personId: deal.personId,
    unitId: deal.unitId,
    expectedCloseDate: deal.expectedCloseDate,
    createdAt: "2026-01-20",
    updatedAt: "2026-02-10",
  }));
}

export const deals: Deal[] = buildDeals();
