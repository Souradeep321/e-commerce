// lib/admin/format.ts

/**
 * Analytics values (AnalyticsOverview, chart points) are already in
 * rupees, NOT paise — per the type's own comment: "already divided
 * from paise". Do NOT run these through lib/format.ts's formatPaise —
 * that expects raw paise and would divide by 100 a second time,
 * silently showing amounts 100x too small (e.g. ₹2,849 instead of
 * ₹2,84,900). This mirrors formatPaise's exact display style (manual
 * ₹ prefix + en-IN locale grouping) so numbers look consistent across
 * the storefront and admin — it's just skipping the /100 step.
 */
export function formatINR(amountInRupees: number): string {
  return `₹${amountInRupees.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

// Compact form for stat cards — Indian grouping (Crore/Lakh), not
// Western K/M, matching the app's India-first formatting elsewhere.
export function formatINRCompact(amountInRupees: number): string {
  const abs = Math.abs(amountInRupees);
  if (abs >= 1_00_00_000) return `₹${(amountInRupees / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `₹${(amountInRupees / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `₹${(amountInRupees / 1_000).toFixed(1)}K`;
  return `₹${amountInRupees}`;
}

// Deliberately day+month only (no year) — denser than lib/format.ts's
// formatDate for tight admin table rows, matching the mockup's "Aug 31"
// style. Swap for the shared formatDate if app-wide date consistency
// matters more than table density here.
export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}