import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Disclosure } from "@/components/disclosure";
import { ContactForm } from "@/components/contact-form";

const PATH = "/contact";

export const generateMetadata = () => buildMetadata({ path: PATH });

type ContactChannel = {
  label: string;
  value: string;
  href: string;
  hint?: string;
};

export default function ContactPage() {
  const { nap } = siteConfig;
  const telHref = nap.phone ? `tel:${nap.phone.replace(/[^\d+]/g, "")}` : "";

  const channels: ContactChannel[] = [];
  if (nap.email) {
    channels.push({
      label: "Email",
      value: nap.email,
      href: `mailto:${nap.email}`,
      hint: "For quick questions or sending a document.",
    });
  }
  if (nap.phone) {
    channels.push({
      label: "Phone",
      value: nap.phone,
      href: telHref,
      hint: "Calls returned within one business hour.",
    });
  }
  channels.push({
    label: "Book a call",
    value: "20-minute call",
    href: "/book?source=footer",
    hint: "Pick a time that works — no prep required.",
  });

  return (
    <>
      {/* LocalBusiness block is emitted site-wide from the root layout. */}
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Contact", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Contact"
        title={<>Three ways to reach us.</>}
        lede={
          <>
            Email for quick questions, Calendly for a 20-minute call, or the
            form below if you&rsquo;d rather write.
          </>
        }
        aside={
          <div className="rounded-3xl border border-[color:var(--color-border)] bg-white/60 p-8 text-[color:var(--color-ink-soft)] md:p-10">
            <p className="font-medium text-[color:var(--color-ink)]">
              Calls returned within one business hour
            </p>
            <ul className="mt-5 space-y-1 text-sm">
              {nap.openingHours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm">
              Mountain House, CA · {nap.email}
            </p>
          </div>
        }
      />

      {channels.length ? (
        <Section tone="surface">
          <div className="grid gap-6 md:grid-cols-3">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition hover:border-[color:var(--color-ink)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                  {c.label}
                </p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-medium text-[color:var(--color-ink)] group-hover:underline">
                  {c.value}
                </p>
                {c.hint ? (
                  <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                    {c.hint}
                  </p>
                ) : null}
              </a>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="muted">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="Send a note"
              title="Tell us what's on your mind."
              lede="Short or long — both are fine. We read every message and reply within one business day."
            />
          </div>
          <div className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionHeading
              eyebrow="Where we are"
              title="Based in Mountain House, CA."
              lede="Most meetings happen by video or phone. In-person available on request for Central Valley and Bay Area clients."
            />
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Service area
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {nap.areaServed.map((place) => (
                  <li
                    key={place}
                    className="rounded-full border border-[color:var(--color-border)] bg-white px-3 py-1 text-sm text-[color:var(--color-ink-soft)]"
                  >
                    {place}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Hours
              </p>
              <ul className="mt-3 space-y-1 text-[color:var(--color-ink-soft)]">
                {nap.openingHours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Reach us
              </p>
              <address className="mt-3 not-italic text-[color:var(--color-ink-soft)]">
                {nap.phone ? (
                  <div className="mt-1">
                    <a
                      href={telHref}
                      className="hover:text-[color:var(--color-ink)]"
                    >
                      {nap.phone}
                    </a>
                  </div>
                ) : null}
                {nap.email ? <div>{nap.email}</div> : null}
              </address>
            </div>
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
