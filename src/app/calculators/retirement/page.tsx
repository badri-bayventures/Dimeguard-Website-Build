import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { RetirementCalculator } from "@/components/retirement-calculator";

const PATH = "/calculators/retirement";

export const generateMetadata = () => buildMetadata({ path: PATH });

const faqs = [
  {
    q: "What does this calculator actually do?",
    a: "It grows your current savings and monthly contributions at a flat annual return until the age you pick, then compares that projected balance against the nest egg your stated retirement spending would need for the number of years you choose.",
  },
  {
    q: "Why is there no inflation or tax adjustment?",
    a: "Because adding them would imply a precision the model doesn't have. A flat-return projection is easy to sanity-check and hard to hide behind. Inflation and tax treatment matter a great deal in practice — they're worth working through against your actual accounts rather than a slider.",
  },
  {
    q: "Is this advice?",
    a: "No. It's a directional estimate meant to start a conversation. Nothing here accounts for your tax situation, your existing coverage, your risk tolerance, or the sequence of returns you'd actually experience.",
  },
  {
    q: "What return should I use?",
    a: "The default is a middle-of-the-road long-run assumption, not a promise. Try it lower as well as higher — if the plan only works at the top of the range, that's useful to know now rather than later.",
  },
];

export default function RetirementCalculatorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Retirement readiness calculator", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Calculator"
        title={<>Are you on track to stop working when you want to?</>}
        lede={
          <>
            Put in what you have, what you&rsquo;re saving, and what you expect
            to spend. The projection updates as you type, and every assumption
            behind it stays on screen where you can change it.
          </>
        }
        primaryCta={{
          label: siteConfig.ctaLabels.bookCall,
          href: "/book?source=calc-retirement",
        }}
      />

      <Section>
        <RetirementCalculator />
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Before you read too much into it"
          title="What a number like this can and can't tell you."
          lede="A projection is a way of asking a better question, not a forecast. These are the limits worth holding in mind."
        />
        <div className="mt-10">
          <Faq items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
        </div>
        <Disclosure className="mt-10" />
      </Section>
    </>
  );
}
