"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { siteConfig } from "@/site.config";
import {
  readConsent,
  subscribeConsent,
  type ConsentValue,
} from "@/lib/analytics/consent";

/**
 * Consent-gated analytics loader. GA4 and PostHog snippets are only injected
 * once the visitor has granted consent ("accepted") AND the relevant IDs are
 * configured via env (`NEXT_PUBLIC_GA4_MEASUREMENT_ID`,
 * `NEXT_PUBLIC_POSTHOG_KEY`). Before a choice is made — or after a decline —
 * nothing loads. We subscribe to consent changes, so accepting starts tracking
 * and declining stops it (PostHog opt-out + GA disable flag) without a hard
 * reload. `track()` also re-checks consent at send time as a final guard.
 */
export function Analytics() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    return subscribeConsent(setConsent);
  }, []);

  const { ga4MeasurementId, posthogPublicKey, posthogHost } =
    siteConfig.analytics;

  // Enforce consent on already-loaded globals. Unmounting the Script tags does
  // not unload GA4/PostHog, so on accepted -> declined we actively opt out
  // (PostHog) and set GA's per-property disable flag; the inverse re-grants.
  useEffect(() => {
    if (typeof window === "undefined" || consent === null) return;
    const win = window as typeof window & Record<string, boolean>;
    if (consent === "declined") {
      if (ga4MeasurementId) win[`ga-disable-${ga4MeasurementId}`] = true;
      window.posthog?.opt_out_capturing?.();
    } else if (consent === "accepted") {
      if (ga4MeasurementId) win[`ga-disable-${ga4MeasurementId}`] = false;
      window.posthog?.opt_in_capturing?.();
    }
  }, [consent, ga4MeasurementId]);

  if (consent !== "accepted") return null;

  return (
    <>
      {ga4MeasurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4MeasurementId}');
            `}
          </Script>
        </>
      ) : null}

      {posthogPublicKey ? (
        <Script id="posthog-init" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('${posthogPublicKey}',{api_host:'${posthogHost}'});
          `}
        </Script>
      ) : null}
    </>
  );
}
