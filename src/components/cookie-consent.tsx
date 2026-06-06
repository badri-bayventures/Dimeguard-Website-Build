"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "dg_cookie_consent";

/**
 * Lightweight cookie-consent banner. Persists the user's choice in
 * localStorage so it only appears until acknowledged. No third-party scripts
 * are gated here yet — the choice is recorded for when analytics is enabled.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const record = (value: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore storage failures (e.g. private mode); just dismiss.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between md:p-6">
        <p className="text-sm text-[color:var(--color-ink-soft)]">
          We use cookies to remember your preferences and understand how the
          site is used. See our{" "}
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => record("declined")}
            className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-surface-muted)]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => record("accepted")}
            className="rounded-full bg-[color:var(--color-ink)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
