import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { financialService, breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";

const PATH = "/tax-planning";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function TaxPlanningPage() {
  const bookCallHref = siteConfig.contact.calendlyUrl || "/contact";

  const buckets = [
    {
      title: "Taxable",
      body: "Brokerage and savings — taxed as you go, but the most flexible to access at any age.",
    },
    {
      title: "Tax-deferred",
      body: "401(k) and traditional IRA — you defer tax now and pay it on withdrawal in retirement.",
    },
    {
      title: "Tax-free",
      body: "Roth accounts and certain life insurance cash value — funded with after-tax dollars, with tax-advantaged growth.",
    },
    {
      title: "Sequencing withdrawals",
      body: "Which bucket you draw from first can change your lifetime tax bill. We coordinate this with your CPA.",
    },
  ];

  return (
    <>
      <JsonLd
        data={financialService(siteConfig, {
          serviceType: "Tax-efficient planning",
          path: PATH,
          description:
            "Coordinating the tax buckets — taxable, tax-deferred, and tax-free — so withdrawals in retirement are sequenced with the tax bill in mind. Not tax advice; coordination with your CPA.",
        })}
        id="ld-financialservice"
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Tax-efficient planning", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Tax-efficient planning"
        title={<>The order you withdraw matters.</>}
        lede={
          <>
            Most families have money spread across taxable, tax-deferred, and
            tax-free buckets. Coordinating how those are funded and drawn down
            can meaningfully change your tax bill — and it&rsquo;s work we do
            alongside your CPA, not instead of them.
          </>
        }
        primaryCta={{ label: siteConfig.ctaLabels.bookCall, href: bookCallHref }}
        secondaryCta={{ label: "The three buckets →", href: "#buckets" }}
      />

      <Section id="buckets" tone="surface">
        <SectionHeading
          eyebrow="The three buckets"
          title="Where your money sits changes how it's taxed."
          lede="This is coordination, not tax advice. Anything tax-specific is confirmed with your CPA before you act."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {buckets.map((item) => (
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
        <SectionHeading
          eyebrow="Questions"
          title="Common tax-planning questions."
        />
        <div className="mt-10">
          <Faq
            items={[
              {
                question: "Do you give tax advice?",
                answer:
                  "No. I'm an insurance-only agent, not a tax professional. I coordinate with your CPA so the insurance pieces fit the tax picture — your CPA confirms anything tax-specific.",
              },
              {
                question: "Where does life insurance fit?",
                answer:
                  "Certain permanent policies build cash value that can be accessed in a tax-advantaged way. Whether that's appropriate depends on your situation — we'd walk through the trade-offs.",
              },
              {
                question: "Can you work with my existing CPA?",
                answer:
                  "Absolutely. Coordinating around the professionals you already trust is the norm, not the exception.",
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
              title="Let's make sure the buckets work together."
              lede="No pressure, no jargon — just a clearer picture, coordinated with your CPA."
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
