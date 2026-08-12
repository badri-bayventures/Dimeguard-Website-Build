import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button";
import { Disclosure } from "@/components/disclosure";

const PATH = "/calculators";

export const generateMetadata = () => buildMetadata({ path: PATH });

/**
 * Hub copy is deliberately question-first: each card answers "which one is
 * for me?" rather than describing the math. The calculator pages themselves
 * carry the assumptions and FAQ.
 */
const calculators = [
  {
    href: "/calculators/retirement",
    eyebrow: "Retirement readiness",
    title: "Are you on track to stop working when you want to?",
    description:
      "Project what your savings may grow to by your target age, and see it against what your retirement spending would actually need. Every assumption stays on screen.",
    cta: "Run the numbers",
  },
  {
    href: "/calculators/life-value",
    eyebrow: "Life insurance coverage",
    title: "How much coverage would your family actually need?",
    description:
      "Estimate a coverage need from your income, your dependents, and what you already have in place — a starting point for a real conversation, not a quote.",
    cta: "Estimate my coverage",
  },
  {
    href: "/calculators/inflation",
    eyebrow: "Inflation impact",
    title: "What will today's savings actually buy later?",
    description:
      "See how inflation may erode purchasing power over 10, 20, or 30 years. Quick what-if math with the assumption right there on the slider.",
    cta: "See the impact",
  },
];

export default function CalculatorsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Calculators", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Calculators"
        title={<>Run your own numbers. No pressure, no jargon.</>}
        lede={
          <>
            Three planning calculators, each built around a question families
            actually ask. The math is simple on purpose &mdash; every
            assumption stays visible and adjustable, so the number is a
            conversation starter, not a black box.
          </>
        }
        primaryCta={{
          label: siteConfig.ctaLabels.bookCall,
          href: "/book?source=calculators-hub",
        }}
      />

      <Section>
        <SectionHeading
          eyebrow="Pick your question"
          title="Three calculators, three different questions."
          lede="Start with the one closest to what's on your mind — each takes about a minute."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {calculators.map((calc) => (
            <div
              key={calc.href}
              className="flex flex-col rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                {calc.eyebrow}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl text-[color:var(--color-ink)]">
                <Link href={calc.href} className="hover:underline">
                  {calc.title}
                </Link>
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[color:var(--color-muted)]">
                {calc.description}
              </p>
              <ButtonLink href={calc.href} className="mt-6 self-start">
                {calc.cta} <span aria-hidden>&rarr;</span>
              </ButtonLink>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="After the number"
          title="A calculator can't know your situation."
          lede="These tools are directional estimates, not advice. If a number surprises you — in either direction — a 20-minute call is the right next step. Nothing pitched, no obligation."
        />
        <Disclosure className="mt-10" />
      </Section>
    </>
  );
}
