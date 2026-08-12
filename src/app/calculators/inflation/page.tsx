import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { InflationCalculator } from "@/components/inflation-calculator";

const PATH = "/calculators/inflation";

export const generateMetadata = () => buildMetadata({ path: PATH });

const faqs = [
  {
    q: "What does this calculator actually do?",
    a: "It compounds a single annual inflation rate over the years you choose and shows what today's amount would still buy — and, symmetrically, what today's expenses would cost then.",
  },
  {
    q: "What inflation rate should I use?",
    a: "The default is a middle-of-the-road long-run assumption. Try it higher as well as lower — and remember categories like housing, healthcare, and college have historically run above the headline average.",
  },
  {
    q: "Why does this matter for retirement planning?",
    a: "Because a nest-egg number that looks comfortable in today's dollars buys less every year you hold it. Planning conversations work in real, after-inflation income for exactly this reason.",
  },
  {
    q: "Is this advice?",
    a: "No. It's a directional estimate meant to start a conversation. Nothing here accounts for your actual spending mix, taxes, or how your savings are invested.",
  },
];

export default function InflationCalculatorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Inflation calculator", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Calculator"
        title={<>See what your savings may buy in 10, 20, 30 years.</>}
        lede={
          <>
            Put in an amount, pick a horizon and a rate, and see how inflation
            erodes purchasing power — quick what-if math with every assumption
            on screen.
          </>
        }
        primaryCta={{
          label: siteConfig.ctaLabels.bookCall,
          href: "/book?source=footer",
        }}
      />

      <Section>
        <InflationCalculator />
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Before you read too much into it"
          title="What a number like this can and can't tell you."
          lede="An inflation estimate is a way of asking a better question, not a forecast. These are the limits worth holding in mind."
        />
        <div className="mt-10">
          <Faq items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
        </div>
        <Disclosure className="mt-10" />
      </Section>
    </>
  );
}
