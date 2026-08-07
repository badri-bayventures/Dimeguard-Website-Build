import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb, financialService } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { statePages, getStatePage } from "@/lib/states";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { Disclosure } from "@/components/disclosure";
import { ButtonLink } from "@/components/button";

/**
 * Multi-state initial pages (M3 scope): one page per licensed state, all
 * statically generated from `src/lib/states.ts`. Route metadata (title,
 * description, sitemap, llms.txt) comes from the matching entries in
 * `siteConfig.routes`.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return statePages.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  return buildMetadata({ path: `/states/${state}` });
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const page = getStatePage(state);
  if (!page) notFound();

  const path = `/states/${page.slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: page.name, path },
        ])}
        id="ld-breadcrumb"
      />
      <JsonLd
        data={financialService(siteConfig, {
          serviceType: `Financial planning in ${page.name}`,
          path,
          description: `Insurance, retirement, and tax-aware planning for ${page.name} families.`,
        })}
        id="ld-service"
      />

      <Hero
        eyebrow={`Serving ${page.name}`}
        title={
          <>
            Insurance, retirement &amp; tax planning for {page.name} families.
          </>
        }
        lede={<>{page.lede}</>}
        primaryCta={{
          label: siteConfig.ctaLabels.bookCall,
          href: "/book?source=footer",
        }}
        secondaryCta={{
          label: `${siteConfig.ctaLabels.runNumber} →`,
          href: "/calculators/retirement",
        }}
        meta={
          <span>
            Licensed in {page.name}
            {page.isHomeState
              ? ` · CA Insurance Lic. #${siteConfig.licensure.licenseNumber}`
              : " · meetings by video"}
            · Typical first call: 20 minutes
          </span>
        }
      />

      <Section>
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionHeading
              eyebrow="How it works"
              title={`Working together from ${page.name}.`}
            />
            <p className="mt-6 text-base leading-relaxed text-[color:var(--color-ink)]/80">
              {page.howItWorks}
            </p>
            <p className="mt-4 text-base leading-relaxed text-[color:var(--color-ink)]/80">
              As an independent, multi-carrier agency, recommendations are
              placed with carriers licensed in {page.name} — never limited to
              one company&rsquo;s shelf.
            </p>
          </div>
          <div className="md:col-span-6">
            <div className="grid gap-6">
              <ServiceCard
                eyebrow="Retirement"
                title="Retirement planning"
                description="Map your current savings, contributions, and target income to see if you're on track — and what the gap looks like if you're not."
                href="/retirement-planning"
                cta="Run the retirement check"
              />
              <ServiceCard
                eyebrow="Insurance"
                title="Life insurance"
                description="A short conversation about who depends on your income, what they'd need, and which term or permanent coverage may fit."
                href="/life-insurance"
                cta="Estimate your coverage"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <SectionHeading
            eyebrow="Also licensed in"
            title="Four states, one practice."
          />
          <div className="flex flex-wrap gap-3">
            {statePages
              .filter((s) => s.slug !== page.slug)
              .map((s) => (
                <ButtonLink key={s.slug} variant="ghost" href={`/states/${s.slug}`}>
                  {s.name}
                </ButtonLink>
              ))}
          </div>
        </div>
        <Disclosure className="mt-10" />
      </Section>
    </>
  );
}
