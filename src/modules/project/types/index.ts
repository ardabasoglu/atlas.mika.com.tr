export type Project = {
  id: string;
  name: string;
  description?: string;
  address?: string;
  status: "planning" | "construction" | "completed" | "on_hold";
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type Unit = {
  id: string;
  projectId: string;
  code: string;
  type: "apartment" | "commercial" | "parking" | "other";
  sizeSqm: number;
  price?: number;
  /** ISO 4217 currency code (e.g. TRY). Omit for default. */
  currency?: string;
  status: "available" | "reserved" | "sold";
  floor?: number;
  dealId?: string;
  personId?: string;
  createdAt: string;
  updatedAt: string;
};
