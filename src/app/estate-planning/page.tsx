import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { financialService, breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";

const PATH = "/estate-planning";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function EstatePlanningPage() {
  const bookCallHref = siteConfig.contact.calendlyUrl || "/contact";

  const pieces = [
    {
      title: "Beneficiary alignment",
      body: "Beneficiary designations override your will. We check that the names on your policies and accounts match your intentions.",
    },
    {
      title: "Liquidity for what's owed",
      body: "Life insurance can provide cash to cover taxes, debts, and expenses — so heirs aren't forced to sell assets in a hurry.",
    },
    {
      title: "Income replacement",
      body: "For families still raising kids or carrying a mortgage, coverage keeps the plan intact if something happens to a provider.",
    },
    {
      title: "Where the attorney leads",
      body: "Wills and trusts are drafted by your estate attorney. We make sure the insurance fits cleanly alongside those documents.",
    },
  ];

  return (
    <>
      <JsonLd
        data={financialService(siteConfig, {
          serviceType: "Estate planning",
          path: PATH,
          description:
            "The insurance side of passing things on cleanly — beneficiary alignment, liquidity for taxes and expenses, and where life insurance fits alongside a will or trust drafted by your attorney.",
        })}
        id="ld-financialservice"
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Estate planning", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Estate planning"
        title={<>Passing things on, cleanly.</>}
        lede={
          <>
            The legal documents come from your attorney — we handle the insurance
            side. Aligning beneficiaries, providing liquidity for what&rsquo;s
            owed, and making sure coverage fits the plan your family is counting
            on.
          </>
        }
        primaryCta={{ label: siteConfig.ctaLabels.bookCall, href: bookCallHref }}
        secondaryCta={{ label: "Where we help →", href: "#pieces" }}
      />

      <Section id="pieces" tone="surface">
        <SectionHeading
          eyebrow="The insurance side"
          title="Four things that are easy to overlook."
          lede="None of this replaces a will or trust. It makes sure the insurance pieces line up with the documents your attorney drafts."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {pieces.map((item) => (
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
          title="Common estate-planning questions."
        />
        <div className="mt-10">
          <Faq
            items={[
              {
                question: "Do you draft wills or trusts?",
                answer:
                  "No. Those are legal documents drafted by your estate attorney. I handle the insurance side and make sure it coordinates with what your attorney puts in place.",
              },
              {
                question: "Why does life insurance come up in estate planning?",
                answer:
                  "It can provide tax-advantaged liquidity — cash that's available quickly to cover taxes, debts, or expenses — so heirs aren't forced to sell assets at a bad time.",
              },
              {
                question: "What should I check on my own first?",
                answer:
                  "Your beneficiary designations. They override your will, and outdated names are one of the most common — and most avoidable — estate mistakes.",
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
              title="Let's make sure the coverage fits the plan."
              lede="No pressure, no jargon — just a look at how the pieces line up."
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
