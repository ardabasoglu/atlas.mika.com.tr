export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  companyName?: string;
  website?: string;
  industry?: string;
  source?: string;
  propertyInterest?: string;
  status: "new" | "qualified" | "converted" | "disqualified";
  convertedAt?: string;
  convertedCompanyId?: string;
  convertedContactId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  status: "active" | "inactive" | "prospect";
  createdAt: string;
  updatedAt: string;
  address?: string;
  website?: string;
};

export type Company = {
  id: string;
  name: string;
  industry?: string;
  size?: string; // e.g., '1-10', '11-50', '51-200'
  website?: string;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  customerId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
};

export type Deal = {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage:
    | "prospecting"
    | "qualification"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  probability: number; // 0-100 percentage
  customerId: string;
  contactId: string;
  companyId: string;
  closeDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  type: "call" | "meeting" | "email" | "task" | "note";
  subject: string;
  description?: string;
  date: string;
  duration?: number; // in minutes
  customerId: string;
  contactId: string;
  dealId?: string;
  assignedTo: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Lifecycle = {
  id: string;
  name: string;
  description?: string;
  order: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
};

export type Team = {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};
