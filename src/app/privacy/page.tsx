import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/container";
import { Disclosure } from "@/components/disclosure";

const PATH = "/privacy";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function PrivacyPage() {
  const { legalName } = siteConfig.business;
  const effective = "June 6, 2026";

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Privacy policy", path: PATH },
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
            Privacy policy
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
              {legalName} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;) respects your privacy. This policy explains what
              information we collect through this website, how we use it, and the
              choices you have — including the rights of California residents
              under the California Consumer Privacy Act (CCPA) and the California
              Online Privacy Protection Act (CalOPPA).
            </p>

            <h2>Information we collect</h2>
            <p>
              We collect information you choose to provide — for example, your
              name, email address, and any message you send through our contact
              form or when you request a call. We also collect limited technical
              information automatically, such as your browser type, device, and
              pages visited, through cookies and similar technologies.
            </p>

            <h2>How we use your information</h2>
            <p>
              We use the information to respond to your inquiries, schedule
              calls, provide the services you request, and improve the website.
              We do not sell your personal information.
            </p>

            <h2>Cookies and tracking</h2>
            <p>
              This site uses cookies to remember your preferences and, where
              enabled, to understand how the site is used. You can control
              cookies through your browser settings. Because honoring browser
              &ldquo;Do Not Track&rdquo; signals is not yet standardized, we
              treat a declined cookie banner as your preference where applicable.
            </p>

            <h2>Your California privacy rights</h2>
            <p>
              If you are a California resident, you have the right to request
              that we disclose the categories and specific pieces of personal
              information we have collected, the right to request deletion of
              that information, and the right not to be discriminated against for
              exercising these rights. To make a request, contact us using the
              details below. We do not sell personal information, so no opt-out
              of sale is required.
            </p>

            <h2>Data retention &amp; security</h2>
            <p>
              We retain personal information only as long as needed for the
              purposes described here or as required by law, and we use
              reasonable safeguards to protect it. No method of transmission over
              the internet is completely secure, however, and we cannot guarantee
              absolute security.
            </p>

            <h2>Third-party links</h2>
            <p>
              Our site may link to third-party sites (for example, a scheduling
              tool). Their privacy practices are governed by their own policies,
              not this one.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will
              be reflected by updating the effective date above.
            </p>

            <h2>Contact us</h2>
            <p>
              Questions about this policy or your privacy rights? Reach us
              through the{" "}
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
