import { domainEvents } from "@/lib/events";
import { updateUnit } from "./services";

/**
 * Initializes listeners for the Project module.
 * This should be imported in the module's index or a bootstrapper.
 */
export function initProjectListeners() {
  // Listen for Won Deals in CRM
  domainEvents.on("crm:deal-won", async (payload) => {
    console.log(`[ProjectListener] Deal ${payload.dealId} won, updating unit ${payload.unitId}`);
    await updateUnit(payload.unitId, {
      status: "sold",
      dealId: payload.dealId,
      personId: payload.personId,
    });
  });

  // Listen for Lost Deals in CRM (to release units)
  domainEvents.on("crm:deal-lost", async (payload) => {
    if (payload.unitId) {
      console.log(`[ProjectListener] Deal ${payload.dealId} lost, releasing unit ${payload.unitId}`);
      await updateUnit(payload.unitId, {
        status: "available",
        dealId: null,
        personId: null,
      });
    }
  });

  // Listen for Unit Unassignment (when a unit is removed from a deal or replaced)
  domainEvents.on("crm:deal-unit-unassigned", async (payload) => {
    console.log(`[ProjectListener] Unit ${payload.unitId} unassigned from deal ${payload.dealId}`);
    await updateUnit(payload.unitId, {
      status: "available",
      dealId: null,
      personId: null,
    });
  });
}
