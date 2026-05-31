const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Format an ISO date string (e.g. "2026-05-31" or "2026-05-31T00:00:00.000Z")
 * as "May 31, 2026" deterministically.
 *
 * We parse the date components directly from the string rather than using
 * `Intl.DateTimeFormat`/`Date` locale methods, whose output depends on the
 * runtime's locale and timezone. That divergence between server and browser
 * caused React hydration mismatches (and a brief flicker) on the blog pages.
 */
export function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  const monthIndex = Number(month) - 1;
  const monthName = MONTHS[monthIndex];
  if (!monthName) return iso;
  return `${monthName} ${Number(day)}, ${year}`;
}
