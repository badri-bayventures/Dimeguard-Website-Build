import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Disclosure } from "@/components/disclosure";
import {
  LegalLayout,
  LegalCallout,
  LegalContactCta,
  type LegalSection,
} from "@/components/legal-layout";

const PATH = "/terms";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function TermsPage() {
  const { legalName } = siteConfig.business;
  const { licenseNumber } = siteConfig.licensure;
  const effective = "June 6, 2026";

  const sections: LegalSection[] = [
    {
      id: "informational-purposes",
      title: "Informational purposes only",
      body: (
        <>
          <LegalCallout title="Informational purposes only — not advice.">
            Nothing on this site is investment, tax, or legal advice, and it is
            not an offer or solicitation where that would be unlawful.
          </LegalCallout>
          <p>
            The content on this site is provided for general informational
            purposes only. It is not investment, tax, or legal advice, and it
            does not constitute an offer or solicitation in any jurisdiction
            where that would be unlawful. You should consult a qualified
            professional before acting on anything you read here.
          </p>
        </>
      ),
    },
    {
      id: "insurance-only-scope",
      title: "Insurance-only scope",
      body: (
        <>
          <LegalCallout title="Insurance-only licensure.">
            {legalName} operates as a licensed insurance agent (CA Insurance
            License #{licenseNumber}). We do not manage investments and do not
            provide tax or legal advice.
          </LegalCallout>
          <p>
            Any calculators or projections on this site are estimates based on
            the assumptions shown and are not guarantees of future results.
          </p>
        </>
      ),
    },
    {
      id: "no-client-relationship",
      title: "No client relationship",
      body: (
        <>
          <p>
            Using this site or submitting the contact form does not create an
            agent-client or fiduciary relationship.
          </p>
          <LegalCallout title="No client relationship is created by using this site.">
            Such a relationship is formed only through a separate, explicit
            agreement.
          </LegalCallout>
        </>
      ),
    },
    {
      id: "accuracy-availability",
      title: "Accuracy & availability",
      body: (
        <p>
          We work to keep the information here accurate and current, but we make
          no warranty that it is complete, error-free, or continuously
          available. We may change or remove content at any time without notice.
        </p>
      ),
    },
    {
      id: "third-party-links",
      title: "Third-party links",
      body: (
        <p>
          This site may link to third-party websites and tools. We are not
          responsible for their content, products, or practices.
        </p>
      ),
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of liability",
      body: (
        <p>
          To the fullest extent permitted by law, {legalName} is not liable for
          any damages arising from your use of, or inability to use, this site.
        </p>
      ),
    },
    {
      id: "governing-law",
      title: "Governing law",
      body: (
        <p>
          These terms are governed by the laws of the State of California,
          without regard to its conflict-of-laws rules.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact us",
      body: (
        <LegalContactCta ctaLabel="Go to the contact page">
          Questions about these terms? Reach us through the contact page.
        </LegalContactCta>
      ),
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Terms of use", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <LegalLayout
        title="Terms of use"
        effectiveDate={effective}
        summary="The rules for using this website, the limits of what we provide, and the law that governs these terms."
        intro={
          <p>
            These terms govern your use of the {legalName} website. By using this
            site, you agree to them. If you do not agree, please do not use the
            site.
          </p>
        }
        sections={sections}
      />

      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
          <Disclosure />
        </div>
      </div>
    </>
  );
}
