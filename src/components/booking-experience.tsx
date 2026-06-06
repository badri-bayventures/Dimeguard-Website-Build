"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { InlineWidget } from "react-calendly";
import { siteConfig, resolveBookingSource } from "@/site.config";
import { track } from "@/lib/analytics/track";
import { ButtonLink } from "./button";

/**
 * Source-aware booking experience. Reads `?source=` client-side to swap the
 * left-panel copy, and renders the configured 20-minute Calendly event in the
 * brand palette with the source tagged into the booking via UTM params.
 *
 * Must be rendered inside a <Suspense> boundary — useSearchParams() opts the
 * subtree into client-side rendering per Next.js 15 App Router requirements.
 */
export function BookingExperience() {
  const searchParams = useSearchParams();
  const { key, copy } = resolveBookingSource(searchParams.get("source"));
  const calendlyUrl = siteConfig.contact.calendlyUrl;

  // Fire a booking-page view event tagged with the resolved entry-point
  // source so Saral can see conversion by source in GA4 / PostHog. No-ops
  // when analytics isn't connected (track() guards on window.posthog/gtag).
  useEffect(() => {
    track("booking_page_viewed", { source: key });
  }, [key]);

  return (
    <section className="bg-[color:var(--color-surface-muted)]">
      <div className="mx-auto grid w-full max-w-7xl gap-0 px-6 py-10 md:grid-cols-12 md:gap-10 md:px-8 md:py-16">
        {/* Left panel — sticky on desktop, stacks above the widget on mobile. */}
        <aside className="md:col-span-5 lg:col-span-4">
          <div className="rounded-3xl bg-[color:var(--color-ink)] p-8 text-white md:sticky md:top-28 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
              What we&rsquo;ll cover
            </p>
            <h1
              className="mt-5 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight md:text-4xl"
              style={{ lineHeight: 1.1 }}
            >
              {copy.heading}{" "}
              <span className="text-[color:var(--color-accent)]">
                {copy.headingAccent}
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/80">
              {copy.subcopy}
            </p>
            <ul className="mt-8 space-y-4">
              {copy.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-white/90">
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    className="mt-0.5 h-5 w-5 flex-none text-[color:var(--color-secondary)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M4 10.5l3.5 3.5L16 5.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-white/10 pt-6 text-sm text-white/70">
              <span className="font-medium text-white">Bring:</span> whatever you
              already know. Anything missing, we name on the call and move on.
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-white/60">
              20 min · No obligation · Calls returned within one business hour
            </p>
          </div>
        </aside>

        {/* Right column — inline Calendly widget in the brand palette. */}
        <div className="mt-8 md:col-span-7 md:mt-0 lg:col-span-8">
          {calendlyUrl ? (
            <div className="overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-card)]">
              <InlineWidget
                url={calendlyUrl}
                styles={{ height: "780px", minWidth: "280px" }}
                pageSettings={{
                  backgroundColor: "FFFFFF",
                  primaryColor: "143A4A",
                  textColor: "1A1A1A",
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  hideGdprBanner: true,
                }}
                utm={{
                  utmSource: "website",
                  utmCampaign: key,
                  utmContent: key,
                }}
              />
            </div>
          ) : (
            <div className="flex h-full min-h-[420px] flex-col items-start justify-center rounded-3xl border border-[color:var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)] md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Booking
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-medium text-[color:var(--color-ink)]">
                Scheduling is being set up.
              </h2>
              <p className="mt-3 max-w-prose text-[color:var(--color-ink-soft)]">
                The online calendar isn&rsquo;t connected just yet. In the
                meantime, reach out directly and we&rsquo;ll find a time for your
                20-minute call.
              </p>
              <div className="mt-6">
                <ButtonLink href="/contact">Get in touch →</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
