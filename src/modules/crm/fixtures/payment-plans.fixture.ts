import { PaymentPlan, paymentPlanArraySchema } from "../types";

const DEAL_PREFIX = "deal-";

/** Payment plans for first two deals: deal-1 and deal-2. */
const paymentPlansData: PaymentPlan[] = [
  {
    id: "payment-plan-1",
    dealId: `${DEAL_PREFIX}1`,
    downPaymentAmount: 500_000,
    installmentCount: 24,
    installmentAmount: 98_000,
    balloonAmount: 0,
    balloonDueMonth: null,
    createdAt: "2026-01-20",
    updatedAt: "2026-02-10",
  },
  {
    id: "payment-plan-2",
    dealId: `${DEAL_PREFIX}2`,
    downPaymentAmount: 30_000,
    installmentCount: 12,
    installmentAmount: 7_500,
    balloonAmount: 0,
    balloonDueMonth: null,
    createdAt: "2026-01-21",
    updatedAt: "2026-02-10",
  },
];

export const paymentPlans: PaymentPlan[] =
  paymentPlanArraySchema.parse(paymentPlansData);
