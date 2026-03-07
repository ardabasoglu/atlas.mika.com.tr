/**
 * Default currency code for monetary values (Deal.value, Unit.price, etc.).
 * Use this constant and formatMoney() so multi-currency support only requires
 * adding a currency field to entities and passing it through.
 */
export const DEFAULT_CURRENCY_CODE = "TRY" as const;

/**
 * Formats a numeric amount with the given currency code.
 * Uses DEFAULT_CURRENCY_CODE when currency is omitted.
 */
export function formatMoney(
  amount: number,
  currency?: string | null
): string {
  const code = currency ?? DEFAULT_CURRENCY_CODE;
  return `${amount.toLocaleString()} ${code}`;
}

/**
 * Formats a large amount in compact form (e.g. "1.5k TRY").
 * Uses DEFAULT_CURRENCY_CODE when currency is omitted.
 */
export function formatMoneyCompact(
  amount: number,
  currency?: string | null
): string {
  const code = currency ?? DEFAULT_CURRENCY_CODE;
  return `${(amount / 1000).toFixed(1)}k ${code}`;
}
