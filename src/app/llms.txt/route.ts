import { siteConfig, absoluteUrl } from "@/site.config";

/**
 * llms.txt — speculative AEO bet. Lists the site name, a one-line summary,
 * canonical URLs of the indexable routes with short summaries, and a pointer
 * to the sitemap.
 *
 * Generated from siteConfig.routes so this file stays in sync as routes are
 * added or renamed — no hand maintenance.
 */
export function GET() {
  const indexable = siteConfig.routes.filter((r) => r.showInLlms !== false);
  const lines: string[] = [];

  lines.push(`# ${siteConfig.business.legalName}`);
  lines.push(siteConfig.business.tagline);
  lines.push("");
  lines.push(
    `Founder: ${siteConfig.advisor.fullName} — ${siteConfig.advisor.title}.`,
  );
  lines.push(
    `Based in ${siteConfig.nap.addressLocality}, ${siteConfig.nap.addressRegion}. ${siteConfig.licensure.disclosure}`,
  );
  lines.push("");
  lines.push("## Pages");
  for (const r of indexable) {
    lines.push(`- [${r.title}](${absoluteUrl(r.path)}): ${r.llmsSummary}`);
  }
  lines.push("");
  lines.push("## Sitemap");
  lines.push(absoluteUrl("/sitemap.xml"));
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
