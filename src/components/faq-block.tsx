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
    <dl className="divide-y divide-[color:var(--color-border)] rounded-2xl border border-[color:var(--color-border)] bg-white">
      {items.map((item, i) => (
        <div key={i} className="px-6 py-6 md:px-8 md:py-7">
          <dt>
            <HeadingTag className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight text-[color:var(--color-ink)]">
              {item.question}
            </HeadingTag>
          </dt>
          <dd className="mt-3 leading-relaxed text-[color:var(--color-ink-soft)]">
            {item.answer}
          </dd>
        </div>
      ))}
    </dl>
  );
}
