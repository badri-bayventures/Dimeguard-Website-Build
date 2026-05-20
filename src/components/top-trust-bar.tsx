import { siteConfig } from "@/site.config";
import { Container } from "./container";

/**
 * Thin bar above the primary nav: state licensure on the left, positioning
 * blurb on the right. Both strings live in siteConfig.topTrustBar so the
 * cohort can swap copy without code changes.
 */
export function TopTrustBar() {
  const { topTrustBar } = siteConfig;
  if (!topTrustBar.enabled) return null;
  return (
    <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-ink)] text-white">
      <Container className="flex flex-col items-start justify-between gap-1 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 md:flex-row md:items-center md:text-[11px]">
        <span>{topTrustBar.left}</span>
        <span className="text-[color:var(--color-accent)]/90">
          {topTrustBar.right}
        </span>
      </Container>
    </div>
  );
}
