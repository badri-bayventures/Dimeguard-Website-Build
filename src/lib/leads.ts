import { Resend } from "resend";

/**
 * A captured website lead. Channels (email today; SMS / Airtable later) consume
 * this shape, so adding a new channel means adding a sender below — no changes
 * to the route or the rest of the pipeline.
 */
export type Lead = {
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  /** Page or form the lead came from, for triage. */
  source: string;
  /** ISO timestamp of when the lead was received. */
  receivedAt: string;
};

let resendClient: Resend | null = null;

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Notify the team about a new lead across every configured channel.
 *
 * Today this is email-only. To add a channel (e.g. SMS via Twilio or an
 * Airtable record), add another sender call here. Each channel is responsible
 * for throwing on failure so the caller can surface a clear error.
 */
export async function notifyLead(lead: Lead): Promise<void> {
  await sendLeadEmail(lead);
}

async function sendLeadEmail(lead: Lead): Promise<void> {
  const from = process.env.LEAD_FROM_EMAIL;
  const to = process.env.LEAD_TO_EMAIL;
  if (!from || !to) {
    throw new Error("LEAD_FROM_EMAIL / LEAD_TO_EMAIL are not configured");
  }

  const subject = `New website lead: ${lead.name}`;

  const lines: Array<[string, string]> = [
    ["Name", lead.name],
    ["Phone", lead.phone || "—"],
    ["Email", lead.email || "—"],
    ["Comment", lead.message || "—"],
    ["Source", lead.source],
    ["Received", lead.receivedAt],
  ];

  const text = lines.map(([label, value]) => `${label}: ${value}`).join("\n");

  const html = `<table cellpadding="0" cellspacing="0" style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.5; color: #1a1a1a;">
${lines
  .map(
    ([label, value]) =>
      `<tr><td style="padding: 4px 16px 4px 0; font-weight: 600; vertical-align: top;">${escapeHtml(
        label,
      )}</td><td style="padding: 4px 0; white-space: pre-wrap;">${escapeHtml(
        value,
      )}</td></tr>`,
  )
  .join("\n")}
</table>`;

  const { error } = await getResend().emails.send({
    from,
    to,
    subject,
    text,
    html,
    // Replies go straight to the prospect when they left an email.
    ...(lead.email ? { replyTo: lead.email } : {}),
  });

  if (error) {
    throw new Error(`Resend failed to send lead email: ${error.message}`);
  }
}
