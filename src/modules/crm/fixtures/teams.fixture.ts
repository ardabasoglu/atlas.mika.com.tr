import { Team, teamArraySchema } from "../types";

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
