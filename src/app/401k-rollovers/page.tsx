import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { financialService, breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Faq } from "@/components/faq";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";

const PATH = "/401k-rollovers";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function RolloversPage() {
  const bookCallHref = siteConfig.contact.calendlyUrl || "/contact";

  const considerations = [
    {
      title: "Leave it where it is",
      body: "If an old plan has strong, low-cost options and you like the lineup, there's often no rush to move it.",
    },
    {
      title: "Roll into an IRA",
      body: "Consolidating an old 401(k) into an IRA can simplify your accounts and widen the menu of options — with trade-offs worth naming first.",
    },
    {
      title: "Roll into a new employer plan",
      body: "Some plans accept incoming rollovers. That keeps things in one place if the new plan is a good one.",
    },
    {
      title: "Cash it out (rarely)",
      body: "Taking the money usually means taxes and possible penalties. We'd walk through why this is seldom the right move.",
    },
  ];

  return (
    <>
      <JsonLd
        data={financialService(siteConfig, {
          serviceType: "401(k) rollovers",
          path: PATH,
          description:
            "A plain-language look at rolling an old 401(k) into an IRA — when it makes sense, the tax-bucket implications, and the trade-offs to weigh before moving money.",
        })}
        id="ld-financialservice"
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "401(k) rollovers", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="401(k) rollovers"
        title={<>What to do with an old 401(k).</>}
        lede={
          <>
            Changed jobs and left a plan behind? There are usually four choices.
            We&rsquo;ll talk through which one fits your situation — and the
            tax-bucket details that are easy to miss.
          </>
        }
        primaryCta={{ label: siteConfig.ctaLabels.bookCall, href: bookCallHref }}
        secondaryCta={{ label: "Your options →", href: "#options" }}
      />

      <Section id="options" tone="surface">
        <SectionHeading
          eyebrow="The usual choices"
          title="Four paths, in plain language."
          lede="None of these is automatically right. The best move depends on the plan you have, your tax buckets, and what you want next."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {considerations.map((item) => (
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
        <SectionHeading eyebrow="Questions" title="Common rollover questions." />
        <div className="mt-10">
          <Faq
            items={[
              {
                question: "Do you manage the IRA after a rollover?",
                answer:
                  "No. I'm an insurance-only agent — I don't manage IRAs or brokerage accounts. For investment management I coordinate with a CPA or RIA I trust.",
              },
              {
                question: "Will a rollover trigger taxes?",
                answer:
                  "A direct rollover (trustee-to-trustee) generally isn't a taxable event. The details matter, and anything tax-specific should be confirmed with your CPA.",
              },
              {
                question: "What does the first call cover?",
                answer:
                  "A 20-minute look at the plan you left behind, your other accounts, and which of the four paths is worth a closer look.",
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
              title="Bring the old statement — we'll make sense of it together."
              lede="No pressure, no jargon — just a look at where things stand and what your options may be."
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
