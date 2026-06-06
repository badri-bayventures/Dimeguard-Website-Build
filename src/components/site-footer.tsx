import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/site.config";
import { Container } from "./container";

export function SiteFooter() {
  const year = new Date().getFullYear();
  // Per Direction D mockup, footer "Explore" column is the secondary surface:
  // footer-only nav items (Blog, Resources) — primary nav already lives in
  // the header. Legal + social go in the bottom bar.
  const footerNav = siteConfig.nav.filter((item) => !item.primary);
  return (
    <footer className="mt-24 border-t border-[color:var(--color-border)] bg-[color:var(--color-ink)] text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Image
            src="/logo.png"
            alt={siteConfig.business.legalName}
            width={1280}
            height={1026}
            className="h-24 w-auto md:h-28"
          />
          <address className="mt-6 not-italic text-sm leading-relaxed text-white/70">
            <div className="text-white">{siteConfig.nap.name}</div>
            <div>
              {siteConfig.nap.addressLocality}, {siteConfig.nap.addressRegion}{" "}
              {siteConfig.nap.postalCode}
            </div>
            {siteConfig.nap.phone ? (
              <div>
                <a
                  href={`tel:${siteConfig.nap.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-[color:var(--color-accent)]"
                >
                  {siteConfig.nap.phone}
                </a>
              </div>
            ) : null}
            {siteConfig.nap.email ? <div>{siteConfig.nap.email}</div> : null}
          </address>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[color:var(--color-accent)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
            Services
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {siteConfig.serviceLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[color:var(--color-accent)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
            Licensure
          </p>
          <p className="mt-4 text-sm text-white/80">
            {siteConfig.licensure.disclosure}
          </p>
          <p className="mt-2 text-sm text-white/80">
            CA Insurance Lic. #{siteConfig.licensure.licenseNumber}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-white/60">
            {siteConfig.licensure.insuranceOnlyDisclosure}
          </p>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-start justify-between gap-3 py-5 text-xs text-white/60 md:flex-row md:items-center">
          <div suppressHydrationWarning>
            © {year} {siteConfig.business.legalName}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            {siteConfig.legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-[color:var(--color-accent)]"
              >
                {l.label}
              </Link>
            ))}
            {siteConfig.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                title={s.label}
                className="text-white/60 transition hover:text-[color:var(--color-accent)]"
                rel="noopener noreferrer"
              >
                <SocialIcon label={s.label} />
              </a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}

function SocialIcon({ label }: { label: string }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    "aria-hidden": true,
  } as const;
  switch (label.toLowerCase()) {
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.3c0-.85.24-1.43 1.46-1.43h1.46V5.27A19 19 0 0 0 14.6 5.1c-2.1 0-3.6 1.3-3.6 3.68v2.32H8.5V14h2.5v7h2.5z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M17.53 3h3.18l-6.95 7.94L22 21h-6.4l-5-6.55L4.86 21H1.68l7.43-8.49L2 3h6.56l4.52 5.98L17.53 3zm-1.12 16.1h1.76L7.68 4.8H5.8l10.6 14.3z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M6.94 7.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88zM5.2 9h3.48v11.5H5.2V9zm6.06 0h3.34v1.57h.05c.46-.88 1.6-1.8 3.29-1.8 3.52 0 4.17 2.32 4.17 5.33v6.4h-3.48v-5.67c0-1.35-.02-3.1-1.88-3.1-1.89 0-2.18 1.47-2.18 2.99v5.78h-3.48V9z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return <span className="text-xs">{label}</span>;
  }
}
