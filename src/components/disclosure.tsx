import { siteConfig } from "@/site.config";

/**
 * Small print that must appear on every page rendering calculators or
 * planning content. Pulls from siteConfig.licensure so updating the disclosure
 * text or licensed states is a one-file change.
 */
export function Disclosure({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-xs leading-relaxed text-[color:var(--color-muted)] ${className}`.trim()}
    >
      {/* Neutral firm phrasing — Saral's personal presence is hidden for now.
          Original: `{siteConfig.advisor.fullName} is a licensed insurance
          agent.` Restore that when reinstating Saral's public profile. */}
      {siteConfig.business.legalName} is licensed in California, serving clients
      across the nation. {siteConfig.licensure.insuranceOnlyDisclosure}
    </p>
  );
}
