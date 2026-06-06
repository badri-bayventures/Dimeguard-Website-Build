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

const PATH = "/privacy";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function PrivacyPage() {
  const { legalName } = siteConfig.business;
  const effective = "June 6, 2026";

  const sections: LegalSection[] = [
    {
      id: "information-we-collect",
      title: "Information we collect",
      body: (
        <p>
          We collect information you choose to provide — for example, your name,
          email address, and any message you send through our contact form or
          when you request a call. We also collect limited technical information
          automatically, such as your browser type, device, and pages visited,
          through cookies and similar technologies.
        </p>
      ),
    },
    {
      id: "how-we-use-it",
      title: "How we use your information",
      body: (
        <>
          <p>
            We use the information to respond to your inquiries, schedule calls,
            provide the services you request, and improve the website.
          </p>
          <LegalCallout title="We do not sell your personal information." />
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies and tracking",
      body: (
        <p>
          This site uses cookies to remember your preferences and, where
          enabled, to understand how the site is used. You can control cookies
          through your browser settings. Because honoring browser &ldquo;Do Not
          Track&rdquo; signals is not yet standardized, we treat a declined
          cookie banner as your preference where applicable.
        </p>
      ),
    },
    {
      id: "california-rights",
      title: "Your California privacy rights",
      body: (
        <>
          <p>
            If you are a California resident, you have the right to request that
            we disclose the categories and specific pieces of personal
            information we have collected, the right to request deletion of that
            information, and the right not to be discriminated against for
            exercising these rights. To make a request, contact us using the
            details below. We do not sell personal information, so no opt-out of
            sale is required.
          </p>
          <LegalCallout title="Your rights at a glance">
            Request what we&rsquo;ve collected, request deletion, and never be
            discriminated against for asking — under the CCPA and CalOPPA.
          </LegalCallout>
        </>
      ),
    },
    {
      id: "retention-security",
      title: "Data retention & security",
      body: (
        <p>
          We retain personal information only as long as needed for the purposes
          described here or as required by law, and we use reasonable safeguards
          to protect it. No method of transmission over the internet is
          completely secure, however, and we cannot guarantee absolute security.
        </p>
      ),
    },
    {
      id: "third-party-links",
      title: "Third-party links",
      body: (
        <p>
          Our site may link to third-party sites (for example, a scheduling
          tool). Their privacy practices are governed by their own policies, not
          this one.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: (
        <p>
          We may update this policy from time to time. Material changes will be
          reflected by updating the effective date above.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact us",
      body: (
        <LegalContactCta ctaLabel="Go to the contact page">
          Questions about this policy or your privacy rights? Reach us through
          the contact page.
        </LegalContactCta>
      ),
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Privacy policy", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <LegalLayout
        title="Privacy policy"
        effectiveDate={effective}
        summary="What we collect through this website, how we use it, and the choices you have — including California residents' rights."
        intro={
          <p>
            {legalName} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            respects your privacy. This policy explains what information we
            collect through this website, how we use it, and the choices you
            have — including the rights of California residents under the
            California Consumer Privacy Act (CCPA) and the California Online
            Privacy Protection Act (CalOPPA).
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
