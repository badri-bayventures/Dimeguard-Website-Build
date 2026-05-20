/**
 * Single source of truth for per-client configuration.
 *
 * This file is the cohort lever: swapping these values produces a near-complete
 * site for the next advisor in the "Founding 10" cohort. Anything Dimeguard-
 * specific that is NOT in this file lives in `content/` (founder bio, local
 * copy, carrier list).
 */

export type LicensedState = {
  code: string;
  name: string;
};

export type ContactChannel = {
  type: "phone" | "email" | "address" | "calendly" | "social";
  label: string;
  value: string;
  href?: string;
};

export type NavLink = {
  href: string;
  label: string;
};

export type RouteChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

/**
 * One row per crawlable route. Drives sitemap, llms.txt, default metadata,
 * and breadcrumb labels — adding a new route here cascades to all three.
 */
export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency: RouteChangeFrequency;
  llmsSummary: string;
  showInNav?: boolean;
  showInLlms?: boolean;
};

export type SiteConfig = {
  advisor: {
    fullName: string;
    firstName: string;
    title: string;
    photoSrc?: string;
    knowsLanguage: string[];
    bioSnippet: string;
  };
  business: {
    legalName: string;
    domain: string;
    url: string;
    tagline: string;
    foundedYear?: number;
    ogImage: string;
  };
  nap: {
    name: string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
    phone: string;
    email: string;
    latitude?: number;
    longitude?: number;
    openingHours: string[];
    areaServed: string[];
  };
  licensure: {
    primaryState: string;
    licensedStates: LicensedState[];
    disclosure: string;
    insuranceOnlyDisclosure: string;
  };
  carriers: string[];
  /**
   * Brand tokens. Source of truth: Direction D mockup. Surfaced as CSS
   * custom properties in globals.css. Lime `accent` is button-only; never
   * use it for body text on a light surface.
   */
  brand: {
    ink: string;
    inkSoft: string;
    accent: string;
    accentInk: string;
    secondary: string;
    surface: string;
    surfaceMuted: string;
    border: string;
    muted: string;
  };
  typography: {
    displayFontStack: string;
    bodyFontStack: string;
  };
  nav: NavLink[];
  routes: RouteMeta[];
  sameAs: {
    googleBusinessProfile?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  contact: {
    calendlyUrl: string;
    channels: ContactChannel[];
  };
  social: { label: string; href: string }[];
  analytics: {
    ga4MeasurementId: string;
    posthogPublicKey: string;
    posthogHost: string;
  };
  calculators: {
    retirement: {
      assumedAnnualReturn: number;
      drawdownYears: number;
    };
    life: {
      incomeMultiplier: number;
      perDependentMultiplier: number;
    };
  };
};

/**
 * Public site URL — used to build canonicals, OG urls, sitemap entries, and
 * llms.txt. Falls back to the production domain so previews still ship valid
 * absolute URLs in JSON-LD.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dimeguard.com"
).replace(/\/$/, "");

export const siteConfig: SiteConfig = {
  advisor: {
    fullName: "Saral Toms",
    firstName: "Saral",
    title: "Insurance & Retirement Advisor",
    knowsLanguage: ["English", "Hindi"],
    bioSnippet:
      "Saral works one-on-one with families in their 40s and 50s on insurance, retirement, and tax-aware planning — based in Mountain House, serving the Central Valley.",
  },
  business: {
    legalName: "Dimeguard",
    domain: "dimeguard.com",
    url: SITE_URL,
    tagline:
      "Insurance, retirement, and tax planning for Central Valley families.",
    ogImage: "/og/default.png",
  },
  nap: {
    name: "Dimeguard",
    streetAddress: "",
    addressLocality: "Mountain House",
    addressRegion: "CA",
    postalCode: "",
    addressCountry: "US",
    phone: "",
    email: "",
    openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-13:00"],
    areaServed: [
      "Mountain House",
      "Tracy",
      "Manteca",
      "Lathrop",
      "Stockton",
      "Modesto",
      "Central Valley",
    ],
  },
  licensure: {
    primaryState: "CA",
    licensedStates: [
      { code: "CA", name: "California" },
      { code: "TX", name: "Texas" },
      { code: "CO", name: "Colorado" },
      { code: "NJ", name: "New Jersey" },
    ],
    disclosure:
      "Licensed insurance broker in California, Texas, Colorado, and New Jersey.",
    insuranceOnlyDisclosure:
      "Insurance-only licensure. Not investment, tax, or legal advice — for informational purposes only.",
  },
  carriers: [],
  brand: {
    ink: "#143A4A",
    inkSoft: "#2C5364",
    accent: "#C8E04A",
    accentInk: "#143A4A",
    secondary: "#5BC0E8",
    surface: "#FFFFFF",
    surfaceMuted: "#F5F1E8",
    border: "#E4DFD2",
    muted: "#5F7079",
  },
  typography: {
    displayFontStack: "var(--font-display), Georgia, 'Times New Roman', serif",
    bodyFontStack: "var(--font-body), system-ui, -apple-system, sans-serif",
  },
  nav: [
    { href: "/retirement-planning", label: "Retirement" },
    { href: "/life-insurance", label: "Life Insurance" },
    { href: "/resources", label: "Resources" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ],
  routes: [
    {
      path: "/",
      title:
        "Insurance, retirement & tax planning · Mountain House, CA · Dimeguard",
      description:
        "Saral Toms helps Central Valley families think clearly about insurance, retirement, and tax coordination. Licensed insurance broker in CA, TX, CO, NJ.",
      priority: 1.0,
      changeFrequency: "weekly",
      llmsSummary:
        "Home page. Insurance, retirement, and tax-aware planning for Central Valley families, by Saral Toms.",
      showInLlms: true,
    },
    {
      path: "/retirement-planning",
      title: "Retirement planning · Free readiness check",
      description:
        "Estimate your retirement gap with a free readiness check. Designed to help families in their 40s and 50s see where they stand and what their options may be.",
      priority: 0.9,
      changeFrequency: "monthly",
      llmsSummary:
        "Retirement planning service, including a free readiness calculator that estimates gap to target income.",
      showInNav: true,
      showInLlms: true,
    },
    {
      path: "/life-insurance",
      title: "Life insurance · Human Life Value estimator",
      description:
        "Estimate the coverage your family may need with a Human Life Value calculator. Term and permanent life insurance through a licensed broker.",
      priority: 0.9,
      changeFrequency: "monthly",
      llmsSummary:
        "Life insurance service, with a Human Life Value calculator that estimates recommended coverage from income and dependents.",
      showInNav: true,
      showInLlms: true,
    },
    {
      path: "/about",
      title: "About Saral Toms · Insurance & Retirement Advisor",
      description:
        "Meet Saral Toms — a Mountain House-based insurance and retirement advisor working with Central Valley families across CA, TX, CO, and NJ.",
      priority: 0.7,
      changeFrequency: "yearly",
      llmsSummary:
        "About the founder, Saral Toms — background, approach, and states served.",
      showInNav: true,
      showInLlms: true,
    },
    {
      path: "/resources",
      title: "Planning tools & spreadsheets · Free downloads",
      description:
        "Free spreadsheets for net worth tracking and monthly budgeting, used in the conversations Saral has with clients every week.",
      priority: 0.7,
      changeFrequency: "monthly",
      llmsSummary:
        "Free downloadable planning tools — net worth tracker and monthly budget spreadsheet.",
      showInNav: true,
      showInLlms: true,
    },
    {
      path: "/blog",
      title: "Notes on planning · Dimeguard blog",
      description:
        "Plain-language notes on insurance, retirement, and tax topics that come up in client conversations.",
      priority: 0.6,
      changeFrequency: "weekly",
      llmsSummary:
        "Blog with notes on insurance, retirement, and tax topics that come up in client conversations.",
      showInNav: true,
      showInLlms: true,
    },
    {
      path: "/calculators/inflation",
      title: "Inflation calculator · See what your savings may buy",
      description:
        "Estimate how inflation may erode your savings over time. Independent calculator embedded for quick what-if math.",
      priority: 0.6,
      changeFrequency: "yearly",
      llmsSummary:
        "Inflation calculator — estimate the future purchasing power of today's savings.",
      showInLlms: true,
    },
  ],
  sameAs: {
    googleBusinessProfile: "",
    linkedin: "",
    facebook: "",
  },
  contact: {
    calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
    channels: [],
  },
  social: [],
  analytics: {
    ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "",
    posthogPublicKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
    posthogHost:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  },
  calculators: {
    retirement: {
      assumedAnnualReturn: 0.05,
      drawdownYears: 25,
    },
    life: {
      incomeMultiplier: 10,
      perDependentMultiplier: 1,
    },
  },
};

export function getRoute(path: string): RouteMeta | undefined {
  return siteConfig.routes.find((r) => r.path === path);
}

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}
