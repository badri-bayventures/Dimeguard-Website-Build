import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { LifeValueCalculator } from "@/components/life-value-calculator";

const PATH = "/calculators/life-value";

export const generateMetadata = () => buildMetadata({ path: PATH });

const faqs = [
  {
    q: "What does this calculator actually do?",
    a: "It multiplies your annual income by a chosen number of years of income replacement, adds one further year of income per dependent, and compares that total against the life insurance you already have in place.",
  },
  {
    q: "Why an income multiple instead of a detailed needs analysis?",
    a: "Because a simple, visible formula is easy to sanity-check and hard to hide behind. A full needs analysis — debts, college costs, a surviving partner's income, final expenses — matters a great deal in practice, and it's worth working through against your actual situation rather than a form.",
  },
  {
    q: "Does employer coverage count?",
    a: "Include it in the coverage field if you like, but remember most employer coverage ends when the job does and is often capped at one or two times salary. Many families treat it as a supplement rather than the foundation.",
  },
  {
    q: "Is this advice?",
    a: "No. It's a directional estimate meant to start a conversation. Nothing here accounts for your health, budget, policy type, or how the proceeds would actually be used.",
  },
];

export default function LifeValueCalculatorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Life insurance coverage calculator", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Calculator"
        title={<>How much coverage would your family actually need?</>}
        lede={
          <>
            Put in your income, who depends on it, and the coverage you already
            have. The estimate updates as you type, and every assumption behind
            it stays on screen where you can change it.
          </>
        }
        primaryCta={{
          label: siteConfig.ctaLabels.bookCall,
          href: "/book?source=life",
        }}
      />

      <Section>
        <LifeValueCalculator />
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Before you read too much into it"
          title="What a number like this can and can't tell you."
          lede="A coverage estimate is a way of asking a better question, not a quote. These are the limits worth holding in mind."
        />
        <div className="mt-10">
          <Faq items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
        </div>
        <Disclosure className="mt-10" />
      </Section>
    </>
  );
}
