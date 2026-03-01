import { Company } from "../types";

const names = [
  "Acme Corporation",
  "Globex Industries",
  "Wayne Enterprises",
  "Stark Industries",
  "Ollivanders",
];
const industries = ["Technology", "Manufacturing", "Defense", "Retail", "Finance"];
const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

function buildCompanies(): Company[] {
  const items: Company[] = [];
  for (let index = 1; index <= 50; index++) {
    const base = (index - 1) % names.length;
    items.push({
      id: String(index),
      name: index <= names.length ? names[base] : `${names[base]} ${index}`,
      industry: industries[(index - 1) % industries.length],
      size: sizes[(index - 1) % sizes.length],
      website: `https://company${index}.com`,
      address: `${100 + index} Business Ave`,
      phone: `+1-202-555-${String(1000 + index).slice(-4)}`,
      createdAt: "2026-01-15",
      updatedAt: "2026-02-10",
    });
  }
  return items;
}

export const companies: Company[] = buildCompanies();
