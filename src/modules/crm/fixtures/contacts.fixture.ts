import { Contact } from "../types";

const baseContacts = [
  { firstName: "Mehmet", lastName: "Yılmaz", position: "Genel Müdür", companyIndex: 0, customerIndex: 0 },
  { firstName: "Ayşe", lastName: "Kaya", position: "Teknoloji Müdürü", companyIndex: 1, customerIndex: 1 },
  { firstName: "Ali", lastName: "Demir", position: "Satış Müdürü", companyIndex: 2, customerIndex: 2 },
  { firstName: "Zeynep", lastName: "Öztürk", position: "Pazarlama Müdürü", companyIndex: 3, customerIndex: 3 },
  { firstName: "Can", lastName: "Arslan", position: "Finans Müdürü", companyIndex: 4, customerIndex: 4 },
  { firstName: "Elif", lastName: "Yıldız", position: "Operasyon Müdürü", companyIndex: 0, customerIndex: 0 },
  { firstName: "Burak", lastName: "Korkmaz", position: "Müdür", companyIndex: 1, customerIndex: 1 },
  { firstName: "Selin", lastName: "Çelik", position: "Takım Lideri", companyIndex: 2, customerIndex: 2 },
  { firstName: "Emre", lastName: "Aydın", position: "Genel Müdür", companyIndex: 3, customerIndex: 3 },
  { firstName: "Deniz", lastName: "Şahin", position: "Teknoloji Müdürü", companyIndex: 4, customerIndex: 4 },
];

function buildContacts(): Contact[] {
  return baseContacts.map((contact, index) => {
    const companyId = String(contact.companyIndex + 1);
    const customerId = String(contact.customerIndex + 1);
    const email = `${contact.firstName.toLowerCase()}.${contact.lastName.toLowerCase()}@company${companyId}.com`;
    return {
      id: String(index + 1),
      firstName: contact.firstName,
      lastName: contact.lastName,
      email,
      phone: `+1-202-555-${String(3000 + index).slice(-4)}`,
      position: contact.position,
      customerId,
      companyId,
      createdAt: "2026-01-15",
      updatedAt: "2026-02-10",
    };
  });
}

export const contacts: Contact[] = buildContacts();
