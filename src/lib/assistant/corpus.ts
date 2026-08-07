import { siteConfig, SITE_URL } from "@/site.config";
import { statePages } from "@/lib/states";

/**
 * Knowledge corpus for the site assistant — a single stuffed string, NOT a
 * vector store. The site is small; the whole corpus rides in the (cached)
 * system prompt.
 *
 * Rules:
 * - BYTE-STABLE: never interpolate timestamps, request IDs, or anything
 *   per-request here, or the prompt cache never hits.
 * - Contact facts appear exactly once, sourced from siteConfig so a config
 *   change (e.g. the phone swap) propagates automatically.
 * - Deliberately EXCLUDED: the hidden About block / any personal detail
 *   about the founder beyond his professional role, and the held service
 *   pages (annuities, tax-planning, estate-planning) which are not yet
 *   released from the staggered hold.
 * - Blog entries are hand-written titles + one-line summaries (the Notion
 *   pipeline is not touched at build time — per the assistant spec).
 */

const routeSummary = (path: string): string => {
  const r = siteConfig.routes.find((x) => x.path === path);
  return r ? r.description : "";
};

export const CORPUS: string = `
## Who Dimeguard is

${siteConfig.business.legalName} (${siteConfig.business.domain}) — ${siteConfig.business.tagline}
An independent, multi-carrier insurance and retirement planning practice based in ${siteConfig.nap.addressLocality}, ${siteConfig.nap.addressRegion}, working with first-generation families in their 40s and 50s. The practice is insurance-licensed (not an investment adviser). ${siteConfig.licensure.disclosure} ${siteConfig.licensure.insuranceOnlyDisclosure}
Licensed states: ${siteConfig.licensure.licensedStates.map((s) => s.name).join(", ")}. CA Insurance License #${siteConfig.licensure.licenseNumber}.
The practice is independent — not tied to one carrier. Recommendations are placed with carriers licensed in the client's state.
The first call is 20 minutes: no script, no sales pitch, nothing pitched, no obligation.

## Contact (canonical facts — give these when handing off)

Phone: ${siteConfig.nap.phone}
Email: ${siteConfig.nap.email}
Book a call: ${SITE_URL}/book (20-minute intro call${siteConfig.contact.calendlyUrl ? ", scheduled online" : ""})
Contact page: ${SITE_URL}/contact — ${routeSummary("/contact")}
Hours: Monday-Friday 9:00-18:00, Saturday 9:00-13:00 (Pacific).
Areas served in person: ${siteConfig.nap.areaServed.join(", ")}; everywhere else in the licensed states by video.

## Services

### Retirement planning (${SITE_URL}/retirement-planning)
${routeSummary("/retirement-planning")}

### Life & disability insurance (${SITE_URL}/life-insurance)
${routeSummary("/life-insurance")}

### 401(k) rollovers (${SITE_URL}/401k-rollovers)
${routeSummary("/401k-rollovers")}

## Calculators (free tools on the site)

### Retirement readiness calculator (${SITE_URL}/calculators/retirement)
${routeSummary("/calculators/retirement")}

### Life insurance coverage calculator (${SITE_URL}/calculators/life-value)
${routeSummary("/calculators/life-value")}

### Inflation calculator (${SITE_URL}/calculators/inflation)
${routeSummary("/calculators/inflation")}

## Resources (${SITE_URL}/resources)
${routeSummary("/resources")}
Two free files: a net worth tracker (quarterly snapshots of assets, liabilities, net worth) and a monthly budget (planned vs actual). Both are CSVs that open in Excel, Google Sheets, or Numbers. A name and email unlocks the downloads.

## States served

${statePages
  .map((s) => `### ${s.name} (${SITE_URL}/states/${s.slug})\n${s.lede}`)
  .join("\n\n")}

## Blog (${SITE_URL}/blog)
${routeSummary("/blog")}
Recent posts:
- "Cash-value life insurance, explained without the sales pitch" — what cash-value life insurance actually is, who it tends to fit, and the trade-offs that rarely make it into a 30-minute pitch. (${SITE_URL}/blog/cash-value-life-insurance)
- "Your employer life insurance is probably not enough — here's how to check" — group life through work is a useful baseline, but for most families with dependents it falls short on three predictable axes. (${SITE_URL}/blog/my-employer-sponsored-life-insurance-is-sufficient-are-you-sure)

## How working together goes

1. Book a 20-minute first call (${SITE_URL}/book). It's a relaxed conversation — where you stand today, the gaps worth paying attention to, what your options look like. No script, no products pitched, no obligation.
2. If it makes sense to continue, the next conversations go deeper on retirement, insurance, and tax coordination for your situation.
3. Nothing is placed until you decide. As an independent agency, options come from multiple carriers.
`.trim();
