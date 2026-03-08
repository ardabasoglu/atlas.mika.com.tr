import {
  Deal,
  dealArraySchema,
  Lead,
  leadArraySchema,
  Lifecycle,
  lifecycleArraySchema,
  PaymentPlan,
  paymentPlanArraySchema,
  Person,
  personArraySchema,
  Team,
  teamArraySchema,
  TimelineEvent,
  timelineEventArraySchema,
} from "./types";

// --- Persons ---

const PERSON_PREFIX = "person-";

const basePersons: Array<{
  name: string;
  email: string;
  phone?: string;
  leadId?: string;
  notes?: string;
}> = [
  { name: "Ahmet Yılmaz", email: "ahmet.yilmaz@example.com", phone: "+90-532-200-1000", notes: "3+1 daire alıcısı" },
  { name: "Fatma Kaya", email: "fatma.kaya@example.com", phone: "+90-532-200-1001", leadId: "lead-2", notes: "Referans ile geldi" },
  { name: "Mustafa Özkan", email: "mustafa.ozkan@example.com", phone: "+90-532-200-1002" },
  { name: "Hatice Demir", email: "hatice.demir@example.com", phone: "+90-532-200-1003", notes: "Etkinlik" },
  { name: "Ali Çetin", email: "ali.cetin@example.com", phone: "+90-532-200-1004" },
];

function buildPersons(): Person[] {
  return basePersons.map((person, index) => ({
    id: `${PERSON_PREFIX}${index + 1}`,
    name: person.name,
    email: person.email,
    phone: person.phone,
    leadId: person.leadId,
    notes: person.notes,
    createdAt: "2026-01-15",
    updatedAt: "2026-02-10",
  }));
}

export const persons: Person[] = personArraySchema.parse(buildPersons());

// --- Leads ---

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

// --- Deals ---

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

export const deals: Deal[] = dealArraySchema.parse(buildDeals());

// --- Timeline Events ---

const EVENT_PREFIX = "activity-";

const baseEvents: Array<{
  entityType: TimelineEvent["entityType"];
  entityId: string;
  type: TimelineEvent["type"];
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}> = [
  {
    entityType: "person",
    entityId: "person-1",
    type: "call",
    title: "İlk Danışma",
    description: "Daire talebi hakkında görüşme",
    createdAt: "2026-02-01",
  },
  {
    entityType: "person",
    entityId: "person-2",
    type: "meeting",
    title: "Proje Sunumu",
    description: "Ofis katı ve fiyat teklifi sunumu",
    createdAt: "2026-02-02",
  },
  {
    entityType: "person",
    entityId: "person-3",
    type: "email",
    title: "Takip",
    description: "Rezidans birim detayları ve sorularına yanıt",
    createdAt: "2026-02-03",
  },
  {
    entityType: "person",
    entityId: "person-4",
    type: "note",
    title: "Villa Projesi",
    description: "Keşif ve talep notları",
    createdAt: "2026-02-04",
  },
  {
    entityType: "person",
    entityId: "person-5",
    type: "note",
    title: "Sözleşme Müzakere",
    description: "Satış sözleşmesi maddeleri",
    createdAt: "2026-02-05",
  },
  {
    entityType: "person",
    entityId: "person-1",
    type: "call",
    title: "İlgi Düzeyi",
    description: "Alıcı niyeti değerlendirme görüşmesi",
    createdAt: "2026-02-06",
  },
  {
    entityType: "person",
    entityId: "person-2",
    type: "meeting",
    title: "Teslimat Görüşmesi",
    description: "Anahtar teslimi planlaması",
    createdAt: "2026-02-07",
  },
  {
    entityType: "person",
    entityId: "person-3",
    type: "email",
    title: "Fiyat Teklifi",
    description: "Güncel liste fiyatları ve kampanya",
    createdAt: "2026-02-08",
  },
  {
    entityType: "person",
    entityId: "person-4",
    type: "call",
    title: "Proje Bilgilendirme",
    description: "Villa projesi başlangıç bilgisi",
    createdAt: "2026-02-09",
  },
  {
    entityType: "lead",
    entityId: "lead-1",
    type: "note",
    title: "Lead created",
    description: "Durum Güncellemesi - Haftalık satış durum notları",
    createdAt: "2026-02-10",
  },
  {
    entityType: "deal",
    entityId: "deal-3",
    type: "deal_stage_changed",
    title: "Aşama değişti",
    metadata: { from: "inquiry", to: "offer" },
    createdAt: "2026-02-11",
  },
  {
    entityType: "person",
    entityId: "person-1",
    type: "deal_created",
    title: "Fırsat oluşturuldu",
    description: "Bahçeşehir 3+1 Daire Satışı",
    createdAt: "2026-01-20",
  },
];

function buildTimelineEvents(): TimelineEvent[] {
  return baseEvents.map((event, index) => ({
    id: `${EVENT_PREFIX}${index + 1}`,
    entityType: event.entityType,
    entityId: event.entityId,
    type: event.type,
    title: event.title,
    description: event.description,
    metadata: event.metadata,
    createdAt: event.createdAt,
  }));
}

export const timelineEvents: TimelineEvent[] =
  timelineEventArraySchema.parse(buildTimelineEvents());

// --- Lifecycles ---

const baseStages = [
  { name: "İlk Temas", description: "Potansiyel müşteri ile ilk iletişim aşaması", color: "#94a3b8" },
  { name: "Niteliklendirme", description: "İhtiyaç ve bütçe değerlendirmesi", color: "#60a5fa" },
  { name: "Teklif", description: "Teklif hazırlama ve sunum", color: "#a78bfa" },
  { name: "Müzakere", description: "Fiyat ve koşul görüşmeleri", color: "#f59e0b" },
  { name: "Kapatıldı - Kazanıldı", description: "Anlaşma tamamlandı", color: "#22c55e" },
  { name: "Kapatıldı - Kaybedildi", description: "Fırsat sonlandı", color: "#ef4444" },
];

const LIFECYCLE_PREFIX = "lifecycle-";

function buildLifecycles(): Lifecycle[] {
  return baseStages.map((stage, index) => ({
    id: `${LIFECYCLE_PREFIX}${index + 1}`,
    name: stage.name,
    description: stage.description,
    order: index + 1,
    color: stage.color,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  }));
}

export const lifecycles: Lifecycle[] =
  lifecycleArraySchema.parse(buildLifecycles());

// --- Teams ---

const baseTeams = [
  { name: "Elif Arslan", role: "Satış Müdürü", phone: "+90-531-1000001" },
  { name: "Burak Yıldız", role: "Satış Danışmanı", phone: "+90-532-1000002" },
  { name: "Selin Korkmaz", role: "Müşteri İlişkileri", phone: "+90-533-1000003" },
  { name: "Emre Çelik", role: "Pazarlama", phone: "+90-534-1000004" },
  { name: "Deniz Aydın", role: "Teknik Destek", phone: "+90-535-1000005" },
  { name: "Ceren Şahin", role: "Satış Danışmanı", phone: "+90-536-1000006" },
  { name: "Ali Veli", role: "Satış Müdürü", phone: "+90-537-1000007" },
  { name: "Fatma Kaya", role: "Müşteri İlişkileri", phone: "+90-538-1000008" },
  { name: "Merve Demir", role: "Pazarlama", phone: "+90-539-1000009" },
  { name: "Kaan Öz", role: "Teknik Destek", phone: "+90-530-1000010" },
];

const TEAM_PREFIX = "team-";

function buildTeams(): Team[] {
  return baseTeams.map((member, index) => {
    const slug = member.name.toLowerCase().replace(/\s+/g, ".");
    return {
      id: `${TEAM_PREFIX}${index + 1}`,
      name: member.name,
      email: `${slug}@mika.com.tr`,
      role: member.role,
      phone: member.phone,
      createdAt: "2026-02-01",
      updatedAt: "2026-02-20",
    };
  });
}

export const teams: Team[] = teamArraySchema.parse(buildTeams());

// --- Payment Plans ---

/** Payment plans for first two deals: deal-1 and deal-2. */
const paymentPlansData: PaymentPlan[] = [
  {
    id: "payment-plan-1",
    dealId: `${DEAL_PREFIX}1`,
    downPaymentAmount: 500_000,
    installmentCount: 24,
    installmentAmount: 98_000,
    balloonAmount: 0,
    balloonDueMonth: null,
    createdAt: "2026-01-20",
    updatedAt: "2026-02-10",
  },
  {
    id: "payment-plan-2",
    dealId: `${DEAL_PREFIX}2`,
    downPaymentAmount: 30_000,
    installmentCount: 12,
    installmentAmount: 7_500,
    balloonAmount: 0,
    balloonDueMonth: null,
    createdAt: "2026-01-21",
    updatedAt: "2026-02-10",
  },
];

export const paymentPlans: PaymentPlan[] =
  paymentPlanArraySchema.parse(paymentPlansData);
