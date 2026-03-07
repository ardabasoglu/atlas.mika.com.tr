import { Lifecycle } from "../types";

const baseStages = [
  { name: "İlk Temas", description: "Potansiyel müşteri ile ilk iletişim aşaması", color: "#94a3b8" },
  { name: "Niteliklendirme", description: "İhtiyaç ve bütçe değerlendirmesi", color: "#60a5fa" },
  { name: "Teklif", description: "Teklif hazırlama ve sunum", color: "#a78bfa" },
  { name: "Müzakere", description: "Fiyat ve koşul görüşmeleri", color: "#f59e0b" },
  { name: "Kapatıldı - Kazanıldı", description: "Anlaşma tamamlandı", color: "#22c55e" },
  { name: "Kapatıldı - Kaybedildi", description: "Fırsat sonlandı", color: "#ef4444" },
];

function buildLifecycles(): Lifecycle[] {
  return baseStages.map((stage, index) => ({
    id: String(index + 1),
    name: stage.name,
    description: stage.description,
    order: index + 1,
    color: stage.color,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  }));
}

export const lifecycles: Lifecycle[] = buildLifecycles();
