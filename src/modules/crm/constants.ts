import type { TimelineEvent } from "./types";

export const EVENT_TYPE_LABELS: Record<TimelineEvent["type"], string> = {
  note: "Not",
  call: "Arama",
  meeting: "Toplantı",
  email: "E-posta",
  status_change: "Durum değişikliği",
  deal_created: "Fırsat oluşturuldu",
  deal_stage_changed: "Aşama değişti",
};
