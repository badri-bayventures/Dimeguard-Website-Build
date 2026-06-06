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

/**
 * Editorial grouping of canonical topic labels under parent sections. The
 * labels here must match the output of `normalizeTopic` exactly so the live
 * topic list slots into the right section. Topics that aren't listed here fall
 * into a "More topics" group, so nothing is ever hidden.
 *
 * Section order, and topic order within each section, follow this definition.
 */
const TOPIC_SECTIONS: ReadonlyArray<{
  title: string;
  topics: readonly string[];
}> = [
  {
    title: "Protection",
    topics: ["Life insurance", "Insurance", "Employer insurance", "Travel insurance"],
  },
  { title: "Wealth & Investing", topics: ["Building wealth", "Investments"] },
  { title: "Planning", topics: ["Retirement", "Estate planning", "Tax"] },
  {
    title: "Family & legacy",
    topics: [
      "Legacy of love",
      "Future generations",
      "Parenting with purpose",
      "Visiting parents",
      "Financial gift",
    ],
  },
];

const FALLBACK_SECTION_TITLE = "More topics";

export type TopicGroup = { title: string; count: number };

/** Reverse lookup from a canonical topic label to its parent section title. */
const TOPIC_TO_SECTION: ReadonlyMap<string, string> = new Map(
  TOPIC_SECTIONS.flatMap((section) =>
    section.topics.map((topic) => [topic, section.title] as const),
  ),
);

/**
 * Resolve the parent section title for a canonical topic label. Topics that
 * aren't assigned to a defined section fall into the "More topics" group, so
 * every post still belongs to exactly one set of groups.
 */
export function sectionForTopic(topic: string): string {
  return TOPIC_TO_SECTION.get(topic) ?? FALLBACK_SECTION_TITLE;
}

/**
 * Given each post's list of canonical topics, return the ordered group-level
 * filters with a per-group POST count. A post counts once toward a group even
 * if it carries several topics from that group. Groups with no posts are
 * omitted. Section order follows TOPIC_SECTIONS, with the "More topics"
 * fallback last.
 */
export function groupPostCounts(
  postsTopics: ReadonlyArray<ReadonlyArray<string>>,
): TopicGroup[] {
  const counts = new Map<string, number>();
  for (const topics of postsTopics) {
    const groups = new Set<string>();
    for (const topic of topics) groups.add(sectionForTopic(topic));
    for (const group of groups) {
      counts.set(group, (counts.get(group) ?? 0) + 1);
    }
  }

  const ordered: TopicGroup[] = [];
  for (const section of TOPIC_SECTIONS) {
    const count = counts.get(section.title);
    if (count) ordered.push({ title: section.title, count });
  }
  const fallbackCount = counts.get(FALLBACK_SECTION_TITLE);
  if (fallbackCount) {
    ordered.push({ title: FALLBACK_SECTION_TITLE, count: fallbackCount });
  }

  return ordered;
}
