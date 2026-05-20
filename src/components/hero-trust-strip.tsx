import { siteConfig } from "@/site.config";
import { Container } from "./container";

/**
 * Four-column strip below the hero. Each cell = large display top line +
 * small descriptor below. Wraps to 2x2 on mobile.
 */
export function HeroTrustStrip() {
  const items = siteConfig.heroTrustStrip;
  if (!items.length) return null;
  return (
    <section
      aria-label="At a glance"
      className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
    >
      <Container className="grid grid-cols-2 gap-8 py-10 md:grid-cols-4 md:gap-6 md:py-12">
        {items.map((item) => (
          <div key={item.top} className="text-left">
            <div
              className="font-[family-name:var(--font-display)] text-2xl font-medium leading-tight text-[color:var(--color-ink)] md:text-3xl"
              style={{ lineHeight: 1.1 }}
            >
              {item.top}
            </div>
            <div className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
              {item.bottom}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
