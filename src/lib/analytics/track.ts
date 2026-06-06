/**
 * Lightweight client-side event tracker. PostHog/GA4 are loaded only after the
 * visitor accepts cookies (see `components/analytics.tsx`), so this no-ops
 * until then — `window.posthog`/`window.gtag` simply don't exist yet. Callers
 * fire semantic event names from the funnel spec (e.g.
 * calculator_teaser_engaged) without worrying about which downstream(s) are
 * connected.
 */

import { readConsent } from "./consent";

type EventProps = Record<string, string | number | boolean | null | undefined>;

type PosthogLike = {
  capture: (event: string, properties?: EventProps) => void;
  opt_out_capturing?: () => void;
  opt_in_capturing?: () => void;
};

type GtagFn = (
  command: "event",
  action: string,
  params?: EventProps,
) => void;

declare global {
  interface Window {
    posthog?: PosthogLike;
    gtag?: GtagFn;
  }
}

export function track(event: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  // Send-time consent gate: even if a downstream global is still resident from
  // an earlier "accepted" session, never emit events once consent isn't granted.
  if (readConsent() !== "accepted") return;
  try {
    window.posthog?.capture(event, props);
    window.gtag?.("event", event, props);
  } catch {
    // Swallow — analytics must never break the UI.
  }
}
