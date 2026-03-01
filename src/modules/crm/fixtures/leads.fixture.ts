import { Lead } from "../types";

const firstNames = ["Ayşe", "Mehmet", "Zeynep", "Can", "Elif", "Burak", "Selin", "Emre", "Deniz", "Ceren"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Öztürk", "Arslan", "Yıldız", "Korkmaz", "Çelik", "Aydın", "Şahin"];
const sources = ["website", "referral", "event", "social", "campaign"];
const interests = ["3+1 Daire", "Ofis katı", "Çoklu daire", "Villa", "İş yeri", "Arsa"];
const statuses: Lead["status"][] = ["new", "qualified", "converted", "disqualified"];

function buildLeads(): Lead[] {
  const items: Lead[] = [];
  for (let index = 1; index <= 50; index++) {
    items.push({
      id: String(index),
      firstName: firstNames[(index - 1) % firstNames.length],
      lastName: lastNames[(index - 1) % lastNames.length],
      email: `lead${index}@example.com`,
      phone: `+90-532-${String(100 + index).padStart(3, "0")}-${String(index).padStart(4, "0")}`,
      source: sources[(index - 1) % sources.length],
      propertyInterest: interests[(index - 1) % interests.length],
      status: statuses[(index - 1) % statuses.length],
      ...(index % 3 === 0 && {
        companyName: `Company ${index}`,
        website: `https://company${index}.com`,
        industry: "Technology",
      }),
      ...(index % 4 === 0 && { position: "Yatırım Müdürü" }),
      createdAt: "2026-02-20",
      updatedAt: "2026-02-20",
    });
  }
  return items;
}

export const leads: Lead[] = buildLeads();
