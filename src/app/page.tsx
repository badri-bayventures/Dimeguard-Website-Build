import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { HeroTrustStrip } from "@/components/hero-trust-strip";
import { CarrierBand } from "@/components/carrier-band";
import { Container } from "@/components/container";
import { Section, SectionHeading } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { TestimonialRow } from "@/components/testimonial-row";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";
import { HeroNumber } from "@/components/hero-number";
import { CalcTeaser } from "@/components/calc-teaser";
import { buildMetadata } from "@/lib/seo/metadata";
import { listPostSummaries } from "@/lib/blog";
import { formatDate } from "@/lib/format-date";

export const revalidate = 300;

export const generateMetadata = () => buildMetadata({ path: "/" });

export default async function Home() {
  const bookCallHref = "/book?source=hero";
  const recentPosts = (await listPostSummaries()).slice(0, 3);

  return (
    <>
      <Hero
        badge={
          siteConfig.heroBadge.enabled
            ? { label: siteConfig.heroBadge.label }
            : undefined
        }
        title={
          <>Insurance, retirement, and tax — handled in slow conversations.</>
        }
        lede={
          <>
            An independent practice for first-generation families. We look at
            your number together, then decide — no script, no products pitched,
            no pressure to put anything in place on the first call.
          </>
        }
        primaryCta={{
          label: siteConfig.ctaLabels.bookCall,
          href: bookCallHref,
        }}
        secondaryCta={{
          label: `${siteConfig.ctaLabels.runNumber} →`,
          href: "/#calculator",
        }}
        meta={
          <span>
            Typical first call: 20 minutes · No-obligation review · Calls
            returned within one business hour
          </span>
        }
        aside={<HeroNumber />}
      />

      <HeroTrustStrip />

      <Section id="calculator" tone="muted">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="THE DIMEGUARD NUMBER"
              title="See where you stand in 90 seconds."
              lede="Four inputs. A real projection. No signup — your numbers stay on this page."
            />
            <p className="mt-6 text-base text-[color:var(--color-ink)]/70">
              The projection updates live as you type, using the same math as
              the first call — so what you see here is the same starting point
              we’d work from together.
            </p>
          </div>
          <div className="md:col-span-7">
            <CalcTeaser />
          </div>
        </div>
      </Section>

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
            title="Life insurance"
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

      <CarrierBand />

      {/* Testimonials — PLACEHOLDER STRUCTURE. Renders only when real,
          permissioned quotes exist in siteConfig.testimonials.items (blocked
          on GBP verification + Saral's client outreach). Never seed with
          fabricated content. */}
      {siteConfig.testimonials.enabled &&
        siteConfig.testimonials.items.length > 0 && (
          <Section tone="surface">
            <SectionHeading
              eyebrow={siteConfig.testimonials.eyebrow}
              title={siteConfig.testimonials.title}
            />
            <div className="mt-12">
              <TestimonialRow items={siteConfig.testimonials.items} />
            </div>
          </Section>
        )}

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
                answer:
                  "I’m a licensed insurance agent based in California, serving clients across the nation. Mention your state on the first call and I’ll confirm I can serve you. In-person meetings are available on request.",
              },
              {
                question: "Do you give investment or tax advice?",
                answer:
                  "No. I’m an insurance-only agent. The site shows estimates and frameworks; for tax filing or investment management, I’ll refer you to a CPA or RIA I trust.",
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

      {recentPosts.length ? (
        <Section tone="surface">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Latest insights" title="Notes on planning." />
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-ink)] underline decoration-[color:var(--color-secondary)] decoration-2 underline-offset-4 hover:text-[color:var(--color-ink-soft)]"
            >
              All posts →
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-[color:var(--color-border)] bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                      {post.category}
                    </span>
                    <time
                      dateTime={post.publishedDate}
                      className="text-xs text-[color:var(--color-muted)]"
                    >
                      {formatDate(post.publishedDate)}
                    </time>
                  </div>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-base font-medium tracking-tight text-[color:var(--color-ink)]">
                    {post.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-ink)] group-hover:underline">
                    Read post →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
        <Container className="py-8">
          <Disclosure />
        </Container>
      </div>
    </>
  );
}
