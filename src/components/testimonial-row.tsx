import type { ReactNode } from "react";

/**
 * TestimonialRow renders qualitative quotes from clients or partners.
 *
 * Copy rules apply: no outcome-implying testimonials (e.g. "Saral made me
 * $X"). Use process-oriented quotes (e.g. "He explained our options clearly")
 * so we stay compliant with insurance-broker advertising rules.
 */
export type Testimonial = {
  quote: ReactNode;
  attribution: string;
  meta?: string;
};

type TestimonialRowProps = {
  items: Testimonial[];
};

export function TestimonialRow({ items }: TestimonialRowProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((t, i) => (
        <figure
          key={i}
          className="flex h-full flex-col rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
        >
          <blockquote className="font-[family-name:var(--font-display)] text-lg leading-snug text-[color:var(--color-ink)]">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-5 border-t border-[color:var(--color-border)] pt-4 text-sm">
            <span className="font-medium text-[color:var(--color-ink)]">
              {t.attribution}
            </span>
            {t.meta ? (
              <span className="text-[color:var(--color-muted)]"> · {t.meta}</span>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
