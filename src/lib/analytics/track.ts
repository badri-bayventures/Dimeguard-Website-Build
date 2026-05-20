/**
 * Lightweight client-side event tracker. No-ops until step 8 wires PostHog
 * and GA4 through the consent banner. Callers should fire semantic event
 * names from the funnel spec (e.g. calculator_teaser_engaged) without
 * worrying about which downstream(s) are connected yet.
 */

type EventProps = Record<string, string | number | boolean | null | undefined>;

type PosthogLike = {
  capture: (event: string, properties?: EventProps) => void;
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
  try {
    window.posthog?.capture(event, props);
    window.gtag?.("event", event, props);
  } catch {
    // Swallow — analytics must never break the UI.
  }
}
