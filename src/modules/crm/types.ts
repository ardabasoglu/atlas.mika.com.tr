export type {
  Lead,
  Person,
  Deal,
  PaymentPlan,
  TimelineEvent,
  Lifecycle,
  LeadSource,
  Team,
} from "./schemas";
export {
  leadSchema,
  personSchema,
  dealSchema,
  paymentPlanSchema,
  timelineEventSchema,
  lifecycleSchema,
  leadSourceSchema,
  teamSchema,
  leadArraySchema,
  personArraySchema,
  dealArraySchema,
  paymentPlanArraySchema,
  timelineEventArraySchema,
  lifecycleArraySchema,
  leadSourceArraySchema,
  teamArraySchema,
} from "./schemas";
import type { PaymentPlan } from "./schemas";

/** Sum of plan: downPaymentAmount + installmentCount * installmentAmount + balloonAmount */
export function getPaymentPlanTotal(plan: PaymentPlan): number {
  return (
    plan.downPaymentAmount +
    plan.installmentCount * plan.installmentAmount +
    plan.balloonAmount
  );
}
