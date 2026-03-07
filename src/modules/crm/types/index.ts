export type Lead = {
  id: string;
  name: string;
  phone?: string;
  email: string;
  source?: string;
  status: "new" | "contacted" | "qualified" | "lost" | "converted";
  /** Lifecycle stage id; when set, status is derived or kept in sync. */
  lifecycleId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Person = {
  id: string;
  leadId?: string;
  name: string;
  phone?: string;
  email: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Deal = {
  id: string;
  personId: string;
  unitId?: string;
  title: string;
  value: number;
  /** ISO 4217 currency code (e.g. TRY). Omit for default. */
  currency?: string;
  stage:
    | "inquiry"
    | "meeting"
    | "offer"
    | "negotiation"
    | "won"
    | "lost";
  /** Lifecycle stage id; when set, stage is derived or kept in sync. */
  lifecycleId?: string;
  expectedCloseDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type TimelineEvent = {
  id: string;

  entityType: "lead" | "person" | "deal";
  entityId: string;

  type:
    | "note"
    | "call"
    | "meeting"
    | "email"
    | "status_change"
    | "deal_created"
    | "deal_stage_changed";

  title?: string;
  description?: string;

  metadata?: Record<string, unknown>;

  createdBy?: string;
  createdAt: string;
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
