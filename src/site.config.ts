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

export type SiteConfig = {
  advisor: {
    fullName: string;
    firstName: string;
    title: string;
    photoSrc?: string;
  };
  business: {
    legalName: string;
    domain: string;
    tagline: string;
    foundedYear?: number;
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
  };
  licensure: {
    primaryState: string;
    licensedStates: LicensedState[];
    disclosure: string;
    insuranceOnlyDisclosure: string;
  };
  carriers: string[];
  /**
   * Brand tokens. Values are surfaced as CSS custom properties in globals.css
   * so swapping the palette for advisor #2 is a one-file change.
   * Source of truth: Direction D mockup (Modern Trusted-Pro / Brand Palette).
   * WCAG: `accent` is bright lime — only use as a button background paired with
   * `ink` text. Never use `accent` for body text on light surfaces.
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

export const siteConfig: SiteConfig = {
  advisor: {
    fullName: "Saral Toms",
    firstName: "Saral",
    title: "Insurance & Retirement Advisor",
  },
  business: {
    legalName: "Dimeguard",
    domain: "dimeguard.com",
    tagline:
      "Insurance, retirement, and tax planning for Central Valley families.",
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
