import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ButtonLink } from "./button";
import { Container } from "./container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/85 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-surface)]/70">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[color:var(--color-ink)]"
        >
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--color-ink)] text-[color:var(--color-accent)] text-sm font-bold"
          >
            D
          </span>
          {siteConfig.business.legalName}
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 md:flex"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ButtonLink
            href={
              siteConfig.contact.calendlyUrl ||
              "/retirement-planning#calculator"
            }
            size="md"
          >
            Book a 15-min call
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
