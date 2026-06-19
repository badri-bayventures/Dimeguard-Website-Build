"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { siteConfig } from "@/site.config";
import {
  readConsent,
  subscribeConsent,
  type ConsentValue,
} from "@/lib/analytics/consent";

/**
 * Fires a GA4 `page_view` on client-side (App Router) navigations. The initial
 * page_view is already emitted by `gtag('config', ...)` in <Analytics />, so we
 * record the first path without sending and only emit on subsequent route or
 * search-param changes. We track the last-sent path in a ref so that a consent
 * value resolving *after* mount (which re-runs the effect without a real
 * navigation) does not produce a duplicate hit. Like the rest of analytics,
 * this stays inert until the visitor has accepted cookies and a Measurement ID
 * is configured.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ga4MeasurementId } = siteConfig.analytics;
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    return subscribeConsent(setConsent);
  }, []);

  useEffect(() => {
    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    // First computed path: record it without sending — the initial page_view is
    // already emitted by gtag('config', ...) in <Analytics />.
    if (lastPath.current === null) {
      lastPath.current = path;
      return;
    }
    // No real navigation (e.g. consent resolved after mount) — nothing to send.
    if (path === lastPath.current) return;
    lastPath.current = path;

    if (!ga4MeasurementId || consent !== "accepted") return;
    if (typeof window === "undefined" || !window.gtag) return;

    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams, consent, ga4MeasurementId]);

  return null;
}

/**
 * `useSearchParams()` requires a Suspense boundary in the App Router, otherwise
 * it opts the whole tree into client-side rendering. Wrap the tracker so the
 * rest of the page can still be statically rendered.
 */
export function AnalyticsPageViews() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
