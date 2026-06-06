import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/container";
import { Disclosure } from "@/components/disclosure";

const PATH = "/terms";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function TermsPage() {
  const { legalName } = siteConfig.business;
  const { licenseNumber } = siteConfig.licensure;
  const effective = "June 6, 2026";

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Terms of use", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <section className="bg-[color:var(--color-surface-muted)] pt-20 pb-12 md:pt-28 md:pb-16">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
            Legal
          </p>
          <h1
            className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-6xl"
            style={{ lineHeight: 1.05 }}
          >
            Terms of use
          </h1>
          <p className="mt-6 text-sm text-[color:var(--color-muted)]">
            Effective {effective}
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="prose prose-neutral max-w-3xl text-[color:var(--color-ink-soft)]">
            <p>
              These terms govern your use of the {legalName} website. By using
              this site, you agree to them. If you do not agree, please do not
              use the site.
            </p>

            <h2>Informational purposes only</h2>
            <p>
              The content on this site is provided for general informational
              purposes only. It is not investment, tax, or legal advice, and it
              does not constitute an offer or solicitation in any jurisdiction
              where that would be unlawful. You should consult a qualified
              professional before acting on anything you read here.
            </p>

            <h2>Insurance-only scope</h2>
            <p>
              {legalName} operates as a licensed insurance agent (CA Insurance
              License #{licenseNumber}). We do not manage investments and do not
              provide tax or legal advice. Any calculators or projections on this
              site are estimates based on the assumptions shown and are not
              guarantees of future results.
            </p>

            <h2>No client relationship</h2>
            <p>
              Using this site or submitting the contact form does not create an
              agent-client or fiduciary relationship. Such a relationship is
              formed only through a separate, explicit agreement.
            </p>

            <h2>Accuracy &amp; availability</h2>
            <p>
              We work to keep the information here accurate and current, but we
              make no warranty that it is complete, error-free, or continuously
              available. We may change or remove content at any time without
              notice.
            </p>

            <h2>Third-party links</h2>
            <p>
              This site may link to third-party websites and tools. We are not
              responsible for their content, products, or practices.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, {legalName} is not liable
              for any damages arising from your use of, or inability to use, this
              site.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the State of California,
              without regard to its conflict-of-laws rules.
            </p>

            <h2>Contact us</h2>
            <p>
              Questions about these terms? Reach us through the{" "}
              <a href="/contact" className="underline">
                contact page
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
          <Disclosure />
        </div>
      </div>
    </>
  );
}
