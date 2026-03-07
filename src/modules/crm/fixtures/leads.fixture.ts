import { Lead } from "../types";

const baseLeads = [
  { firstName: "Ayşe", lastName: "Yılmaz", source: "website" as const, propertyInterest: "3+1 Daire", status: "new" as const, website: "https://example.com", industry: "Teknoloji", position: "Yatırım Müdürü" },
  { firstName: "Mehmet", lastName: "Kaya", source: "referral" as const, propertyInterest: "Ofis katı", status: "qualified" as const },
  { firstName: "Zeynep", lastName: "Demir", source: "event" as const, propertyInterest: "Çoklu daire", status: "converted" as const },
  { firstName: "Can", lastName: "Öztürk", source: "social" as const, propertyInterest: "Villa", status: "disqualified" as const },
  { firstName: "Elif", lastName: "Arslan", source: "campaign" as const, propertyInterest: "İş yeri", status: "new" as const, website: "https://example.com", industry: "Finans" },
  { firstName: "Burak", lastName: "Yıldız", source: "website" as const, propertyInterest: "Arsa", status: "qualified" as const },
  { firstName: "Selin", lastName: "Korkmaz", source: "referral" as const, propertyInterest: "3+1 Daire", status: "new" as const },
  { firstName: "Emre", lastName: "Çelik", source: "event" as const, propertyInterest: "Ofis katı", status: "qualified" as const, position: "Yatırım Müdürü" },
  { firstName: "Deniz", lastName: "Aydın", source: "social" as const, propertyInterest: "Çoklu daire", status: "converted" as const },
  { firstName: "Ceren", lastName: "Şahin", source: "campaign" as const, propertyInterest: "Villa", status: "disqualified" as const },
];

function buildLeads(): Lead[] {
  return baseLeads.map((lead, index) => ({
    id: String(index + 1),
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: `lead${index + 1}@example.com`,
    phone: `+90-532-${String(100 + index).padStart(3, "0")}-${String(index + 1).padStart(4, "0")}`,
    source: lead.source,
    propertyInterest: lead.propertyInterest,
    status: lead.status,
    ...(lead.website && { website: lead.website }),
    ...(lead.industry && { industry: lead.industry }),
    ...(lead.position && { position: lead.position }),
    createdAt: "2026-02-20",
    updatedAt: "2026-02-20",
  }));
}

export const leads: Lead[] = buildLeads();
