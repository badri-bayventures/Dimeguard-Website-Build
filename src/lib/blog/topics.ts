/**
 * Notion `Tags` are author-entered free text, so they arrive inconsistent:
 * leading hashes, mixed casing, no spacing, and the occasional typo
 * (e.g. "#lifeinsurance", "#LegayOfLove", "#BuildingWealth", "#estateplanning").
 *
 * We normalize each raw tag to a single clean, visitor-facing label that is
 * ALSO used as the canonical filter value. Because both the topic chips and
 * the `?topic=` matching go through `normalizeTopic`, near-duplicate tags
 * collapse into one topic and the filter keeps working. The author can keep
 * tagging freely in Notion.
 */

/**
 * Alias map keyed by the "fold" of a raw tag (lowercased, alphanumerics only).
 * Use this to collapse near-duplicates and fix known typos into a clean set of
 * visitor-facing topics. Extend as new tag variants show up in Notion.
 */
const TOPIC_ALIASES: Record<string, string> = {
  lifeinsurance: "Life insurance",
  life: "Life insurance",
  insurance: "Insurance",
  termlife: "Life insurance",
  wholelife: "Life insurance",
  retirement: "Retirement",
  retirementplanning: "Retirement",
  estate: "Estate planning",
  estateplanning: "Estate planning",
  legacyoflove: "Legacy of love",
  legayoflove: "Legacy of love",
  buildingwealth: "Building wealth",
  wealth: "Building wealth",
  investment: "Investments",
  investments: "Investments",
  investing: "Investments",
  mutualfunds: "Investments",
  stocks: "Investments",
  shares: "Investments",
  tax: "Tax",
  taxes: "Tax",
  taxplanning: "Tax",
};

function fold(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Turn a stripped tag into a readable sentence-case label. */
function humanize(stripped: string): string {
  const spaced = stripped
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
  if (!spaced) return stripped.trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

/**
 * Normalize a raw Notion tag into a clean, canonical topic label. The returned
 * value is what we both display AND filter on, so equal inputs always map to
 * the same output.
 */
export function normalizeTopic(raw: string): string {
  const stripped = raw.replace(/^#+/, "").trim();
  if (!stripped) return "";
  const key = fold(stripped);
  if (key && TOPIC_ALIASES[key]) return TOPIC_ALIASES[key];
  return humanize(stripped);
}

/**
 * Normalize a list of raw tags into a de-duplicated list of clean topics,
 * preserving first-seen order. Empty results are dropped.
 */
export function normalizeTopics(raw: string[] | undefined): string[] {
  if (!raw || !raw.length) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of raw) {
    const label = normalizeTopic(tag);
    if (!label || seen.has(label)) continue;
    seen.add(label);
    out.push(label);
  }
  return out;
}
