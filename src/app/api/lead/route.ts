import { NextResponse } from "next/server";

/**
 * v1 lead-capture stub. Logs the payload server-side and returns 200.
 *
 * TODO[badri]: wire to Resend (email notify) + Airtable (lead store) in M2
 * Feature Layer per the engagement proposal. Twilio for SMS is M2/M3.
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

  const { name, email, message } = payload as Record<string, unknown>;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.includes("@") ||
    typeof message !== "string" ||
    message.trim().length < 10
  ) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid fields" },
      { status: 422 },
    );
  }

  console.log("[lead]", {
    receivedAt: new Date().toISOString(),
    payload,
  });

  return NextResponse.json({ ok: true });
}
