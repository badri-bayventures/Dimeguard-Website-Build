import { ButtonLink } from "./button";
import { siteConfig } from "@/site.config";

/**
 * End-of-post call-to-action box. Copy is fixed across all posts to match the
 * "What to do next" guardrail in the AEO rewrite rules — keeps voice
 * consistent between Notion- and MDX-sourced posts.
 */
export function BlogEndCta() {
  const href = "/book?source=footer";
  return (
    <aside className="not-prose mt-12 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
        What to do next
      </p>
      <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-3xl">
        Want to talk through this for your situation?
      </p>
      <p className="mt-2 text-[color:var(--color-muted)]">
        The first call is twenty minutes — no script, no sales pitch.
      </p>
      <div className="mt-5">
        <ButtonLink href={href}>
          {siteConfig.ctaLabels.bookCall} →
        </ButtonLink>
      </div>
    </aside>
  );
}
