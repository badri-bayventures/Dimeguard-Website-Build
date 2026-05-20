import Image from "next/image";
import { siteConfig } from "@/site.config";
import { Container } from "./container";

/**
 * Bottom-of-page carrier strip. Each cell renders the carrier name as a
 * placeholder; once `logoPath` is set in siteConfig.carriers the image
 * takes over — no code change required.
 */
export function CarrierStrip() {
  const { carrierStrip, carriers } = siteConfig;
  if (!carrierStrip.enabled || carriers.length === 0) return null;
  return (
    <section
      aria-label="Carrier appointments"
      className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]"
    >
      <Container className="py-10 md:py-12">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)] md:text-xs">
          {carrierStrip.eyebrow}
        </p>
        <ul className="mt-6 grid grid-cols-2 items-center gap-3 sm:grid-cols-3 md:mt-8 md:grid-cols-6 md:gap-4">
          {carriers.map((c) => (
            <li
              key={c.name}
              className="flex h-14 items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-white px-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)] md:h-16"
            >
              {c.logoPath ? (
                <Image
                  src={c.logoPath}
                  alt={c.name}
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span>{c.name}</span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
