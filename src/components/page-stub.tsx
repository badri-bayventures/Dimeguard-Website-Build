import type { ReactNode } from "react";
import { Container } from "./container";
import { ButtonLink } from "./button";
import { Disclosure } from "./disclosure";

/**
 * Placeholder shell for routes whose full content lands in a later step.
 * Keeps the route discoverable (real metadata + JSON-LD shipped from the
 * page that mounts the stub) while signaling clearly that content is in
 * flight. Remove the stub usage once the real page lands.
 */
export function PageStub({
  eyebrow,
  title,
  lede,
  arrivingIn,
  children,
  ctaHref = "/",
  ctaLabel = "Back to home",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  arrivingIn?: string;
  children?: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <>
      <section className="bg-[color:var(--color-surface-muted)] pt-20 pb-16 md:pt-28 md:pb-20">
        <Container>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-6xl"
            style={{ lineHeight: 1.05 }}
          >
            {title}
          </h1>
          {lede ? (
            <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-ink-soft)] md:text-xl">
              {lede}
            </p>
          ) : null}
          {arrivingIn ? (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-3 py-1.5 text-xs text-[color:var(--color-muted)]">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]"
              />
              {arrivingIn}
            </div>
          ) : null}
        </Container>
      </section>
      {children ? (
        <section className="py-16 md:py-20">
          <Container>{children}</Container>
        </section>
      ) : null}
      <section className="pb-20">
        <Container>
          <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
        </Container>
      </section>
      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
          <Disclosure />
        </div>
      </div>
    </>
  );
}
