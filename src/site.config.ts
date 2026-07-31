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

export type CarrierLogo = {
  /** Real brand name — also used verbatim as image alt text. */
  name: string;
  /** Filename under /public/carriers (e.g. "nationwide.svg"). */
  file: string;
  /** Insurance carrier vs estate/trust-planning partner. */
  type: "carrier" | "partner";
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
    /** E.164 form of `phone` for tel: links and JSON-LD `telephone`. */
    phoneE164: string;
    email: string;
    latitude?: number;
    longitude?: number;
    openingHours: string[];
    areaServed: string[];
  };
  licensure: {
    primaryState: string;
    licensedStates: LicensedState[];
    /** CA Department of Insurance license number (display only). */
    licenseNumber: string;
    disclosure: string;
    insuranceOnlyDisclosure: string;
  };
  /** Independent / multi-carrier trust band on the homepage. */
  carriers: {
    enabled: boolean;
    items: CarrierLogo[];
  };
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
  nav: NavLink[];
  /** Footer-only links (Privacy, Terms, etc.). Kept separate from `nav`. */
  legalLinks: LegalLink[];
  /**
   * Secondary service pages (401(k) rollovers, annuities, etc.). Footer-only —
   * deliberately kept out of the primary header nav.
   */
  serviceLinks: LegalLink[];
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
        /** Pre-retirement expected annual return (decimal). */
        expectedReturn: number;
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
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dimeguard.com"
).replace(/\/$/, "");

export const siteConfig: SiteConfig = {
  advisor: {
    fullName: "Saral Toms",
    firstName: "Saral",
    title: "Senior Financial Planner",
    photoSrc: "/founders/saral.png",
    knowsLanguage: ["English", "Hindi"],
    bioSnippet:
      "Saral works one-on-one with first-generation families in their 40s and 50s on insurance, retirement, and tax-aware planning — serving the Central Valley, Tri-Valley, and Bay Area.",
  },
  // Second founder entry stays commented out until Saral confirms his business
  // partner's public-inclusion decision.
  founders: [
    {
      name: "Saral Toms",
      role: "Senior Financial Planner",
      photoSrc: "/founders/saral.png",
      knowsLanguage: ["English", "Hindi"],
      bioParagraphs: [
        "I arrived in the United States in 2013 with a suitcase, a work visa, and the same dream most immigrants carry. I spent the next six years in the IT industry, working full-time on technology projects for major insurance companies — implementing systems, supporting large insurance platforms, and solving complex software problems from the inside. From that seat I saw something most people never see: the products millions of families rely on — life insurance, retirement tools, financial protection strategies — are routinely misunderstood by the very people they're meant to help.",
        "When I received my permanent residency and started making my own decisions about health insurance, life insurance, taxes, and retirement, something became obvious. Despite being well-educated and working inside the insurance industry, I had never been properly taught how money really works. No one had explained tax strategies. No one had explained how life insurance could be used for wealth building. No one had explained how families actually protect their financial future. So I began my own financial education — and what started as a personal need turned into a mission. I went on to earn my life insurance licenses.",
        "My background is different from most planners. Many advisors enter this field through sales; I entered it through education and lived experience, including the experience of building a future in a new country. I also bring an engineer's mindset to this work — analyzing financial strategies the way an engineer analyzes systems, looking for efficiency, long-term impact, and hidden risks. The goal is simple: take the strategies that wealthy families use and make them understandable for everyday families. Not through pressure. Not through sales tactics. Through education — across life insurance, tax-efficient planning, retirement protection, and estate planning.",
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
      "Insurance, retirement, and tax planning for Central Valley, Tri-Valley, and Bay Area families.",
    ogImage: "/og/default.png",
  },
  nap: {
    name: "Dimeguard",
    streetAddress: "",
    addressLocality: "Mountain House",
    addressRegion: "CA",
    postalCode: "",
    addressCountry: "US",
    phone: "209-884-2023",
    phoneE164: "+12098842023",
    email: "hello@dimeguard.com",
    openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-13:00"],
    areaServed: ["Central Valley", "Tri-Valley", "Bay Area"],
  },
  licensure: {
    primaryState: "CA",
    licensedStates: [
      { code: "CA", name: "California" },
      { code: "TX", name: "Texas" },
      { code: "CO", name: "Colorado" },
      { code: "NJ", name: "New Jersey" },
    ],
    licenseNumber: "4344549",
    disclosure:
      "Licensed in California, serving clients across the nation.",
    insuranceOnlyDisclosure:
      "Insurance-only licensure. Not investment, tax, or legal advice — for informational purposes only.",
  },
  // Independent / multi-carrier trust band on the homepage. Logos live in
  // /public/carriers; `file` is the filename, `name` doubles as alt text.
  // `type` separates insurance carriers from estate/trust-planning partners.
  // Rendered from config only — never hardcode logo paths in the component.
  carriers: {
    enabled: true,
    items: [
      { name: "Nationwide", file: "nationwide.svg", type: "carrier" },
      { name: "Mutual of Omaha", file: "mutual-of-omaha.svg", type: "carrier" },
      {
        name: "Corebridge Financial",
        file: "corebridge-financial.svg",
        type: "carrier",
      },
      {
        name: "F&G Annuities & Life",
        file: "fg-annuities-life.svg",
        type: "carrier",
      },
      {
        name: "Foresters Financial",
        file: "foresters-financial.svg",
        type: "carrier",
      },
      { name: "IMG Global", file: "img-global.svg", type: "carrier" },
      {
        name: "National Life Group",
        file: "national-life-group.png",
        type: "carrier",
      },
      { name: "North American", file: "north-american.png", type: "carrier" },
      { name: "Allianz", file: "allianz.png", type: "carrier" },
      { name: "NetLaw", file: "netlaw.svg", type: "partner" },
      { name: "TrusteeFriend", file: "trusteefriend.png", type: "partner" },
    ],
  },
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
  // NOTE: "FIDUCIARY" deliberately omitted. Insurance-only agents operate
  // under the suitability standard. To add it back, prepend "FIDUCIARY · "
  // to `right`.
  topTrustBar: {
    enabled: true,
    left: "Independent, multi-carrier agency",
    right: "20-MIN FIRST CALL · NO SCRIPT, NO SALES PITCH",
  },
  locationPin: {
    enabled: true,
    label: "Central Valley, CA",
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
    { top: "Independent", bottom: "not tied to one carrier" },
    { top: "$0", bottom: "to run your number" },
    { top: "No pressure", bottom: "nothing pitched on the first call" },
  ],
  // TODO[badri]: re-enable Calculators in M2 when real calculator pages ship.
  nav: [
    { href: "/retirement-planning", label: "Retirement Planning", primary: true },
    // URL stays /life-insurance; disability/LTC content lives inside the page.
    { href: "/life-insurance", label: "Life Insurance", primary: true },
    { href: "/blog", label: "Blog", primary: true },
    // About is HIDDEN for now — Saral's personal presence removed from the
    // visible flow. Uncomment to restore it to the header nav.
    // { href: "/about", label: "About", primary: true },
    { href: "/contact", label: "Contact", primary: true },
    { href: "/resources", label: "Resources", primary: false },
  ],
  legalLinks: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
  serviceLinks: [
    // Staggered release. Released: 401(k) Rollovers (2026-07-31).
    // Next wave: one more page week of 2026-08-10, remainder post-launch.
    { href: "/401k-rollovers", label: "401(k) Rollovers" },
    // { href: "/annuities", label: "Annuities & Retirement Income" },
    // { href: "/tax-planning", label: "Tax-Efficient Planning" },
    // { href: "/estate-planning", label: "Estate Planning" },
  ],
  routes: [
    {
      path: "/",
      title:
        "Insurance, retirement & tax planning · Central Valley, CA · Dimeguard",
      description:
        "Dimeguard helps families think clearly about insurance, retirement, and tax coordination. Multi-carrier independent agent — first call is 20 minutes, no script, no sales pitch.",
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: "2026-05-25",
      llmsSummary:
        "Home page. Insurance, retirement, and tax-aware planning for Central Valley, Tri-Valley, and Bay Area families.",
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
        "A short conversation about income to replace, dependents, existing coverage, and whether term or permanent insurance may fit your situation. Multi-carrier independent agent.",
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
      title: "About Saral Toms · Senior Financial Planner",
      description:
        "Meet Saral Toms — a California-based senior financial planner working with Central Valley families on retirement, life, and tax-aware planning.",
      priority: 0.7,
      changeFrequency: "yearly",
      lastModified: "2026-05-12",
      llmsSummary:
        "About the founder, Saral Toms — background, approach, and states served.",
      // About is HIDDEN for now (client removed Saral's personal presence).
      // The page still returns 200 by direct URL, but it's dropped from the
      // header nav (see `nav` below), sitemap.xml (canonical:false) and
      // llms.txt (showInLlms:false). Reverse by restoring these to true and
      // uncommenting the /about nav entry.
      showInNav: false,
      showInLlms: false,
      canonical: false,
    },
    {
      path: "/resources",
      title: "Planning tools & spreadsheets · Free downloads",
      description:
        "Free spreadsheets for net worth tracking and monthly budgeting, used in the conversations we have with clients every week.",
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
      title: "Contact · Dimeguard",
      description:
        "Three ways to reach us — email, a 20-minute Calendly call, or the contact form. Serving the Central Valley, Tri-Valley, and Bay Area.",
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
      showInLlms: false,
      canonical: false,
    },
    {
      path: "/401k-rollovers",
      title: "401(k) rollovers · Dimeguard",
      description:
        "A plain-language look at rolling an old 401(k) into an IRA — when it makes sense, the tax-bucket implications, and the trade-offs to weigh before you move money.",
      priority: 0.6,
      changeFrequency: "yearly",
      lastModified: "2026-06-06",
      llmsSummary:
        "401(k) rollovers — when a rollover to an IRA makes sense, tax-bucket implications, and trade-offs to weigh.",
      // Released from the staggered hold 2026-07-31 — first service page to go
      // canonical so it has indexing runway before the Aug 15 launch. Copy is
      // unchanged since 2026-06-06, so lastModified stays put (it stamps real
      // edits, not publication status).
      showInLlms: true,
      canonical: true,
    },
    {
      path: "/annuities",
      title: "Annuities & retirement income · Dimeguard",
      description:
        "How annuities can turn part of a nest egg into predictable income — the main types, what the guarantees actually mean, and where they fit (and don't) in a retirement plan.",
      priority: 0.6,
      changeFrequency: "yearly",
      lastModified: "2026-06-06",
      llmsSummary:
        "Annuities and retirement income — the main types, what guarantees mean, and where they fit in a plan.",
      showInLlms: false,
      canonical: false,
    },
    {
      path: "/tax-planning",
      title: "Tax-efficient planning · Dimeguard",
      description:
        "Coordinating the tax buckets — taxable, tax-deferred, and tax-free — so withdrawals in retirement are sequenced with the tax bill in mind. Not tax advice; coordination with your CPA.",
      priority: 0.6,
      changeFrequency: "yearly",
      lastModified: "2026-06-06",
      llmsSummary:
        "Tax-efficient planning — coordinating taxable, tax-deferred, and tax-free buckets for retirement withdrawals.",
      showInLlms: false,
      canonical: false,
    },
    {
      path: "/estate-planning",
      title: "Estate planning · Dimeguard",
      description:
        "The insurance side of passing things on cleanly — beneficiary alignment, liquidity for taxes and expenses, and where life insurance fits alongside a will or trust drafted by your attorney.",
      priority: 0.6,
      changeFrequency: "yearly",
      lastModified: "2026-06-06",
      llmsSummary:
        "Estate planning — beneficiary alignment, liquidity, and where life insurance fits alongside a will or trust.",
      showInLlms: false,
      canonical: false,
    },
    {
      path: "/privacy",
      title: "Privacy policy · Dimeguard",
      description:
        "How Dimeguard collects, uses, and protects your information, including California (CCPA/CalOPPA) privacy rights.",
      priority: 0.3,
      changeFrequency: "yearly",
      lastModified: "2026-06-06",
      llmsSummary: "Privacy policy, including California privacy rights.",
      showInLlms: false,
      canonical: false,
    },
    {
      path: "/terms",
      title: "Terms of use · Dimeguard",
      description:
        "The terms governing use of the Dimeguard website, including disclaimers and the insurance-only scope of services.",
      priority: 0.3,
      changeFrequency: "yearly",
      lastModified: "2026-06-06",
      llmsSummary: "Terms of use for the Dimeguard website.",
      showInLlms: false,
      canonical: false,
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
  social: [
    { label: "Facebook", href: "#" },
    { label: "X", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
  ],
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
        expectedReturn: 0.07,
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

/**
 * Source-aware copy for the /book page left panel. The `?source=` query param
 * selects which entry's heading/subcopy/bullets render; unknown or missing
 * sources fall back to `footer`. Kept here (not in a component) so the copy is
 * editable without touching the booking UI.
 */
export type BookingSourceCopy = {
  /** Lead-in fragment of the heading, rendered in ink. */
  heading: string;
  /** Trailing fragment of the heading, rendered in the accent color. */
  headingAccent: string;
  /** One supporting line beneath the heading. */
  subcopy: string;
  /** 2–3 reassurance bullets describing what the call covers. */
  bullets: string[];
};

export type BookingSourceKey = "hero" | "retirement" | "life" | "footer";

export const bookingSourceConfig: Record<BookingSourceKey, BookingSourceCopy> = {
  hero: {
    heading: "Let's look at your number",
    headingAccent: "together.",
    subcopy:
      "You came from the homepage — start where most families do: a clear-eyed look at retirement, insurance, and tax in one slow conversation.",
    bullets: [
      "Your retirement number and how close you are.",
      "Whether your coverage matches who depends on you.",
      "The next small step — if there is one.",
    ],
  },
  retirement: {
    heading: "Find out where",
    headingAccent: "you stand.",
    subcopy:
      "You were reading about retirement planning. Bring whatever you know about your savings and timeline — we'll map the rest on the call.",
    bullets: [
      "Current savings, contributions, and target income.",
      "Social Security timing and tax-bucket coordination.",
      "The gap, if there is one — and what closes it.",
    ],
  },
  life: {
    heading: "Estimate the coverage",
    headingAccent: "your family needs.",
    subcopy:
      "You were reading about life & disability. We'll talk through who depends on your income and what term or permanent coverage may fit.",
    bullets: [
      "Income to replace and who relies on it.",
      "What your employer coverage actually does.",
      "Term vs permanent — and which job each one does.",
    ],
  },
  footer: {
    heading: "A 20-minute call,",
    headingAccent: "no pressure.",
    subcopy:
      "Pick a time that works. The first call is a relaxed conversation — no script, no products pitched, no obligation to put anything in place.",
    bullets: [
      "Where you stand today, in plain language.",
      "The gaps worth paying attention to.",
      "What your options look like — and what they don't.",
    ],
  },
};

export function resolveBookingSource(
  source: string | null | undefined,
): { key: BookingSourceKey; copy: BookingSourceCopy } {
  const key: BookingSourceKey =
    source && Object.hasOwn(bookingSourceConfig, source)
      ? (source as BookingSourceKey)
      : "footer";
  return { key, copy: bookingSourceConfig[key] };
}

export function getRoute(path: string): RouteMeta | undefined {
  return siteConfig.routes.find((r) => r.path === path);
}

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}
