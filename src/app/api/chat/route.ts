import Anthropic from "@anthropic-ai/sdk";

import { SYSTEM_PROMPT } from "@/lib/assistant/system-prompt";

/**
 * Site-assistant chat endpoint. The ONLY place ANTHROPIC_API_KEY is ever
 * referenced — it must never reach the browser bundle.
 *
 * Model config per the 2026-07-31 assistant spec (do not "improve"):
 * - claude-opus-5, thinking disabled + effort low keeps the widget snappy
 *   and cheap. Disabling thinking is only permitted at effort `high` or
 *   below — do not raise effort above `high` while thinking is disabled.
 * - The system prompt is byte-stable and carries a 1h cache breakpoint so
 *   the whole corpus caches across conversations.
 * - Because thinking is disabled the model can occasionally leak internal
 *   XML; the system prompt carries the guard instruction for this.
 */

export const runtime = "nodejs";

const MODEL = "claude-opus-5";
const MAX_MESSAGE_CHARS = 2_000;
const HISTORY_LIMIT = 12;

// Simple in-memory per-IP rate limit: 20 requests / 10 minutes. Imperfect on
// serverless (per-instance) — acceptable for v1; deliberately no database.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_WINDOW_MS;
  const prior = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  if (prior.length >= RATE_LIMIT) {
    hits.set(ip, prior);
    return true;
  }
  prior.push(now);
  hits.set(ip, prior);
  // Bound the map so a long-lived instance can't grow unbounded.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => t <= windowStart)) hits.delete(key);
    }
  }
  return false;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(payload: unknown): ChatMessage[] | null {
  if (typeof payload !== "object" || payload === null) return null;
  const raw = (payload as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: ChatMessage[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) return null;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    // Ignore any client-supplied system role entirely — the system prompt is
    // server-owned. Anything else malformed rejects the request.
    if (role === "system") continue;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0) return null;
    if (content.length > MAX_MESSAGE_CHARS) return null;
    messages.push({ role, content });
  }
  if (messages.length === 0) return null;
  // The last message must be from the user.
  if (messages[messages.length - 1].role !== "user") return null;
  // Trim to the last N messages.
  return messages.slice(-HISTORY_LIMIT);
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "The assistant isn't available right now. Please call, email, or book a call instead.",
      },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      {
        error:
          "I'm getting a lot of questions right now — give it a minute, or reach out directly.",
      },
      { status: 429 },
    );
  }

  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = parseMessages(payload);
  if (!messages) {
    return Response.json(
      { error: "Invalid messages payload" },
      { status: 400 },
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "disabled" },
      output_config: { effort: "low" },
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral", ttl: "1h" },
        },
      ],
      messages,
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        stream.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });
        stream.on("end", () => {
          // Log status + token usage only — never message contents.
          void stream
            .finalMessage()
            .then((message) => {
              console.info("[chat] ok", {
                input_tokens: message.usage.input_tokens,
                output_tokens: message.usage.output_tokens,
                cache_read: message.usage.cache_read_input_tokens,
              });
            })
            .catch(() => {});
          controller.close();
        });
        stream.on("error", (err) => {
          console.error("[chat] stream error", {
            status:
              err instanceof Anthropic.APIError ? err.status : undefined,
          });
          controller.error(err);
        });
      },
      cancel() {
        stream.abort();
      },
    });

    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[chat] request failed", {
      status: err instanceof Anthropic.APIError ? err.status : undefined,
    });
    return Response.json(
      {
        error:
          "Something went wrong on our side. Please try again, or reach out directly.",
      },
      { status: 502 },
    );
  }
}

export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
