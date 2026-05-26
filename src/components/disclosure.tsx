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
      {siteConfig.advisor.fullName} is a licensed insurance broker.{" "}
      {siteConfig.licensure.insuranceOnlyDisclosure}
    </p>
  );
}
