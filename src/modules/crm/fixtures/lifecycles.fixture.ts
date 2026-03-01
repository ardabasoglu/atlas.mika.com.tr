import { Lifecycle } from "../types";

const baseStages = [
  { name: "İlk Temas", description: "Potansiyel müşteri ile ilk iletişim aşaması", color: "#94a3b8" },
  { name: "Niteliklendirme", description: "İhtiyaç ve bütçe değerlendirmesi", color: "#60a5fa" },
  { name: "Teklif", description: "Teklif hazırlama ve sunum", color: "#a78bfa" },
  { name: "Müzakere", description: "Fiyat ve koşul görüşmeleri", color: "#f59e0b" },
  { name: "Kapatıldı - Kazanıldı", description: "Anlaşma tamamlandı", color: "#22c55e" },
  { name: "Kapatıldı - Kaybedildi", description: "Fırsat sonlandı", color: "#ef4444" },
];
const colors = ["#94a3b8", "#60a5fa", "#a78bfa", "#f59e0b", "#22c55e", "#ef4444", "#ec4899", "#14b8a6"];

function buildLifecycles(): Lifecycle[] {
  const items: Lifecycle[] = [];
  for (let index = 1; index <= 50; index++) {
    const base = (index - 1) % baseStages.length;
    const stage = baseStages[base];
    items.push({
      id: String(index),
      name: index <= baseStages.length ? stage.name : `${stage.name} ${index}`,
      description: stage.description,
      order: index,
      color: colors[(index - 1) % colors.length],
      createdAt: "2026-02-01",
      updatedAt: "2026-02-01",
    });
  }
  return items;
}

export const lifecycles: Lifecycle[] = buildLifecycles();
