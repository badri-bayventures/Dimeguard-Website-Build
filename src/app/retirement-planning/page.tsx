import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { financialService, breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";

const PATH = "/retirement-planning";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function RetirementPlanningPage() {
  const bookCallHref = siteConfig.contact.calendlyUrl || "/contact";

  const lookAt = [
    {
      title: "Current savings & contributions",
      body: "401(k), IRA, brokerage, cash on hand — and what's going in each month.",
    },
    {
      title: "Target retirement age & income",
      body: "When you'd like to stop working full-time, and roughly what monthly income you'd want then.",
    },
    {
      title: "Social Security timing",
      body: "How filing age may affect your benefit, and how it coordinates with your other income.",
    },
    {
      title: "Tax-bucket coordination",
      body: "Pre-tax, Roth, and taxable balances — and the order they may be drawn from in retirement.",
    },
  ];

  const steps = [
    {
      k: "01",
      t: "Discovery call",
      d: "A 20-minute conversation to understand your goals and what's already in place.",
    },
    {
      k: "02",
      t: "Written summary",
      d: "A short, plain-language summary of where you stand and the options worth considering.",
    },
    {
      k: "03",
      t: "Ongoing review",
      d: "An annual check-in — or sooner if life changes (new job, new home, new dependent).",
    },
  ];

  return (
    <>
      <JsonLd
        data={financialService(siteConfig, {
          serviceType: "Retirement planning",
          path: PATH,
          description:
            "Retirement readiness review — a free first call to discuss current savings, target retirement age, Social Security timing, and tax-bucket coordination.",
        })}
        id="ld-financialservice"
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Retirement planning", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Retirement planning"
        title={<>Find out where you stand.</>}
        lede={
          <>
            A free 20-minute conversation about your current savings, your
            target retirement age, and where the gaps may be — designed for
            families in their 40s and 50s who want a clearer picture before
            making the next move.
          </>
        }
        primaryCta={{
          label: siteConfig.ctaLabels.bookCall,
          href: bookCallHref,
        }}
        secondaryCta={{
          label: "What we look at →",
          href: "#what-we-look-at",
        }}
      />

      <Section id="what-we-look-at" tone="surface">
        <SectionHeading
          eyebrow="What we look at on a first call"
          title="Four things, in plain language."
          lede="No spreadsheet required up front. If something is missing, we name it and decide whether it's worth digging up before the next call."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {lookAt.map((item) => (
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

      <Section tone="muted">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="How families typically work with me"
              title="A short ladder, not a long sales cycle."
              lede="Most engagements look like this. We can stop at any step if it's not the right fit."
            />
            <ButtonLink href={bookCallHref} className="mt-8" size="lg">
              {siteConfig.ctaLabels.bookCall}
            </ButtonLink>
          </div>
          <ol className="md:col-span-7 space-y-5">
            {steps.map((s) => (
              <li
                key={s.k}
                className="flex gap-5 rounded-2xl border border-[color:var(--color-border)] bg-white p-6"
              >
                <span className="font-[family-name:var(--font-display)] text-3xl font-medium text-[color:var(--color-secondary)]">
                  {s.k}
                </span>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl font-medium text-[color:var(--color-ink)]">
                    {s.t}
                  </p>
                  <p className="mt-1.5 text-[color:var(--color-muted)]">
                    {s.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Questions"
          title="Common retirement-planning questions."
        />
        <div className="mt-10">
          <Faq
            items={[
              {
                question: "Is the first call really free?",
                answer:
                  "Yes. The 20-minute discovery call is free with no obligation. If we keep working together, I'm paid by the insurance carrier on any policy you choose to put in place.",
              },
              {
                question: "Do you charge a fee?",
                answer:
                  "I'm an insurance-only broker — there's no planning or advisory fee. Compensation comes from the carrier when you place a policy. If a piece of work falls outside what I do, I'll say so and point you to someone who handles it.",
              },
              {
                question: "Do you manage investments?",
                answer:
                  "No. I'm an insurance-only broker — I don't manage 401(k)s, IRAs, or brokerage accounts. For investment management I refer to a CPA or RIA I trust, and we coordinate around your overall plan.",
              },
              {
                question: "What if I already have a 401(k) plan elsewhere?",
                answer:
                  "That's common. We look at how your existing plan fits into the broader picture — contributions, employer match, tax bucket — and whether anything sits outside it (IRA, life coverage, emergency fund) that may be worth tightening up.",
              },
              {
                question: "How long does a typical engagement run?",
                answer:
                  "Most families do a discovery call, a written summary, and then an annual review. Some come back sooner when life changes — a new job, a new home, a new dependent — and we re-look at the relevant pieces.",
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
              title="A 20-minute call is the shortest path to a clearer answer."
              lede="No pressure, no jargon — just a look at where you stand and what your options may be."
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
