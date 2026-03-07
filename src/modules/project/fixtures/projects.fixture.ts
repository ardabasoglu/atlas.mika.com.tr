import { Project } from "../types";

const PROJECT_PREFIX = "project-";

const baseProjects: Array<{
  name: string;
  description?: string;
  address?: string;
  status: Project["status"];
  startDate?: string;
  endDate?: string;
}> = [
  {
    name: "Bahçeşehir Konut Projesi",
    description: "Modern konut projesi, 120 daire",
    address: "Bahçeşehir 2. Kısım, İstanbul",
    status: "construction",
    startDate: "2024-06-01",
    endDate: "2026-12-31",
  },
  {
    name: "Levent İş Merkezi",
    description: "A sınıfı ofis ve ticari alanlar",
    address: "Levent, Beşiktaş, İstanbul",
    status: "completed",
    startDate: "2022-01-15",
    endDate: "2024-03-01",
  },
  {
    name: "Kartal Sahil Rezidans",
    description: "Deniz manzaralı rezidans",
    address: "Kartal Sahil, İstanbul",
    status: "construction",
    startDate: "2025-02-01",
    endDate: "2027-06-30",
  },
  {
    name: "Beylikdüzü Villa Projesi",
    description: "Lüks villa ve müstakil konutlar",
    address: "Beylikdüzü, İstanbul",
    status: "planning",
    startDate: "2026-01-01",
  },
  {
    name: "Ataşehir Karma Proje",
    description: "Konut ve ticari karma kullanım",
    address: "Ataşehir, İstanbul",
    status: "on_hold",
    startDate: "2023-09-01",
    endDate: "2025-12-31",
  },
];

function buildProjects(): Project[] {
  return baseProjects.map((project, index) => ({
    id: `${PROJECT_PREFIX}${index + 1}`,
    name: project.name,
    description: project.description,
    address: project.address,
    status: project.status,
    startDate: project.startDate,
    endDate: project.endDate,
    createdAt: "2025-01-10",
    updatedAt: "2026-02-15",
  }));
}

export const projects: Project[] = buildProjects();
