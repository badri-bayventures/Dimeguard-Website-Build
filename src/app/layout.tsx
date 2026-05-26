import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL, siteConfig } from "@/site.config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/lib/schema/json-ld";
import { localBusiness, person } from "@/lib/schema";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Site-wide structured data lives in <head> so every page's
          view-source shows LocalBusiness + Person inline at the top of the
          document. Page-specific blocks (FAQPage, FinancialService,
          BreadcrumbList) are rendered from each page body — Google
          explicitly supports JSON-LD in either head or body, and Next.js
          App Router has no supported per-page <head> script injection.
        */}
        <JsonLd data={localBusiness(siteConfig)} id="ld-localbusiness" />
        <JsonLd data={person(siteConfig)} id="ld-person" />
      </head>
      <body
        className="min-h-full flex flex-col bg-[color:var(--color-surface)] text-[color:var(--color-ink)]"
        suppressHydrationWarning
      >
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
      </body>
    </html>
  );
}
