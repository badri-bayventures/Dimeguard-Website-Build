"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { track } from "@/lib/analytics/track";
import { Disclosure } from "./disclosure";

type Status = "locked" | "submitting" | "unlocked" | "error";

/**
 * Reusable name+email gate for lead-capture-gated content (calculator
 * readouts, resource downloads). Posts to the same `/api/lead` route the
 * contact form uses — `source` is what distinguishes them downstream, so pass
 * something specific and human-readable.
 *
 * The gated thing should be a *result*, never the tool itself: visitors can
 * always run the numbers, and the gate buys the interpretation. A calculator
 * that won't compute until you hand over an email reads as a trap and doesn't
 * earn the SEO/AEO surface the page is there for.
 *
 * Unlock is remembered per `storageKey` for the tab session, so someone who
 * unlocks, navigates away and comes back isn't asked twice.
 */
export function LeadGate({
  source,
  storageKey,
  eyebrow = "One step",
  title,
  blurb,
  submitLabel = "Show my readout",
  children,
}: {
  /** Human-readable origin, lands in the lead notification. */
  source: string;
  /** Session-storage key so an unlock survives navigation within the tab. */
  storageKey: string;
  eyebrow?: string;
  title: string;
  blurb: string;
  submitLabel?: string;
  /** The protected content. Only mounted once unlocked. */
  children: ReactNode;
}) {
  const [status, setStatus] = useState<Status>("locked");
  const [error, setError] = useState<string | null>(null);
  const nameId = useId();
  const emailId = useId();

  // sessionStorage is read in an effect rather than lazy state so the server
  // and first client render agree (otherwise hydration mismatches).
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(storageKey) === "1") {
        setStatus("unlocked");
      }
    } catch {
      // Private mode / storage disabled — the gate just asks again. Not fatal.
    }
  }, [storageKey]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(
          payload?.error ?? "That didn't go through. Please try again.",
        );
      }
      try {
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        // Non-fatal: they stay unlocked for this render either way.
      }
      track("lead_gate_unlocked", { source });
      setStatus("unlocked");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "That didn't go through. Please try again.",
      );
    }
  }

  if (status === "unlocked") return <>{children}</>;

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-ink)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
        {blurb}
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Honeypot — matches the field name /api/lead already checks. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor={`${nameId}-company`}>Company</label>
          <input
            id={`${nameId}-company`}
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor={nameId}
            className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]"
          >
            Name
          </label>
          <input
            id={nameId}
            name="name"
            required
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2.5 text-base text-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ink)]/20"
          />
        </div>

        <div>
          <label
            htmlFor={emailId}
            className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]"
          >
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2.5 text-base text-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ink)]/20"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn btn--primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : submitLabel}
          </button>
        </div>
      </form>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-[color:var(--color-ink)]">
        {status === "error" && error ? error : ""}
      </p>

      <p className="mt-4 text-xs leading-relaxed text-[color:var(--color-muted)]">
        We use this to send your readout and follow up once. No list, no
        sharing, unsubscribe any time.
      </p>
      <Disclosure className="mt-3" />
    </div>
  );
}
