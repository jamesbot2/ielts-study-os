// Date helpers that respect the learner's local calendar date, avoiding
// UTC off-by-one issues from `new Date("YYYY-MM-DD")`.

// Parse a date-only ISO string ("YYYY-MM-DD") as a LOCAL calendar date.
export function parseLocalDate(dateOnly: string): Date {
  const [y, m, d] = dateOnly.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

// Whole local days from today until the target date (negative if past).
export function daysUntil(dateOnly: string | null): number | null {
  if (!dateOnly) return null;
  const target = parseLocalDate(dateOnly);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((startOfTarget.getTime() - startOfToday.getTime()) / 86_400_000);
}

// Local date in "YYYY-MM-DD" for a date offset by N days from today.
export function localDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
