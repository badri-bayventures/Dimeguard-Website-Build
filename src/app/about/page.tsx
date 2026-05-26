import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { siteConfig, absoluteUrl, type Founder } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";

const PATH = "/about";

export const generateMetadata = () => buildMetadata({ path: PATH });

function FounderCard({ founder }: { founder: Founder }) {
  return (
    <article className="rounded-3xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-10">
      <div className="grid items-start gap-8 md:grid-cols-[240px_1fr] md:gap-10">
        <div className="mx-auto md:mx-0">
          {founder.photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={founder.photoSrc}
              alt={`${founder.name}, ${founder.role}`}
              width={240}
              height={240}
              className="h-[240px] w-[240px] rounded-2xl object-cover object-[center_20%]"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-[240px] w-[240px] flex-col items-end justify-end rounded-2xl bg-gradient-to-br from-[color:var(--color-ink)] to-[color:var(--color-ink-soft)] p-6 text-white"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                Photo
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-tight">
                {founder.name}
              </p>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[color:var(--color-ink)]">
            {founder.name}
          </h3>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            {founder.role}
          </p>
          <div className="mt-5 max-w-prose space-y-4 text-[color:var(--color-ink-soft)]">
            {founder.bioParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {founder.knowsLanguage.length ? (
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
              Speaks · {founder.knowsLanguage.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function AboutPage() {
  const founders = siteConfig.founders;
  const isTwo = founders.length >= 2;
  const bookCallHref = siteConfig.contact.calendlyUrl || "/contact";

  const why = [
    {
      t: "Built around the Central Valley.",
      d: "Based in Mountain House. Most clients live within driving distance — Tracy, Manteca, Lathrop, Stockton, Modesto.",
    },
    {
      t: "A first-generation-family lens.",
      d: "Many conversations start with mixed family situations: parents abroad, kids in college, side income, multiple bank accounts. We treat that as the norm, not the exception.",
    },
    {
      t: "Small practice on purpose.",
      d: "No call center, no junior-associate handoff. The person you meet on the first call is the person who runs your plan.",
    },
  ];

  return (
    <>
      {/* LocalBusiness + Person blocks are emitted site-wide from the root layout. */}
      {founders.slice(1).map((f, i) => (
        <JsonLd
          key={f.name}
          id={`ld-person-${i + 1}`}
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${absoluteUrl("/about")}#person-${i + 1}`,
            name: f.name,
            jobTitle: f.role,
            knowsLanguage: f.knowsLanguage,
            image: f.photoSrc ? absoluteUrl(f.photoSrc) : undefined,
            worksFor: {
              "@type": "FinancialService",
              "@id": `${absoluteUrl("/")}#localbusiness`,
              name: siteConfig.business.legalName,
              url: siteConfig.business.url,
            },
          }}
        />
      ))}
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "About", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="About"
        title={
          isTwo ? <>Two operators. One practice.</> : <>Meet {founders[0]?.name.split(" ")[0]}.</>
        }
        lede={
          isTwo ? (
            <>
              An independent insurance practice based in Mountain House,
              serving the Central Valley. Built on slow conversations and a
              short product list.
            </>
          ) : (
            <>
              An independent insurance practice based in Mountain House,
              serving the Central Valley. Built on slow conversations,
              written summaries, and a deliberately small client list.
            </>
          )
        }
        primaryCta={{
          label: siteConfig.ctaLabels.bookCall,
          href: bookCallHref,
        }}
        aside={
          <figure className="rounded-3xl border border-[color:var(--color-border)] bg-white/60 p-8 md:p-10">
            <blockquote className="font-[family-name:var(--font-display)] text-2xl italic leading-snug text-[color:var(--color-ink-soft)] md:text-3xl">
              &ldquo;I had never been properly taught how money really works.&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
              <span
                aria-hidden
                className="inline-block h-px w-8 bg-[color:var(--color-border)]"
              />
              — Saral, on why he started the practice
            </figcaption>
          </figure>
        }
      />

      <Section tone="surface">
        <div
          className={
            isTwo
              ? "grid gap-8 md:grid-cols-2"
              : "mx-auto max-w-4xl"
          }
        >
          {founders.map((f) => (
            <FounderCard key={f.name} founder={f} />
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Why Dimeguard"
          title="A few things that shape how we work."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {why.map((item) => (
            <li
              key={item.t}
              className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl font-medium text-[color:var(--color-ink)]">
                {item.t}
              </h3>
              <p className="mt-2 text-[color:var(--color-ink-soft)]">
                {item.d}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="ink">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <SectionHeading
              eyebrow="Ready when you are"
              title="The first call is 20 minutes."
              lede="No script, no products pitched. If we're not the right fit, you'll leave with a clearer picture either way."
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
