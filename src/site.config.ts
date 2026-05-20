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
  };
  carriers: string[];
  brand: {
    color: string;
    colorForeground: string;
    accentColor: string;
  };
  contact: {
    calendlyUrl: string;
    channels: ContactChannel[];
  };
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
    tagline: "Insurance, retirement, and tax planning for Central Valley families.",
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
      "Insurance-only licensure. Not investment, tax, or legal advice — for informational purposes only.",
  },
  carriers: [],
  brand: {
    color: "#0f3d2e",
    colorForeground: "#ffffff",
    accentColor: "#c8a45c",
  },
  contact: {
    calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
    channels: [],
  },
  analytics: {
    ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "",
    posthogPublicKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
    posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
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
