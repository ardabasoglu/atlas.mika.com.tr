import { Contact } from "../types";

const firstNames = ["John", "Jane", "Robert", "Emily", "Bruce", "Tony", "Hermione", "Alice", "Bob", "Carol"];
const lastNames = ["Doe", "Smith", "Johnson", "Davis", "Wayne", "Stark", "Granger", "Brown", "Wilson", "Taylor"];
const positions = ["CEO", "CTO", "Sales Director", "Marketing Manager", "CFO", "COO", "Manager", "Lead"];

function buildContacts(): Contact[] {
  const items: Contact[] = [];
  for (let index = 1; index <= 50; index++) {
    const companyId = String((index % 5) + 1);
    const customerId = String((index % 5) + 1);
    items.push({
      id: String(index),
      firstName: firstNames[(index - 1) % firstNames.length],
      lastName: lastNames[(index - 1) % lastNames.length],
      email: `contact${index}@company${companyId}.com`,
      phone: `+1-202-555-${String(1000 + index).slice(-4)}`,
      position: positions[(index - 1) % positions.length],
      customerId,
      companyId,
      createdAt: "2026-01-15",
      updatedAt: "2026-02-10",
    });
  }
  return items;
}

export const contacts: Contact[] = buildContacts();
