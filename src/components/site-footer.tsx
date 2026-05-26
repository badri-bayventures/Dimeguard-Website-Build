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
        <div className="md:col-span-5">
          <Image
            src="/logo-padded.png"
            alt={siteConfig.business.legalName}
            width={1280}
            height={1024}
            className="h-14 w-auto brightness-0 invert"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            {siteConfig.business.tagline}
          </p>
          <address className="mt-6 not-italic text-sm leading-relaxed text-white/70">
            <div className="text-white">{siteConfig.nap.name}</div>
            <div>
              {siteConfig.nap.addressLocality}, {siteConfig.nap.addressRegion}{" "}
              {siteConfig.nap.postalCode}
            </div>
            {siteConfig.nap.phone ? <div>{siteConfig.nap.phone}</div> : null}
            {siteConfig.nap.email ? <div>{siteConfig.nap.email}</div> : null}
          </address>
        </div>
        <div className="md:col-span-3">
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
        <div className="md:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
            Licensure
          </p>
          <p className="mt-4 text-sm text-white/80">
            Licensed insurance broker · California-based · Serving the Central
            Valley and beyond.
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
                key={s.href}
                href={s.href}
                className="hover:text-[color:var(--color-accent)]"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
