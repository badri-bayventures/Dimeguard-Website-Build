import type { ReactNode } from "react";

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

type FaqBlockProps = {
  items: FaqItem[];
  /**
   * Heading level for each question. Defaults to h3 so that on a page where the
   * surrounding section already has an h2, the FAQ entries stay in document
   * order. AEO requires question-as-heading with answer in the next paragraph.
   */
  headingAs?: "h2" | "h3";
};

export function FaqBlock({ items, headingAs = "h3" }: FaqBlockProps) {
  const HeadingTag = headingAs;
  return (
    <div className="divide-y divide-[color:var(--color-border)] rounded-2xl border border-[color:var(--color-border)] bg-white">
      {items.map((item, i) => (
        <details
          key={i}
          open={i === 0}
          className="group px-6 py-5 md:px-8 md:py-6 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
            <HeadingTag className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight text-[color:var(--color-ink)]">
              {item.question}
            </HeadingTag>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="mt-1.5 h-4 w-4 flex-shrink-0 text-[color:var(--color-ink-soft)] transition-transform duration-200 group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 7.5l5 5 5-5" />
            </svg>
          </summary>
          <div className="mt-3 leading-relaxed text-[color:var(--color-ink-soft)]">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
