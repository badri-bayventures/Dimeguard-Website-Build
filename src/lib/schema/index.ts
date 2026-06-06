/**
 * JSON-LD builders. Pure functions only — no React, no I/O, no env reads.
 * All config flows in as arguments so these are trivially testable and
 * cohort-portable: every builder takes the slice of `site.config.ts` it
 * needs, plus per-call args.
 */

import { absoluteUrl, type SiteConfig } from "@/site.config";

type JsonLdObject = Record<string, unknown>;

export type FaqItemInput = {
  question: string;
  answerText: string;
};

export type BreadcrumbCrumb = {
  name: string;
  path: string;
};

export type ArticleInput = {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
  authorName?: string;
};

function organizationRef(config: SiteConfig): JsonLdObject {
  return {
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: config.business.legalName,
    url: config.business.url,
    logo: absoluteUrl("/icon.png"),
  };
}

export function localBusiness(config: SiteConfig): JsonLdObject {
  const sameAs = Object.values(config.sameAs).filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
  return {
    "@context": "https://schema.org",
    // Multi-type so the block satisfies both LocalBusiness (for Google's
    // local pack) and FinancialService (for the agent-specific facets).
    // Validators accept type arrays.
    "@type": ["LocalBusiness", "FinancialService"],
    "@id": `${absoluteUrl("/")}#localbusiness`,
    name: config.business.legalName,
    url: config.business.url,
    description: config.business.tagline,
    image: absoluteUrl(config.business.ogImage),
    address: {
      "@type": "PostalAddress",
      streetAddress: config.nap.streetAddress || undefined,
      addressLocality: config.nap.addressLocality,
      addressRegion: config.nap.addressRegion,
      postalCode: config.nap.postalCode || undefined,
      addressCountry: config.nap.addressCountry,
    },
    geo:
      config.nap.latitude && config.nap.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: config.nap.latitude,
            longitude: config.nap.longitude,
          }
        : undefined,
    telephone: config.nap.phone || undefined,
    email: config.nap.email || undefined,
    openingHours: config.nap.openingHours,
    areaServed: [
      ...config.nap.areaServed.map((name) => ({
        "@type": "Place",
        name,
      })),
      ...config.licensure.licensedStates.map((s) => ({
        "@type": "State",
        name: s.name,
      })),
    ],
    knowsLanguage: config.advisor.knowsLanguage,
    sameAs: sameAs.length ? sameAs : undefined,
    founder: {
      "@type": "Person",
      "@id": `${absoluteUrl("/about")}#person`,
      name: config.advisor.fullName,
    },
  };
}

export function person(config: SiteConfig): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl("/about")}#person`,
    name: config.advisor.fullName,
    jobTitle: config.advisor.title,
    knowsLanguage: config.advisor.knowsLanguage,
    image: config.advisor.photoSrc
      ? absoluteUrl(config.advisor.photoSrc)
      : undefined,
    worksFor: {
      "@type": "FinancialService",
      "@id": `${absoluteUrl("/")}#localbusiness`,
      name: config.business.legalName,
      url: config.business.url,
    },
  };
}

export function financialService(
  config: SiteConfig,
  args: {
    serviceType: string;
    path: string;
    description: string;
  },
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `${args.serviceType} · ${config.business.legalName}`,
    serviceType: args.serviceType,
    url: absoluteUrl(args.path),
    description: args.description,
    provider: organizationRef(config),
    areaServed: [
      ...config.nap.areaServed.map((name) => ({
        "@type": "Place",
        name,
      })),
      ...config.licensure.licensedStates.map((s) => ({
        "@type": "State",
        name: s.name,
      })),
    ],
  };
}

export function faqPage(items: FaqItemInput[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answerText,
      },
    })),
  };
}

export function article(
  config: SiteConfig,
  input: ArticleInput,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.imageUrl
      ? [input.imageUrl]
      : [absoluteUrl(config.business.ogImage)],
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Person",
      "@id": `${absoluteUrl("/about")}#person`,
      name: input.authorName ?? config.advisor.fullName,
    },
    publisher: organizationRef(config),
  };
}

export function blogPosting(
  config: SiteConfig,
  input: ArticleInput,
): JsonLdObject {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: input.imageUrl
      ? [input.imageUrl]
      : [absoluteUrl(config.business.ogImage)],
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Person",
      "@id": `${absoluteUrl("/about")}#person`,
      name: input.authorName ?? config.advisor.fullName,
    },
    publisher: organizationRef(config),
  };
}

export function breadcrumb(crumbs: BreadcrumbCrumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
