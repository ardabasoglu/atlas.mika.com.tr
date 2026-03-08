import { Person, personArraySchema } from "../types";

const PERSON_PREFIX = "person-";

const basePersons: Array<{
  name: string;
  email: string;
  phone?: string;
  leadId?: string;
  notes?: string;
}> = [
  { name: "Ahmet Yılmaz", email: "ahmet.yilmaz@example.com", phone: "+90-532-200-1000", notes: "3+1 daire alıcısı" },
  { name: "Fatma Kaya", email: "fatma.kaya@example.com", phone: "+90-532-200-1001", leadId: "lead-2", notes: "Referans ile geldi" },
  { name: "Mustafa Özkan", email: "mustafa.ozkan@example.com", phone: "+90-532-200-1002" },
  { name: "Hatice Demir", email: "hatice.demir@example.com", phone: "+90-532-200-1003", notes: "Etkinlik" },
  { name: "Ali Çetin", email: "ali.cetin@example.com", phone: "+90-532-200-1004" },
];

function buildPersons(): Person[] {
  return basePersons.map((person, index) => ({
    id: `${PERSON_PREFIX}${index + 1}`,
    name: person.name,
    email: person.email,
    phone: person.phone,
    leadId: person.leadId,
    notes: person.notes,
    createdAt: "2026-01-15",
    updatedAt: "2026-02-10",
  }));
}

export const persons: Person[] = personArraySchema.parse(buildPersons());
