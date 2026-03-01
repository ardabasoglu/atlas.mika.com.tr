import { Team } from "../types";

const names = ["Elif Arslan", "Burak Yıldız", "Selin Korkmaz", "Emre Çelik", "Deniz Aydın", "Ceren Şahin", "Ali Veli", "Fatma Kaya", "Merve Demir", "Kaan Öz"];
const roles = ["Satış Müdürü", "Satış Danışmanı", "Müşteri İlişkileri", "Pazarlama", "Teknik Destek"];

function buildTeams(): Team[] {
  const items: Team[] = [];
  for (let index = 1; index <= 50; index++) {
    const name = index <= names.length ? names[index - 1] : `Ekip Üyesi ${index}`;
    const slug = name.toLowerCase().replace(/\s+/g, ".");
    items.push({
      id: String(index),
      name,
      email: `${slug}@mika.com.tr`,
      role: roles[(index - 1) % roles.length],
      ...(index % 3 !== 0 && { phone: `+90-53${index}-${String(1000000 + index).slice(-7)}` }),
      createdAt: "2026-02-01",
      updatedAt: "2026-02-20",
    });
  }
  return items;
}

export const teams: Team[] = buildTeams();
