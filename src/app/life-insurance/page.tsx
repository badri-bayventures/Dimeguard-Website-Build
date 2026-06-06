import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { financialService, breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";

const PATH = "/life-insurance";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function LifeInsurancePage() {
  const bookCallHref = "/book?source=life";

  const lookAt = [
    {
      title: "Income to replace",
      body: "How many years of income your family would need if it suddenly stopped, and for whom.",
    },
    {
      title: "Dependents",
      body: "Children, partner, parents — anyone whose plans rely on your income today.",
    },
    {
      title: "Existing employer coverage",
      body: "What your group life policy actually covers — and what happens to it when you change jobs.",
    },
    {
      title: "Term vs permanent fit",
      body: "Whether a level-term policy is enough for the years that matter most, or whether a permanent piece may belong in the mix.",
    },
    {
      title: "Riders worth knowing",
      body: "Disability waiver, accelerated death benefit, child term — small additions that can matter at claim time.",
    },
  ];

  return (
    <>
      <JsonLd
        data={financialService(siteConfig, {
          serviceType: "Life insurance",
          path: PATH,
          description:
            "Term and permanent life insurance through a multi-carrier independent agent — a short conversation about income, dependents, and the coverage that may fit your situation.",
        })}
        id="ld-financialservice"
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Life insurance", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Life & disability"
        title={<>Estimate the coverage your family may need.</>}
        lede={
          <>
            A short conversation about who depends on your income, what they
            would need, and which term or permanent coverage may fit your
            situation. No products pitched on the first call.
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
          title="Five inputs, plain language."
          lede="Most of these you already know off the top of your head. Anything missing, we name on the call and move on."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <SectionHeading
          eyebrow="How term vs permanent compares"
          title="Two different jobs, sometimes both at once."
          lede="Most families need term coverage for the years they're still building. A permanent piece may belong in the picture for specific reasons — estate, business, or a long-tail dependent."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
              Term
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-medium text-[color:var(--color-ink)]">
              For the years that matter most.
            </h3>
            <ul className="mt-5 space-y-3 text-[color:var(--color-ink-soft)]">
              <li>Fixed coverage for a set number of years (commonly 10, 20, or 30).</li>
              <li>Lower premium relative to permanent for the same death benefit.</li>
              <li>Designed to cover income-replacement years — typically while raising kids or carrying a mortgage.</li>
              <li>No cash value; coverage ends when the term ends.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
              Permanent
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-medium text-[color:var(--color-ink)]">
              For coverage that needs to outlast a term.
            </h3>
            <ul className="mt-5 space-y-3 text-[color:var(--color-ink-soft)]">
              <li>Coverage designed to remain in force for life, as long as premiums are paid.</li>
              <li>Builds cash value over time; the trade-off is a higher premium.</li>
              <li>Used in narrower situations — estate planning, a special-needs dependent, business continuity.</li>
              <li>Not a substitute for investment accounts. We talk through fit before recommending.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Questions"
          title="Common life-insurance questions."
        />
        <div className="mt-10">
          <Faq
            items={[
              {
                question: "Do you sell whole life?",
                answer:
                  "I place both term and permanent policies, including whole life, when the situation calls for it. I don't lead with permanent — most families I work with need term coverage first, and we talk through whether a permanent piece belongs in the picture at all.",
              },
              {
                question: "How do you decide between term and permanent?",
                answer:
                  "It comes down to what the coverage is for. Income replacement for working years usually points to term. A specific long-tail need — estate, business, a dependent who will need support for life — may point to a permanent piece. We talk it through before any recommendation.",
              },
              {
                question: "Do you work with people who've been declined before?",
                answer:
                  "Sometimes. It depends on why the previous decline happened and how long ago. I can talk through the situation on the first call and tell you whether it's worth re-applying, and which carriers may underwrite differently.",
              },
              {
                question: "Is the carrier commission disclosed?",
                answer:
                  "Yes. Compensation comes from the carrier on any policy you place — I'll tell you in plain terms how that works before you sign anything.",
              },
              {
                question: "How much coverage do most clients end up with?",
                answer:
                  "It varies widely with income, dependents, and what's already in place. We look at the actual numbers on a first call — the goal is a coverage range that fits your situation, not a benchmark from someone else's.",
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
              title="The shortest path to a real coverage number."
              lede="20 minutes, no script, no obligation. Bring whatever you already know — I'll fill in the rest."
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
