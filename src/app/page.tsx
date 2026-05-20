import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { HeroTrustStrip } from "@/components/hero-trust-strip";
import { CarrierStrip } from "@/components/carrier-strip";
import { Section, SectionHeading } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { Faq } from "@/components/faq";
import { TestimonialRow } from "@/components/testimonial-row";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";
import { CalcTeaser } from "@/components/calc-teaser";
import { MeetAdvisor } from "@/components/meet-advisor";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { localBusiness, person } from "@/lib/schema";

export const generateMetadata = () => buildMetadata({ path: "/" });

export default function Home() {
  const bookCallHref =
    siteConfig.contact.calendlyUrl || "/retirement-planning#calculator";

  return (
    <>
      <JsonLd data={localBusiness(siteConfig)} id="ld-localbusiness" />
      <JsonLd data={person(siteConfig)} id="ld-person" />

      <Hero
        badge={
          siteConfig.heroBadge.enabled
            ? { label: siteConfig.heroBadge.label }
            : undefined
        }
        title={<>Run the number. Then book the call.</>}
        lede={
          <>
            An independent practice for first-generation families. Five inputs,
            a real retirement number in ninety seconds, then optionally a
            twenty-minute conversation with the advisor who would actually run
            your plan.
          </>
        }
        primaryCta={{
          label: `${siteConfig.ctaLabels.runNumber} →`,
          href: "/retirement-planning#calculator",
        }}
        secondaryCta={{
          label: siteConfig.ctaLabels.bookCall,
          href: bookCallHref,
        }}
        meta={
          <span>
            Typical first call: 20 minutes · No-obligation review · Calls
            returned within one business hour
          </span>
        }
        aside={siteConfig.heroCalcTeaser.enabled ? <CalcTeaser /> : null}
      />

      <HeroTrustStrip />

      <Section tone="surface">
        <SectionHeading
          eyebrow="What I help with"
          title="Three things, done carefully."
          lede="Most families I work with want help in the same three areas. Pick the one that’s most on your mind."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <ServiceCard
            eyebrow="Retirement"
            title="Retirement planning"
            description="Map your current savings, contributions, and target income to see if you’re on track — and what the gap looks like if you’re not."
            href="/retirement-planning"
            cta="Run the retirement check"
          />
          <ServiceCard
            eyebrow="Insurance"
            title="Life & disability"
            description="A short conversation about who depends on your income, what they’d need, and which term or permanent coverage may fit your situation."
            href="/life-insurance"
            cta="Estimate your coverage"
          />
          <ServiceCard
            eyebrow="Resources"
            title="Planning tools"
            description="Free spreadsheets for net worth tracking and monthly budgeting. Built for the conversations I have with clients every week."
            href="/resources"
            cta="See the tools"
          />
        </div>
      </Section>

      <Section tone="surface">
        <MeetAdvisor />
      </Section>

      <Section tone="muted">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="How it works"
              title="A first call is mostly listening."
              lede="No spreadsheet shared. No products pitched. The goal is to understand where you are and whether I’m the right fit."
            />
            <ButtonLink href={bookCallHref} className="mt-8" size="lg">
              {siteConfig.ctaLabels.bookCall}
            </ButtonLink>
          </div>
          <ol className="md:col-span-7 space-y-5">
            {[
              {
                k: "01",
                t: "Tell me what’s on your mind.",
                d: "A quick form or 20-minute call. Whatever’s easier for you.",
              },
              {
                k: "02",
                t: "We look at the numbers together.",
                d: "I’ll walk through what your current setup looks like and where the gaps may be.",
              },
              {
                k: "03",
                t: "You decide what’s next.",
                d: "If there’s a fit, we keep talking. If not, you leave with a clearer picture either way.",
              },
            ].map((step) => (
              <li
                key={step.k}
                className="flex gap-5 rounded-2xl border border-[color:var(--color-border)] bg-white p-6"
              >
                <span className="font-[family-name:var(--font-display)] text-3xl font-medium text-[color:var(--color-secondary)]">
                  {step.k}
                </span>
                <div>
                  <p
                    className="font-[family-name:var(--font-display)] text-xl font-medium text-[color:var(--color-ink)]"
                    dangerouslySetInnerHTML={{ __html: step.t }}
                  />
                  <p
                    className="mt-1.5 text-[color:var(--color-muted)]"
                    dangerouslySetInnerHTML={{ __html: step.d }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="In their words"
          title="What clients say about the process."
        />
        <div className="mt-12">
          <TestimonialRow
            items={[
              {
                quote:
                  "He explained the trade-offs in plain English. We didn’t feel rushed and didn’t feel sold to.",
                attribution: "M. Patel",
                meta: "Tracy, CA",
              },
              {
                quote:
                  "Sat with us for two hours on a Saturday and answered every question, including the ones we forgot to ask.",
                attribution: "R. Singh",
                meta: "Mountain House, CA",
              },
              {
                quote:
                  "Followed up the next week with a written summary. That alone was more than the last advisor we worked with.",
                attribution: "A. Kumar",
                meta: "Manteca, CA",
              },
            ]}
          />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Questions"
          title="Common questions, answered plainly."
        />
        <div className="mt-10">
          <Faq
            items={[
              {
                question: "Do you charge for a first conversation?",
                answer:
                  "No. The first call is a 20-minute conversation to see whether we’re a fit. If we keep working together, I’m paid by the insurance carrier on any policy you choose to put in place.",
              },
              {
                question: "Are you licensed outside of California?",
                answer: `Yes. I’m licensed as an insurance broker in ${siteConfig.licensure.licensedStates
                  .map((s) => s.name)
                  .join(
                    ", ",
                  )}. If you have family in any of those states, I can help coordinate.`,
              },
              {
                question: "Do you give investment or tax advice?",
                answer:
                  "No. I’m an insurance-only broker. The site shows estimates and frameworks; for tax filing or investment management, I’ll refer you to a CPA or RIA I trust.",
              },
              {
                question: "What if I just want to download the spreadsheets?",
                answer: (
                  <>
                    That’s fine — the{" "}
                    <a
                      href="/resources"
                      className="underline decoration-[color:var(--color-secondary)] underline-offset-4 hover:text-[color:var(--color-ink)]"
                    >
                      resources page
                    </a>{" "}
                    has the net worth and monthly budget files. I’ll send them
                    by email; no sales call required.
                  </>
                ),
                answerText:
                  "Yes — the resources page has the net worth and monthly budget files. They are sent by email; no sales call required.",
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
              title="A 20-minute call may save you a year of wondering."
              lede="No pressure, no jargon. Just a clear-eyed look at where you stand and what your options are."
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

      <CarrierStrip />

      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
          <Disclosure />
        </div>
      </div>
    </>
  );
}
