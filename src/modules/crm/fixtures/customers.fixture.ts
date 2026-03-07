import { Customer } from "../types";

const baseCustomers = [
  { name: "Acme Şirketi", email: "contact@acme.com", phone: "+1-202-555-2000", status: "active" as const, address: "100 İş Caddesi", website: "https://acme.com" },
  { name: "Globex Endüstrileri", email: "contact@globex.com", phone: "+1-202-555-2001", status: "prospect" as const, address: "101 İş Caddesi", website: "https://globex.com" },
  { name: "Wayne İşletmeleri", email: "contact@wayne.com", phone: "+1-202-555-2002", status: "active" as const, address: "102 İş Caddesi", website: "https://wayne.com" },
  { name: "Stark Endüstrileri", email: "contact@stark.com", phone: "+1-202-555-2003", status: "inactive" as const, address: "103 İş Caddesi", website: "https://stark.com" },
  { name: "Ollivander Asa Dükkânı", email: "contact@ollivanders.com", phone: "+1-202-555-2004", status: "active" as const, address: "104 İş Caddesi", website: "https://ollivanders.com" },
];

function buildCustomers(): Customer[] {
  return baseCustomers.map((customer, index) => ({
    id: String(index + 1),
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    address: customer.address,
    website: customer.website,
    createdAt: "2026-01-15",
    updatedAt: "2026-02-10",
  }));
}

export const customers: Customer[] = buildCustomers();
