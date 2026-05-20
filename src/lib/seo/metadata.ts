import type { Metadata } from "next";
import { siteConfig, absoluteUrl, getRoute } from "@/site.config";

export type PageMetaInput = {
  /** Route path. Used as the lookup key into siteConfig.routes for defaults. */
  path: string;
  /** Optional overrides — fall back to the route entry, then the site default. */
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  /** If true, robots will index. Defaults to true. */
  index?: boolean;
};

/**
 * Single helper that builds a Metadata object from the route map + per-page
 * overrides. Centralizing this means every page has a canonical, OG, and
 * Twitter set with no duplication and no drift.
 */
export function buildMetadata(input: PageMetaInput): Metadata {
  const route = getRoute(input.path);
  const title = input.title ?? route?.title ?? siteConfig.business.legalName;
  const description =
    input.description ?? route?.description ?? siteConfig.business.tagline;
  const canonical = absoluteUrl(input.path);
  const ogImageUrl = absoluteUrl(input.ogImage ?? siteConfig.business.ogImage);
  const index = input.index ?? true;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: input.ogType ?? "website",
      url: canonical,
      siteName: siteConfig.business.legalName,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteConfig.business.legalName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
