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

/**
 * Nav links are shared between header and footer. `primary: true` items
 * appear in the top-of-page primary nav; everything else (Blog, Resources,
 * etc.) is footer-only.
 */
export type NavLink = {
  href: string;
  label: string;
  primary: boolean;
};

export type LegalLink = {
  href: string;
  label: string;
};

export type Carrier = {
  name: string;
  /** Optional path under /public — when present, renders as <Image>. */
  logoPath?: string;
};

export type TrustStripItem = {
  /** Large display line (e.g. "20 min", "CA · TX · CO · NJ"). */
  top: string;
  /** Small descriptor below. */
  bottom: string;
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
  /** ISO date for sitemap lastmod. Per-route so editors can stamp real edits. */
  lastModified: string;
  llmsSummary: string;
  showInNav?: boolean;
  showInLlms?: boolean;
  /**
   * Whether this route belongs to the canonical site map. When false, the
   * route still has metadata + a live page but is excluded from sitemap.xml
   * and llms.txt — e.g. /contact, which we keep navigable but don't list as
   * one of the 7 indexable surfaces.
   */
  canonical?: boolean;
};

export type Founder = {
  name: string;
  role: string;
  photoSrc?: string;
  /** 2–3 short paragraphs. Each entry renders as its own <p>. */
  bioParagraphs: string[];
  knowsLanguage: string[];
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
  /**
   * Founder roster for /about. Designed for 1 OR 2 entries — the layout
   * gracefully degrades. Seed with one entry until Saral confirms a second
   * founder's public-inclusion decision.
   */
  founders: Founder[];
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
  carriers: Carrier[];
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
  /**
   * Top trust bar that sits above the primary nav. Set `enabled: false` to
   * remove for advisors that don't want it. The right-column string is
   * INSURANCE-ONLY-SAFE by default; to add "FIDUCIARY · " back (e.g. for
   * an advisor with RIA capacity) prepend it to `right`.
   */
  topTrustBar: {
    enabled: boolean;
    left: string;
    right: string;
  };
  /** Header location pin shown to the right of the primary nav. */
  locationPin: {
    enabled: boolean;
    label: string;
  };
  /** Copy for the two CTAs that appear most often. Cohort-tunable. */
  ctaLabels: {
    bookCall: string;
    runNumber: string;
  };
  /** Optional pill ("Accepting new clients") rendered above the hero H1. */
  heroBadge: {
    enabled: boolean;
    label: string;
  };
  /** 4-column trust strip beneath the hero CTAs. */
  heroTrustStrip: TrustStripItem[];
  /** Bottom-of-page carrier logo strip. */
  carrierStrip: {
    enabled: boolean;
    eyebrow: string;
  };
  nav: NavLink[];
  /** Footer-only links (Privacy, Terms, etc.). Kept separate from `nav`. */
  legalLinks: LegalLink[];
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
      /** Pre-retirement assumed annual return (accumulation phase). */
      assumedAnnualReturnPre: number;
      /** In-retirement assumed annual return (drawdown phase). */
      assumedAnnualReturnPost: number;
      drawdownYears: number;
      teaserDefaults: {
        currentAge: number;
        targetRetirementAge: number;
        currentSavings: number;
        monthlySpend: number;
        monthlyContribution: number;
      };
    };
    life: {
      incomeMultiplier: number;
      perDependentMultiplier: number;
      teaserDefaults: {
        dependents: number;
        existingCoverage: number;
      };
    };
  };
  /**
   * Opt-in inline calculator teaser in the hero. Off-cohort advisors can
   * disable or swap to the life-value teaser by flipping these values.
   */
  heroCalcTeaser: {
    enabled: boolean;
    calculator: "retirement" | "life_value";
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
    photoSrc: "/founders/saral.png",
    knowsLanguage: ["English", "Hindi"],
    bioSnippet:
      "Saral works one-on-one with first-generation families in their 40s and 50s on insurance, retirement, and tax-aware planning — based in Mountain House, serving the Central Valley.",
  },
  // Second founder entry stays commented out until Saral confirms his business
  // partner's public-inclusion decision.
  founders: [
    {
      name: "Saral Toms",
      role: "Insurance & Retirement Advisor",
      photoSrc: "/founders/saral.png",
      knowsLanguage: ["English", "Hindi"],
      bioParagraphs: [
        "I arrived in the United States in 2013 and spent the next six years inside the insurance industry on the IT side, supporting the platforms a major insurance company ran its business on. From that seat I could see how the systems worked — and I could also see that the families on the other end of those systems were navigating some of the biggest financial decisions of their lives essentially blind.",
        "Once I got my permanent residency and started facing my own long-term financial decisions, the gap became personal. \"despite being well-educated and working inside the insurance industry, I had never been properly taught how money really works.\" So I went and learned it — self-taught, then formally — and got licensed as a life insurance broker so I could sit on the other side of the table and actually help.",
        "I bring an engineer's mindset to this work. That means building protective systems around a family's plan instead of selling products into it, leading with education instead of pressure, and keeping the practice deliberately small so every household gets real attention. The work spans insurance, tax planning, retirement protection, and estate planning — coordinated, not sold piece by piece.",
      ],
    },
    // Uncomment and edit when Saral confirms his partner's public-inclusion decision.
    // {
    //   name: "TODO[saral]: Partner name",
    //   role: "TODO[saral]: Partner role",
    //   photoSrc: undefined,
    //   knowsLanguage: ["English"],
    //   bioParagraphs: ["TODO[saral]: 2–3 paragraph partner bio."],
    // },
  ],
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
  // Names are placeholders until Saral delivers his actual carrier list.
  // Drop a logo into /public/carriers/ and set `logoPath` to render it.
  carriers: [
    { name: "Carrier A" },
    { name: "Carrier B" },
    { name: "Carrier C" },
    { name: "Carrier D" },
    { name: "Carrier E" },
    { name: "+1 more" },
  ],
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
  // NOTE: "FIDUCIARY" deliberately omitted. Insurance-only brokers operate
  // under the suitability standard. To add it back, prepend "FIDUCIARY · "
  // to `right`.
  topTrustBar: {
    enabled: true,
    left: "INDEPENDENT INSURANCE BROKER · INSURANCE-ONLY",
    right: "20-MIN FIRST CALL · NO SCRIPT, NO SALES PITCH",
  },
  locationPin: {
    enabled: true,
    label: "Mountain House, CA",
  },
  ctaLabels: {
    bookCall: "Book a 20-min call",
    runNumber: "Run my retirement number",
  },
  heroBadge: {
    enabled: true,
    label: "Accepting new clients",
  },
  heroTrustStrip: [
    { top: "20 min", bottom: "first call · no script" },
    { top: "Independent", bottom: "no carrier captive contract" },
    { top: "$0", bottom: "to run your number" },
    { top: "Multi-carrier", bottom: "independent broker" },
  ],
  carrierStrip: {
    enabled: true,
    eyebrow: "INDEPENDENT · WE PLACE ACROSS MULTIPLE CARRIERS",
  },
  nav: [
    { href: "/", label: "Home", primary: true },
    { href: "/retirement-planning", label: "Retirement Planning", primary: true },
    // URL stays /life-insurance until Saral confirms disability scope on Friday.
    { href: "/life-insurance", label: "Life & Disability", primary: true },
    { href: "/calculators/inflation", label: "Calculators", primary: true },
    { href: "/about", label: "About", primary: true },
    { href: "/contact", label: "Contact", primary: true },
    { href: "/blog", label: "Blog", primary: false },
    { href: "/resources", label: "Resources", primary: false },
  ],
  legalLinks: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
  routes: [
    {
      path: "/",
      title:
        "Insurance, retirement & tax planning · Mountain House, CA · Dimeguard",
      description:
        "Saral Toms helps Central Valley families think clearly about insurance, retirement, and tax coordination. Independent insurance broker — first call is 20 minutes, no script, no sales pitch.",
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: "2026-05-25",
      llmsSummary:
        "Home page. Insurance, retirement, and tax-aware planning for Central Valley families, by Saral Toms.",
      showInLlms: true,
      canonical: true,
    },
    {
      path: "/retirement-planning",
      title: "Retirement planning · Dimeguard",
      description:
        "A 20-minute first call about your current savings, target retirement age, Social Security timing, and tax-bucket coordination. Designed for families in their 40s and 50s.",
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: "2026-05-18",
      llmsSummary:
        "Retirement planning service — a first call covers current savings, target retirement age, Social Security timing, and tax-bucket coordination.",
      showInNav: true,
      showInLlms: true,
      canonical: true,
    },
    {
      path: "/life-insurance",
      title: "Life & disability · Dimeguard",
      description:
        "A short conversation about income to replace, dependents, existing coverage, and whether term or permanent insurance may fit your situation. Independent broker.",
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: "2026-05-18",
      llmsSummary:
        "Life and disability insurance — a first call covers income to replace, dependents, existing employer coverage, and the term-vs-permanent fit.",
      showInNav: true,
      showInLlms: true,
      canonical: true,
    },
    {
      path: "/about",
      title: "About Saral Toms · Insurance & Retirement Advisor",
      description:
        "Meet Saral Toms — a Mountain House-based insurance and retirement advisor working with Central Valley families on retirement, life, and tax-aware planning.",
      priority: 0.7,
      changeFrequency: "yearly",
      lastModified: "2026-05-12",
      llmsSummary:
        "About the founder, Saral Toms — background, approach, and states served.",
      showInNav: true,
      showInLlms: true,
      canonical: true,
    },
    {
      path: "/resources",
      title: "Planning tools & spreadsheets · Free downloads",
      description:
        "Free spreadsheets for net worth tracking and monthly budgeting, used in the conversations Saral has with clients every week.",
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: "2026-05-15",
      llmsSummary:
        "Free downloadable planning tools — net worth tracker and monthly budget spreadsheet.",
      showInNav: true,
      showInLlms: true,
      canonical: true,
    },
    {
      path: "/blog",
      title: "Notes on planning · Dimeguard blog",
      description:
        "Plain-language notes on insurance, retirement, and tax topics that come up in client conversations.",
      priority: 0.6,
      changeFrequency: "weekly",
      lastModified: "2026-05-22",
      llmsSummary:
        "Blog with notes on insurance, retirement, and tax topics that come up in client conversations.",
      showInNav: true,
      showInLlms: true,
      canonical: true,
    },
    {
      // Contact page exists for visitors but is intentionally excluded from
      // the 7-route canonical sitemap + llms.txt — it's a low-value
      // duplicate of the contact info already exposed on every page (footer
      // NAP, header Calendly CTA, /about reach-out block).
      path: "/contact",
      title: "Contact Saral Toms · Dimeguard",
      description:
        "Three ways to reach Saral — email, a 20-minute Calendly call, or the contact form. Based in Mountain House, CA; serving the Central Valley.",
      priority: 0.8,
      changeFrequency: "yearly",
      lastModified: "2026-05-12",
      llmsSummary:
        "Contact page — email, phone, Calendly link, and a short message form for reaching Saral Toms.",
      showInNav: true,
      canonical: false,
    },
    {
      path: "/calculators/inflation",
      title: "Inflation calculator · See what your savings may buy",
      description:
        "Estimate how inflation may erode your savings over time. Independent calculator embedded for quick what-if math.",
      priority: 0.6,
      changeFrequency: "yearly",
      lastModified: "2026-05-10",
      llmsSummary:
        "Inflation calculator — estimate the future purchasing power of today's savings.",
      showInLlms: true,
      canonical: true,
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
      assumedAnnualReturnPre: 0.07,
      assumedAnnualReturnPost: 0.05,
      drawdownYears: 25,
      teaserDefaults: {
        currentAge: 45,
        targetRetirementAge: 65,
        currentSavings: 125000,
        monthlySpend: 6000,
        monthlyContribution: 1500,
      },
    },
    life: {
      incomeMultiplier: 10,
      perDependentMultiplier: 1,
      teaserDefaults: {
        dependents: 2,
        existingCoverage: 0,
      },
    },
  },
  heroCalcTeaser: {
    enabled: true,
    calculator: "retirement",
  },
};

export function getRoute(path: string): RouteMeta | undefined {
  return siteConfig.routes.find((r) => r.path === path);
}

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}
