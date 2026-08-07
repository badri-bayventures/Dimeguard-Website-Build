import { siteConfig } from "@/site.config";

/**
 * Per-state content for the multi-state initial pages (M3 scope).
 * `slug` must match a `/states/<slug>` entry in `siteConfig.routes` — the
 * route map drives sitemap/llms/metadata; this module drives page copy.
 * Thin by design: deepen per-state as local signals (GBP, referrals) mature.
 */
export type StatePage = {
  slug: string;
  /** Two-letter code — must match an entry in licensure.licensedStates. */
  code: string;
  name: string;
  /** True only for the home state (CA). */
  isHomeState: boolean;
  /** One-line hero lede fragment specific to the state. */
  lede: string;
  /** Short paragraph on how the engagement works for this state. */
  howItWorks: string;
};

export const statePages: StatePage[] = [
  {
    slug: "california",
    code: "CA",
    name: "California",
    isHomeState: true,
    lede: "Home base. An independent practice in the Central Valley, working with families across the Tri-Valley and Bay Area — and licensed statewide.",
    howItWorks:
      "California is where this practice lives. Most first calls happen over video either way, and for families in the Central Valley, Tri-Valley, or Bay Area, meeting in person is an easy option. Everything runs on the same shape: a 20-minute first call, no script, nothing pitched.",
  },
  {
    slug: "texas",
    code: "TX",
    name: "Texas",
    isHomeState: false,
    lede: "Licensed in Texas, working with families remotely — the same slow conversations, over video.",
    howItWorks:
      "Working together from Texas looks exactly like working together from down the street: a 20-minute first video call, documents shared securely, and policies placed with carriers licensed in Texas. Distance changes the meeting format, not the care.",
  },
  {
    slug: "colorado",
    code: "CO",
    name: "Colorado",
    isHomeState: false,
    lede: "Licensed in Colorado, working with families remotely — the same slow conversations, over video.",
    howItWorks:
      "Working together from Colorado looks exactly like working together from down the street: a 20-minute first video call, documents shared securely, and policies placed with carriers licensed in Colorado. Distance changes the meeting format, not the care.",
  },
  {
    slug: "new-jersey",
    code: "NJ",
    name: "New Jersey",
    isHomeState: false,
    lede: "Licensed in New Jersey, working with families remotely — the same slow conversations, over video.",
    howItWorks:
      "Working together from New Jersey looks exactly like working together from down the street: a 20-minute first video call, documents shared securely, and policies placed with carriers licensed in New Jersey. Distance changes the meeting format, not the care.",
  },
];

export function getStatePage(slug: string): StatePage | undefined {
  return statePages.find((s) => s.slug === slug);
}

/** Sanity link between this module and the licensure config. */
export function isLicensedState(code: string): boolean {
  return siteConfig.licensure.licensedStates.some((s) => s.code === code);
}
