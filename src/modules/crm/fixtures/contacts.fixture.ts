import { Contact } from "../types";

const baseContacts = [
  { firstName: "Mehmet", lastName: "Yılmaz", position: "Genel Müdür", customerIndex: 0 },
  { firstName: "Ayşe", lastName: "Kaya", position: "Teknoloji Müdürü", customerIndex: 1 },
  { firstName: "Ali", lastName: "Demir", position: "Satış Müdürü", customerIndex: 2 },
  { firstName: "Zeynep", lastName: "Öztürk", position: "Pazarlama Müdürü", customerIndex: 3 },
  { firstName: "Can", lastName: "Arslan", position: "Finans Müdürü", customerIndex: 4 },
  { firstName: "Elif", lastName: "Yıldız", position: "Operasyon Müdürü", customerIndex: 0 },
  { firstName: "Burak", lastName: "Korkmaz", position: "Müdür", customerIndex: 1 },
  { firstName: "Selin", lastName: "Çelik", position: "Takım Lideri", customerIndex: 2 },
  { firstName: "Emre", lastName: "Aydın", position: "Genel Müdür", customerIndex: 3 },
  { firstName: "Deniz", lastName: "Şahin", position: "Teknoloji Müdürü", customerIndex: 4 },
];

function buildContacts(): Contact[] {
  return baseContacts.map((contact, index) => {
    const customerId = String(contact.customerIndex + 1);
    const email = `${contact.firstName.toLowerCase()}.${contact.lastName.toLowerCase()}@example.com`;
    return {
      id: String(index + 1),
      firstName: contact.firstName,
      lastName: contact.lastName,
      email,
      phone: `+1-202-555-${String(3000 + index).slice(-4)}`,
      position: contact.position,
      customerId,
      createdAt: "2026-01-15",
      updatedAt: "2026-02-10",
    };
  });
}

export const contacts: Contact[] = buildContacts();
