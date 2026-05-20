import type { ReactNode } from "react";
import { Container } from "./container";
import { ButtonLink } from "./button";

type HeroProps = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  meta?: ReactNode;
  aside?: ReactNode;
};

export function Hero({
  eyebrow,
  title,
  lede,
  primaryCta,
  secondaryCta,
  meta,
  aside,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-surface-muted)] pt-16 pb-20 md:pt-24 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-20 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--color-secondary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-[22rem] w-[22rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--color-accent)" }}
      />
      <Container className="relative grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className="mt-4 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-6xl"
            style={{ lineHeight: 1.05 }}
          >
            {title}
          </h1>
          {lede ? (
            <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-ink-soft)] md:text-xl">
              {lede}
            </p>
          ) : null}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {primaryCta ? (
                <ButtonLink size="lg" href={primaryCta.href}>
                  {primaryCta.label}
                </ButtonLink>
              ) : null}
              {secondaryCta ? (
                <ButtonLink size="lg" variant="ghost" href={secondaryCta.href}>
                  {secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          )}
          {meta ? (
            <div className="mt-8 text-sm text-[color:var(--color-muted)]">
              {meta}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div className="md:col-span-5">
            <div className="relative rounded-3xl border border-[color:var(--color-border)] bg-white p-2 shadow-[var(--shadow-card)]">
              {aside}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
