import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { FaqBlock } from "@/components/faq-block";
import { TestimonialRow } from "@/components/testimonial-row";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";

export default function Home() {
  const states = siteConfig.licensure.licensedStates
    .map((s) => s.code)
    .join(" · ");

  return (
    <>
      <Hero
        eyebrow={`${siteConfig.nap.addressLocality}, ${siteConfig.nap.addressRegion} · Licensed in ${states}`}
        title={
          <>
            Clear-eyed planning for{" "}
            <span className="text-[color:var(--color-ink-soft)]">
              Central Valley families
            </span>
            .
          </>
        }
        lede={
          <>
            Insurance, retirement, and tax coordination designed to help you
            decide with confidence — without sales pressure. {siteConfig.advisor.fullName} works
            one-on-one with families in their 40s and 50s.
          </>
        }
        primaryCta={{
          label: "Run the retirement check",
          href: "/retirement-planning#calculator",
        }}
        secondaryCta={{
          label: `About ${siteConfig.advisor.firstName}`,
          href: "/about",
        }}
        meta={
          <span>
            Typical first call: 15 minutes · No-obligation review · Calls
            returned within one business hour
          </span>
        }
        aside={
          <div className="aspect-[4/5] w-full rounded-2xl bg-gradient-to-br from-[color:var(--color-ink)] to-[color:var(--color-ink-soft)] p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
              Founder
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium leading-tight">
              {siteConfig.advisor.fullName}
            </p>
            <p className="mt-1 text-sm text-white/75">
              {siteConfig.advisor.title}
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
              Photo placeholder · swap in step 3
            </div>
          </div>
        }
      />

      <Section tone="surface">
        <SectionHeading
          eyebrow="What I help with"
          title="Three things, done carefully."
          lede="Most families I work with want help in the same three areas. Pick the one that&rsquo;s most on your mind."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <ServiceCard
            eyebrow="Retirement"
            title="Retirement planning"
            description="Map your current savings, contributions, and target income to see if you&rsquo;re on track — and what the gap looks like if you&rsquo;re not."
            href="/retirement-planning"
            cta="Run the retirement check"
          />
          <ServiceCard
            eyebrow="Insurance"
            title="Life insurance"
            description="A short conversation about who depends on your income, what they&rsquo;d need, and which term or permanent coverage may fit your situation."
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

      <Section tone="muted">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="How it works"
              title="A first call is mostly listening."
              lede="No spreadsheet shared. No products pitched. The goal is to understand where you are and whether I&rsquo;m the right fit."
            />
            <ButtonLink
              href={
                siteConfig.contact.calendlyUrl ||
                "/retirement-planning#calculator"
              }
              className="mt-8"
              size="lg"
            >
              Book a 15-min call
            </ButtonLink>
          </div>
          <ol className="md:col-span-7 space-y-5">
            {[
              {
                k: "01",
                t: "Tell me what&rsquo;s on your mind.",
                d: "A quick form or 15-minute call. Whatever&rsquo;s easier for you.",
              },
              {
                k: "02",
                t: "We look at the numbers together.",
                d: "I&rsquo;ll walk through what your current setup looks like and where the gaps may be.",
              },
              {
                k: "03",
                t: "You decide what&rsquo;s next.",
                d: "If there&rsquo;s a fit, we keep talking. If not, you leave with a clearer picture either way.",
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
                  "He explained the trade-offs in plain English. We didn&rsquo;t feel rushed and didn&rsquo;t feel sold to.",
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
          <FaqBlock
            items={[
              {
                question: "Do you charge for a first conversation?",
                answer:
                  "No. The first call is a 15-minute conversation to see whether we&rsquo;re a fit. If we keep working together, I&rsquo;m paid by the insurance carrier on any policy you choose to put in place.",
              },
              {
                question:
                  "Are you licensed outside of California?",
                answer: `Yes. I&rsquo;m licensed as an insurance broker in ${siteConfig.licensure.licensedStates
                  .map((s) => s.name)
                  .join(
                    ", "
                  )}. If you have family in any of those states, I can help coordinate.`,
              },
              {
                question: "Do you give investment or tax advice?",
                answer:
                  "No. I&rsquo;m an insurance-only broker. The site shows estimates and frameworks; for tax filing or investment management, I&rsquo;ll refer you to a CPA or RIA I trust.",
              },
              {
                question:
                  "What if I just want to download the spreadsheets?",
                answer: (
                  <>
                    That&rsquo;s fine — the{" "}
                    <a
                      href="/resources"
                      className="underline decoration-[color:var(--color-secondary)] underline-offset-4 hover:text-[color:var(--color-ink)]"
                    >
                      resources page
                    </a>{" "}
                    has the net worth and monthly budget files. I&rsquo;ll
                    send them by email; no sales call required.
                  </>
                ),
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
              title="A 15-minute call may save you a year of wondering."
              lede="No pressure, no jargon. Just a clear-eyed look at where you stand and what your options are."
              inverted
            />
          </div>
          <div className="md:col-span-4 md:text-right">
            <ButtonLink
              size="lg"
              href={
                siteConfig.contact.calendlyUrl ||
                "/retirement-planning#calculator"
              }
            >
              Book a 15-min call
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
