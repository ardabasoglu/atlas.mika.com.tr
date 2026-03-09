import type { Unit } from "./types";

export const unitTypeLabels: Record<Unit["type"], string> = {
  apartment: "Daire",
  commercial: "Ticari",
  parking: "Otopark",
  other: "Diğer",
};

export const unitStatusLabels: Record<Unit["status"], string> = {
  available: "Müsait",
  reserved: "Rezerve",
  sold: "Satıldı",
};
