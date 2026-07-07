"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";
import { ButtonLink } from "./button";
import { Container } from "./container";
import { TopTrustBar } from "./top-trust-bar";

export function SiteHeader() {
  const primaryNav = siteConfig.nav.filter((item) => item.primary);
  const { locationPin, ctaLabels } = siteConfig;
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on viewport resize past the md breakpoint so the
  // open state doesn't desync from CSS visibility.
  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  return (
    <div className="sticky top-0 z-40 bg-[color:var(--color-surface)]/90 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-surface)]/80">
      <TopTrustBar />
      <header className="border-b border-[color:var(--color-border)]">
        <Container className="flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            aria-label={`${siteConfig.business.legalName} — home`}
            className="flex items-center"
            onClick={() => setMenuOpen(false)}
          >
            {/* Full-color vertical lockup for light backgrounds: the header
                sits on the light --color-surface, so the primary (colored)
                variant is used here. */}
            <Image
              src="/dimeguard-logo-primary.png"
              alt={siteConfig.business.legalName}
              width={1280}
              height={1371}
              priority
              className="h-14 w-auto"
            />
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 md:flex lg:gap-8"
          >
            {primaryNav.map((item) => (
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
            {locationPin.enabled ? (
              <span
                className="hidden items-center gap-1.5 text-xs font-medium text-[color:var(--color-muted)] lg:inline-flex"
                aria-label={`Located in ${locationPin.label}`}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M8 14s-5-4.5-5-8a5 5 0 1 1 10 0c0 3.5-5 8-5 8z" />
                  <circle cx="8" cy="6" r="1.6" fill="currentColor" stroke="none" />
                </svg>
                {locationPin.label}
              </span>
            ) : null}
            <div className="hidden sm:block">
              <ButtonLink href="/book?source=footer" size="md">
                {ctaLabels.bookCall} →
              </ButtonLink>
            </div>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[color:var(--color-border)] text-[color:var(--color-ink)] transition-transform duration-150 ease-out active:scale-[0.98] motion-reduce:transform-none hover:bg-[color:var(--color-surface-muted)] md:hidden"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </Container>
        {menuOpen ? (
          <div
            id="primary-mobile-nav"
            className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] md:hidden"
          >
            <Container className="py-4">
              <nav aria-label="Mobile primary" className="flex flex-col">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-2.5 text-base font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {locationPin.enabled ? (
                <p className="mt-3 text-xs font-medium text-[color:var(--color-muted)]">
                  📍 {locationPin.label}
                </p>
              ) : null}
              <div className="mt-4">
                <ButtonLink
                  href="/book?source=footer"
                  size="md"
                  className="w-full justify-center"
                >
                  {ctaLabels.bookCall} →
                </ButtonLink>
              </div>
            </Container>
          </div>
        ) : null}
      </header>
    </div>
  );
}
