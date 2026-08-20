import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL, siteConfig } from "@/site.config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { AssistantMount } from "@/components/assistant/assistant-mount";
import { Analytics } from "@/components/analytics";
import { AnalyticsPageViews } from "@/components/analytics-page-views";
import { JsonLd } from "@/lib/schema/json-ld";
import { localBusiness, person } from "@/lib/schema";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const fullMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.business.legalName} — ${siteConfig.business.tagline}`,
    template: `%s · ${siteConfig.business.legalName}`,
  },
  description: siteConfig.business.tagline,
  applicationName: siteConfig.business.legalName,
  authors: [{ name: siteConfig.advisor.fullName }],
  creator: siteConfig.advisor.fullName,
  publisher: siteConfig.business.legalName,
  robots: { index: true, follow: true },
  alternates: {
    types: {
      "application/rss+xml": [
        {
          url: "/blog/rss.xml",
          title: `${siteConfig.business.legalName} — Notes on planning`,
        },
      ],
    },
  },
};

/**
 * Offline hold (see `siteConfig.maintenance`): neutral metadata only — no
 * brand name, author or publisher — and an explicit noindex.
 */
const offlineMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: "Temporarily offline" },
  description: "This site is temporarily offline.",
  robots: { index: false, follow: false, nocache: true },
};

export const metadata: Metadata = siteConfig.maintenance.enabled
  ? offlineMetadata
  : fullMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const htmlClassName = `${fraunces.variable} ${inter.variable} h-full antialiased`;
  const bodyClassName =
    "min-h-full flex flex-col bg-[color:var(--color-surface)] text-[color:var(--color-ink)]";

  // Offline hold: bare shell — no header, footer, assistant, analytics,
  // cookie banner or structured data. Middleware rewrites every route to
  // /offline, so `children` is always the holding page here.
  if (siteConfig.maintenance.enabled) {
    return (
      <html lang="en" className={htmlClassName} suppressHydrationWarning>
        <body className={bodyClassName} suppressHydrationWarning>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={htmlClassName} suppressHydrationWarning>
      <body className={bodyClassName} suppressHydrationWarning>
        {/*
          Site-wide structured data. Rendered in the body (not an explicit
          <head>) to match how every page renders its page-specific JSON-LD
          and to avoid manual <head> management in the App Router, which
          React 19 reconciles specially. Google reads JSON-LD from the body.
        */}
        <JsonLd data={localBusiness(siteConfig)} id="ld-localbusiness" />
        <JsonLd data={person(siteConfig)} id="ld-person" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-[color:var(--color-ink)] focus:px-3 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <AssistantMount />
        <CookieConsent />
        <Analytics />
        <AnalyticsPageViews />
      </body>
    </html>
  );
}
