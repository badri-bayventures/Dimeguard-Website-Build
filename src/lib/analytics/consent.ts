/**
 * Shared cookie-consent state. The banner writes the visitor's choice here and
 * the analytics loader reads/subscribes to it, so GA4/PostHog only ever fire
 * after consent is granted. localStorage is the source of truth; a custom event
 * lets same-tab listeners react without a hard reload (the native `storage`
 * event only fires in *other* tabs).
 */

export type ConsentValue = "accepted" | "declined";

export const CONSENT_STORAGE_KEY = "dg_cookie_consent";
export const CONSENT_EVENT = "dg:consent-change";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "accepted" || stored === "declined" ? stored : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures (e.g. private mode) — still notify listeners.
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }));
}

/**
 * Subscribe to consent changes (same-tab via custom event, cross-tab via the
 * native storage event). Returns an unsubscribe function.
 */
export function subscribeConsent(
  callback: (value: ConsentValue | null) => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const handleCustom = (event: Event) => {
    const detail = (event as CustomEvent<ConsentValue>).detail;
    callback(detail ?? readConsent());
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) callback(readConsent());
  };
  window.addEventListener(CONSENT_EVENT, handleCustom);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, handleCustom);
    window.removeEventListener("storage", handleStorage);
  };
}
