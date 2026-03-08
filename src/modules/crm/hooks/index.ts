export { useEntityTable, TABLE_PAGE_SIZE } from "./use-entity-table";
export type { UseEntityTableOptions, UseEntityTableReturn } from "./use-entity-table";
export {
  useDeals,
  useDeal,
  useDealWithUnit,
  useDealWithPaymentPlan,
  usePerson,
  usePersonDeals,
  usePaymentPlan,
  useLifecycles,
} from "./use-crm-queries";
export {
  useUpdateDeal,
  useSavePaymentPlan,
  useConvertLead,
} from "./use-crm-mutations";
export type {
  UpdateDealPayload,
  SavePaymentPlanData,
} from "./use-crm-mutations";
