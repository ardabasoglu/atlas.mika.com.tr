import { EventEmitter } from "events";

/**
 * Domain Event Types and Payloads.
 * This acts as the "Contract" between different modules.
 */
export type DomainEventMap = {
  // CRM Events
  "crm:lead-converted": {
    leadId: string;
    personId: string;
    dealId?: string;
    timestamp: string;
  };
  "crm:deal-won": {
    dealId: string;
    personId: string;
    unitId: string;
    value: number;
    timestamp: string;
  };
  "crm:deal-lost": {
    dealId: string;
    unitId?: string;
    timestamp: string;
  };
  "crm:deal-unit-unassigned": {
    dealId: string;
    unitId: string;
    timestamp: string;
  };

  // Project Events
  "project:unit-status-changed": {
    unitId: string;
    projectId: string;
    oldStatus: string;
    newStatus: string;
    timestamp: string;
  };
};

class DomainEventEmitter extends EventEmitter {
  emit<K extends keyof DomainEventMap>(event: K, payload: DomainEventMap[K]): boolean {
    console.log(`[DomainEvent] ${event}:`, payload);
    return super.emit(event, payload);
  }

  on<K extends keyof DomainEventMap>(
    event: K,
    listener: (payload: DomainEventMap[K]) => void
  ): this {
    return super.on(event, listener);
  }
}

// Global singleton for the application
export const domainEvents = new DomainEventEmitter();
