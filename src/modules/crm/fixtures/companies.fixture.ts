import { Company } from "../types";

const baseCompanies = [
  { name: "Acme Şirketi", industry: "Teknoloji", size: "1-10", website: "https://acme.com", address: "100 İş Caddesi", phone: "+1-202-555-1000" },
  { name: "Globex Endüstrileri", industry: "Üretim", size: "11-50", website: "https://globex.com", address: "101 İş Caddesi", phone: "+1-202-555-1001" },
  { name: "Wayne İşletmeleri", industry: "Savunma", size: "51-200", website: "https://wayne.com", address: "102 İş Caddesi", phone: "+1-202-555-1002" },
  { name: "Stark Endüstrileri", industry: "Perakende", size: "201-500", website: "https://stark.com", address: "103 İş Caddesi", phone: "+1-202-555-1003" },
  { name: "Ollivanders", industry: "Finans", size: "501-1000", website: "https://ollivanders.com", address: "104 İş Caddesi", phone: "+1-202-555-1004" },
];

function buildCompanies(): Company[] {
  return baseCompanies.map((company, index) => ({
    id: String(index + 1),
    name: company.name,
    industry: company.industry,
    size: company.size,
    website: company.website,
    address: company.address,
    phone: company.phone,
    createdAt: "2026-01-15",
    updatedAt: "2026-02-10",
  }));
}

export const companies: Company[] = buildCompanies();
