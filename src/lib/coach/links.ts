// Internal link validation for LLM-generated recommendations. Only allow
// safe, known internal paths — never arbitrary javascript: or external URLs
// from the model.

const ALLOWED_PREFIXES = [
  "/learn",
  "/practice",
  "/mistakes",
  "/vocabulary",
  "/plan",
  "/mock",
  "/library",
  "/settings",
  "/coach",
];

export function isAllowedInternalHref(href: string | undefined | null): boolean {
  if (!href) return false;
  const h = href.trim().toLowerCase();
  if (!h.startsWith("/")) return false;
  if (h.startsWith("//")) return false;
  if (h.includes("javascript:")) return false;
  if (h.includes("data:")) return false;
  return ALLOWED_PREFIXES.some((p) => h === p || h.startsWith(`${p}/`));
}

// Sanitize an action proposal from the model before rendering/persisting.
export function sanitizeActionHref(href: string | undefined | null): string | null {
  return isAllowedInternalHref(href) ? (href as string) : null;
}
