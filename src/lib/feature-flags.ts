/**
 * Client-side feature flags.
 * Use NEXT_PUBLIC_ prefix for flags that affect client rendering.
 *
 * Single env var: NEXT_PUBLIC_SIDEBAR_FEATURES
 * - Unset or empty: all sidebar items and groups are shown.
 * - Set: comma-separated list of enabled feature keys. Only those are shown.
 *
 * Main nav keys: crm, leads, customers, companies, contacts, deals, activities,
 *   lifecycle, analytics, projects, team
 * Group: documents (Belgeler)
 */

const raw = process.env.NEXT_PUBLIC_SIDEBAR_FEATURES?.trim();
const enabledSet =
  raw === undefined || raw === ""
    ? null
    : new Set(raw.split(",").map((part) => part.trim().toLowerCase()).filter(Boolean));

/** Returns true if the sidebar feature is enabled. When env is unset, all are enabled. */
export function isSidebarFeatureEnabled(featureKey: string): boolean {
  if (enabledSet === null) return true;
  return enabledSet.has(featureKey.toLowerCase());
}
