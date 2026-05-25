"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "ok" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
          Got it
        </p>
        <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-ink)]">
          Thanks — your note is on its way.
        </p>
        <p className="mt-3 text-[color:var(--color-ink-soft)]">
          I&rsquo;ll reply within one business day. If it&rsquo;s urgent, the
          email and phone links above reach me directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8"
      noValidate={false}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" name="name" type="text" required autoComplete="name" />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div className="mt-4">
        <Field
          label="Phone (optional)"
          name="phone"
          type="tel"
          autoComplete="tel"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-[color:var(--color-ink)]"
        >
          What&rsquo;s on your mind?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={10}
          className="mt-2 w-full rounded-xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-ink)]"
        />
      </div>
      {error ? (
        <p className="mt-4 text-sm text-red-700">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[color:var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--color-ink-soft)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
      <p className="mt-4 text-xs text-[color:var(--color-muted)]">
        By submitting, you agree to be contacted about your inquiry. We
        don&rsquo;t share your information.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-[color:var(--color-ink)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-ink)]"
      />
    </div>
  );
}
