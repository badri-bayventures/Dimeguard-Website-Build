import { NextResponse } from "next/server";

import { notifyLead } from "@/lib/leads";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * v1 lead-capture handler. Validates the submission and sends a notification
 * email via Resend (see `@/lib/leads`). Additional channels (SMS, Airtable)
 * can be slotted into `notifyLead` later without touching this route.
 */
export async function POST(request: Request) {
  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      { ok: false, error: "Body must be an object" },
      { status: 400 },
    );
  }

  const body = payload as Record<string, unknown>;

  // Honeypot: a hidden field real users never see. If it's filled, it's a bot —
  // silently accept so we don't tip off the spammer, but send nothing.
  if (asTrimmedString(body.company) !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const phone = asTrimmedString(body.phone);
  const message = asTrimmedString(body.message);
  const source = asTrimmedString(body.source) || "Website contact form";

  if (!name) {
    return NextResponse.json(
      { ok: false, error: "Please include your name." },
      { status: 422 },
    );
  }

  if (!email && !phone) {
    return NextResponse.json(
      { ok: false, error: "Please include an email or phone number." },
      { status: 422 },
    );
  }

  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  try {
    await notifyLead({
      name,
      email: email || undefined,
      phone: phone || undefined,
      message: message || undefined,
      source,
      receivedAt: new Date().toISOString(),
    });
  } catch (err) {
    // Log enough to debug delivery without dumping the submitter's PII.
    console.error("[lead] notification failed", {
      source,
      hasEmail: Boolean(email),
      hasPhone: Boolean(phone),
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't send your message right now. Please try again, or reach us directly by email or phone.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
