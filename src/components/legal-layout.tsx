import type { ReactNode } from "react";
import { Container } from "./container";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

type LegalLayoutProps = {
  eyebrow?: string;
  title: string;
  effectiveDate: string;
  /** Short plain-language summary shown in the header summary strip. */
  summary: ReactNode;
  /** Lead paragraph(s) shown above the first numbered section. */
  intro: ReactNode;
  sections: LegalSection[];
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Shared rich layout for legal pages (Privacy, Terms). Renders an enriched
 * header with an effective-date badge, an at-a-glance section index that
 * sticks on desktop and stacks on mobile, and numbered per-section blocks.
 * Pages supply their sections; highlight callouts and CTAs live inside each
 * section body via <LegalCallout> / <LegalContactCta>.
 */
export function LegalLayout({
  eyebrow = "Legal",
  title,
  effectiveDate,
  summary,
  intro,
  sections,
}: LegalLayoutProps) {
  return (
    <>
      <section className="bg-[color:var(--color-surface-muted)] pt-20 pb-12 md:pt-28 md:pb-16">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
            {eyebrow}
          </p>
          <h1
            className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-6xl"
            style={{ lineHeight: 1.05 }}
          >
            {title}
          </h1>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-[color:var(--color-accent)]"
              />
              <span className="font-medium text-[color:var(--color-ink)]">
                Effective {effectiveDate}
              </span>
            </span>
            <p className="max-w-xl text-sm leading-relaxed text-[color:var(--color-muted)]">
              {summary}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <nav
              aria-label="On this page"
              className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
            >
              <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                  On this page
                </p>
                <ol className="mt-4 space-y-1">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="group flex items-baseline gap-3 rounded-lg px-2 py-1.5 -mx-2 text-sm text-[color:var(--color-ink-soft)] transition-colors hover:bg-white hover:text-[color:var(--color-ink)]"
                      >
                        <span className="font-[family-name:var(--font-display)] text-sm tabular-nums text-[color:var(--color-secondary)]">
                          {pad(i + 1)}
                        </span>
                        <span className="leading-snug">{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <div className="lg:col-span-8">
              <div className="max-w-2xl text-lg leading-relaxed text-[color:var(--color-ink-soft)]">
                {intro}
              </div>

              <div className="mt-12 space-y-12">
                {sections.map((s, i) => (
                  <section
                    key={s.id}
                    id={s.id}
                    className="scroll-mt-28 border-t border-[color:var(--color-border)] pt-12 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-[family-name:var(--font-display)] text-2xl font-medium tabular-nums text-[color:var(--color-secondary)]">
                        {pad(i + 1)}
                      </span>
                      <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-3xl">
                        {s.title}
                      </h2>
                    </div>
                    <div className="mt-4 max-w-2xl space-y-4 leading-relaxed text-[color:var(--color-ink-soft)]">
                      {s.body}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/**
 * Emphasized highlight block for a key legal statement (e.g. "We do not sell
 * your personal information"). Uses the brand accent as a left rule on a muted
 * surface — accent is never used for body text.
 */
export function LegalCallout({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="my-6 rounded-2xl border border-[color:var(--color-border)] border-l-4 border-l-[color:var(--color-accent)] bg-[color:var(--color-surface-muted)] p-6">
      <p className="font-[family-name:var(--font-display)] text-lg font-medium leading-snug text-[color:var(--color-ink)]">
        {title}
      </p>
      {children ? (
        <p className="mt-2 text-[color:var(--color-ink-soft)]">{children}</p>
      ) : null}
    </div>
  );
}

/**
 * Styled call-to-action that closes the "Contact us" section, replacing the
 * inline underlined link.
 */
export function LegalContactCta({
  children,
  ctaLabel,
  href = "/contact",
}: {
  children: ReactNode;
  ctaLabel: string;
  href?: string;
}) {
  return (
    <div className="mt-2 rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] sm:flex sm:items-center sm:justify-between sm:gap-6">
      <p className="text-[color:var(--color-ink-soft)]">{children}</p>
      <a
        href={href}
        className="mt-4 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--color-ink)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-ink-soft)] sm:mt-0"
      >
        {ctaLabel}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
