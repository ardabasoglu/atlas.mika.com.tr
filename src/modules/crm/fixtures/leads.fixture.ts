import { Lead, leadArraySchema } from "../types";

/** Maps lead status to lifecycle id (lifecycle-1..6: İlk Temas, Niteliklendirme, Teklif, Müzakere, Kazanıldı, Kaybedildi). */
const statusToLifecycleId: Record<Lead["status"], string> = {
  new: "lifecycle-1",
  contacted: "lifecycle-1",
  qualified: "lifecycle-2",
  converted: "lifecycle-5",
  lost: "lifecycle-6",
};

const baseLeads: Array<{
  name: string;
  email: string;
  phone: string;
  source: string;
  status: Lead["status"];
  notes?: string;
}> = [
  { name: "Ayşe Yılmaz", email: "lead1@example.com", phone: "+90-532-100-0001", source: "website", status: "new", notes: "3+1 Daire ilgisi" },
  { name: "Mehmet Kaya", email: "lead2@example.com", phone: "+90-532-100-0002", source: "referral", status: "qualified", notes: "Ofis katı" },
  { name: "Zeynep Demir", email: "lead3@example.com", phone: "+90-532-100-0003", source: "event", status: "converted", notes: "Çoklu daire" },
  { name: "Can Öztürk", email: "lead4@example.com", phone: "+90-532-100-0004", source: "social", status: "lost", notes: "Villa" },
  { name: "Elif Arslan", email: "lead5@example.com", phone: "+90-532-100-0005", source: "campaign", status: "new", notes: "İş yeri" },
  { name: "Burak Yıldız", email: "lead6@example.com", phone: "+90-532-100-0006", source: "website", status: "contacted", notes: "Arsa" },
  { name: "Selin Korkmaz", email: "lead7@example.com", phone: "+90-532-100-0007", source: "referral", status: "new", notes: "3+1 Daire" },
  { name: "Emre Çelik", email: "lead8@example.com", phone: "+90-532-100-0008", source: "event", status: "qualified", notes: "Ofis katı" },
  { name: "Deniz Aydın", email: "lead9@example.com", phone: "+90-532-100-0009", source: "social", status: "converted" },
  { name: "Ceren Şahin", email: "lead10@example.com", phone: "+90-532-100-0010", source: "campaign", status: "lost", notes: "Villa" },
];

const LEAD_PREFIX = "lead-";

function buildLeads(): Lead[] {
  return baseLeads.map((lead, index) => ({
    id: `${LEAD_PREFIX}${index + 1}`,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    status: lead.status,
    lifecycleId: statusToLifecycleId[lead.status],
    notes: lead.notes,
    createdAt: "2026-02-20",
    updatedAt: "2026-02-20",
  }));
}

export const leads: Lead[] = leadArraySchema.parse(buildLeads());
