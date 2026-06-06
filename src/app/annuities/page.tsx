import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { financialService, breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";

const PATH = "/annuities";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function AnnuitiesPage() {
  const bookCallHref = siteConfig.contact.calendlyUrl || "/contact";

  const types = [
    {
      title: "Fixed annuities",
      body: "A guaranteed interest rate for a set term — the simplest, most predictable type.",
    },
    {
      title: "Fixed-indexed annuities",
      body: "Growth tied to a market index with a floor, so a down year doesn't reduce your principal — in exchange for a cap on the upside.",
    },
    {
      title: "Income annuities",
      body: "Turn a lump sum into a stream of payments — for life or a set period — to cover essential expenses.",
    },
    {
      title: "Where they don't fit",
      body: "Annuities aren't for everyone. We're explicit about the fees, surrender periods, and trade-offs before anything is put in place.",
    },
  ];

  return (
    <>
      <JsonLd
        data={financialService(siteConfig, {
          serviceType: "Annuities and retirement income",
          path: PATH,
          description:
            "How annuities can turn part of a nest egg into predictable income — the main types, what the guarantees actually mean, and where they fit (and don't) in a retirement plan.",
        })}
        id="ld-financialservice"
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Annuities & retirement income", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Annuities & retirement income"
        title={<>Turning savings into a paycheck.</>}
        lede={
          <>
            For some families, guaranteeing part of their retirement income
            brings real peace of mind. We&rsquo;ll explain the main types of
            annuities in plain language — including the trade-offs — so you can
            decide if one belongs in your plan.
          </>
        }
        primaryCta={{ label: siteConfig.ctaLabels.bookCall, href: bookCallHref }}
        secondaryCta={{ label: "The main types →", href: "#types" }}
      />

      <Section id="types" tone="surface">
        <SectionHeading
          eyebrow="The main types"
          title="What the guarantees actually mean."
          lede="An annuity is a contract with an insurance carrier. The guarantees are real, but so are the costs — we walk through both."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {types.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl font-medium text-[color:var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-[color:var(--color-ink-soft)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Questions" title="Common annuity questions." />
        <div className="mt-10">
          <Faq
            items={[
              {
                question: "Aren't annuities expensive?",
                answer:
                  "Some are, some aren't. Costs vary widely by type and carrier. We name the fees and surrender terms up front, and only consider one if it genuinely fits your plan.",
              },
              {
                question: "Do I have to annuitize my whole nest egg?",
                answer:
                  "No. Most families who use an annuity cover only their essential expenses with it, keeping the rest invested elsewhere for flexibility.",
              },
              {
                question: "How are you paid?",
                answer:
                  "I'm an insurance-only agent. Compensation comes from the carrier when you place a policy — there's no separate planning or advisory fee.",
              },
            ]}
          />
        </div>
      </Section>

      <Section tone="ink">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <SectionHeading
              eyebrow="Ready when you are"
              title="Find out whether guaranteed income belongs in your plan."
              lede="No pressure, no jargon — just a clear look at the trade-offs."
              inverted
            />
          </div>
          <div className="md:col-span-4 md:text-right">
            <ButtonLink size="lg" href={bookCallHref}>
              {siteConfig.ctaLabels.bookCall}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
          <Disclosure />
        </div>
      </div>
    </>
  );
}
