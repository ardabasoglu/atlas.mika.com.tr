import { Customer } from "../types";

const names = [
  "Acme Corporation",
  "Globex Industries",
  "Wayne Enterprises",
  "Stark Industries",
  "Ollivander's Wand Shop",
];
const statuses: Customer["status"][] = ["active", "inactive", "prospect"];

function buildCustomers(): Customer[] {
  const items: Customer[] = [];
  for (let index = 1; index <= 50; index++) {
    const base = (index - 1) % names.length;
    items.push({
      id: String(index),
      name: index <= names.length ? names[base] : `${names[base]} ${index}`,
      email: `contact${index}@customer.com`,
      phone: `+1-202-555-${String(1000 + index).slice(-4)}`,
      company: names[base],
      status: statuses[(index - 1) % statuses.length],
      createdAt: "2026-01-15",
      updatedAt: "2026-02-10",
      address: `${100 + index} Business Ave`,
      website: `https://customer${index}.com`,
    });
  }
  return items;
}

export const customers: Customer[] = buildCustomers();
