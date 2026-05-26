import type { ReactNode } from "react";
import { Container } from "./container";
import { ButtonLink } from "./button";

type HeroProps = {
  badge?: { label: string };
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  meta?: ReactNode;
  aside?: ReactNode;
};

export function Hero({
  badge,
  eyebrow,
  title,
  lede,
  primaryCta,
  secondaryCta,
  meta,
  aside,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-surface-muted)] pt-12 pb-16 md:pt-20 md:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M32 0H0v32' fill='none' stroke='rgb(228,223,210)' stroke-width='1'/></svg>\")",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0) 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0) 85%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-20 z-10 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--color-secondary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 z-10 h-[22rem] w-[22rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--color-accent)" }}
      />
      <Container
        className={`relative z-20 ${aside ? "grid items-center gap-10 md:grid-cols-5 md:gap-12" : ""}`}
      >
        <div className={aside ? "md:col-span-3" : "max-w-3xl"}>
          {badge ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)] shadow-sm">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full bg-[color:var(--color-accent)] ring-2 ring-[color:var(--color-accent)]/30"
              />
              {badge.label}
            </span>
          ) : null}
          {eyebrow ? (
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)] ${badge ? "mt-4" : ""}`}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={`font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-6xl ${badge || eyebrow ? "mt-4" : ""}`}
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
        {aside ? <div className="md:col-span-2">{aside}</div> : null}
      </Container>
    </section>
  );
}
