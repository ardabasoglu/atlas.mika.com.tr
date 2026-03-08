import { TimelineEvent, timelineEventArraySchema } from "../types";

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
