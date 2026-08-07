"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { siteConfig } from "@/site.config";
import { track } from "@/lib/analytics/track";

/**
 * Site assistant chat widget. Lazily loaded (see assistant-mount.tsx) so it
 * never affects the initial page bundle or Core Web Vitals.
 *
 * Compliance surface, per the 2026-07-31 spec:
 * - Opening message states plainly that it's automated.
 * - Persistent, always-visible disclosure line under the header.
 * - No persistence: conversation lives in component state only. Nothing is
 *   written to localStorage/cookies; the only analytics event is a single
 *   anonymous "assistant_opened" — never message contents.
 */

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi — I'm the automated assistant for this site. I can answer questions about what Dimeguard does and help you get to the right page or book a call.";

const DISCLOSURE = "Automated assistant — not a licensed representative.";

const FALLBACK_CONTACT = `You can also reach us directly: call ${siteConfig.nap.phone}, email ${siteConfig.nap.email}, or book a call at /book.`;

/** Auto-link phone numbers, emails, and URLs/paths in assistant replies. */
function linkify(text: string): ReactNode[] {
  const pattern =
    /(\bhttps?:\/\/[^\s)]+|\b[\w.+-]+@[\w-]+\.[\w.]+\b|\b\d{3}-\d{3}-\d{4}\b|(?<![\w/])\/(?:book|contact|resources|blog|retirement-planning|life-insurance|401k-rollovers|calculators\/[\w-]+|states\/[\w-]+)\b)/g;
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    let href = part;
    if (/^\d{3}-\d{3}-\d{4}$/.test(part)) {
      href = `tel:+1${part.replace(/-/g, "")}`;
    } else if (part.includes("@")) {
      href = `mailto:${part}`;
    }
    return (
      <a
        key={i}
        href={href}
        className="font-semibold underline decoration-[color:var(--color-accent)] decoration-2 underline-offset-2"
      >
        {part}
      </a>
    );
  });
}

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [openedOnce, setOpenedOnce] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to the launcher on close.
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  // Escape closes; Tab is trapped inside the open panel.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Focus the input when the panel opens; fire the single anonymous event.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (!openedOnce) {
      setOpenedOnce(true);
      track("assistant_opened");
    }
  }, [open, openedOnce]);

  // Keep the log pinned to the latest message.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const history = [...messages, { role: "user" as const, content: text }];
    setMessages(history);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const friendly =
          res.status === 429
            ? `I'm getting a lot of questions right now — give it a minute, or call ${siteConfig.nap.phone}.`
            : `I'm having trouble answering right now. ${FALLBACK_CONTACT}`;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: friendly },
        ]);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I'm having trouble answering right now. ${FALLBACK_CONTACT}`,
          },
        ]);
        return;
      }

      // Stream the reply in as it arrives.
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages((prev) => {
          const next = prev.slice(0, -1);
          next.push({ role: "assistant", content: snapshot });
          return next;
        });
      }
      if (acc.trim() === "") {
        setMessages((prev) => {
          const next = prev.slice(0, -1);
          next.push({
            role: "assistant",
            content: `I'm having trouble answering right now. ${FALLBACK_CONTACT}`,
          });
          return next;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm having trouble answering right now. ${FALLBACK_CONTACT}`,
        },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        aria-label={`Open the site assistant. ${siteConfig.assistant.launcherLabel}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-ink)] text-white shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-secondary)] focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
            <path
              d="M21 12a8 8 0 0 1-8 8H5.6L3 21.4V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Panel: card on desktop, full-screen sheet on mobile. */}
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white shadow-2xl sm:inset-auto sm:bottom-24 sm:right-6 sm:max-h-[70vh] sm:w-[380px] sm:rounded-2xl sm:border sm:border-[color:var(--color-border)]"
        >
          <div className="bg-[color:var(--color-ink)] px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <p id={headingId} className="font-semibold">
                {siteConfig.business.legalName} Assistant
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close the assistant"
                className="rounded p-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            {/* Persistent disclosure — always visible, never behind a tooltip. */}
            <p className="mt-1 text-xs text-white/75">{DISCLOSURE}</p>
          </div>

          <div
            ref={logRef}
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            <div className="mr-8 rounded-2xl rounded-tl-sm bg-[color:var(--color-surface-muted)] px-3.5 py-2.5 text-sm leading-relaxed text-[color:var(--color-ink)]">
              {GREETING}
            </div>
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={i}
                  className="ml-8 rounded-2xl rounded-tr-sm bg-[color:var(--color-ink)] px-3.5 py-2.5 text-sm leading-relaxed text-white"
                >
                  {m.content}
                </div>
              ) : (
                <div
                  key={i}
                  className="mr-8 whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-[color:var(--color-surface-muted)] px-3.5 py-2.5 text-sm leading-relaxed text-[color:var(--color-ink)]"
                >
                  {m.content === "" && busy && i === messages.length - 1 ? (
                    <TypingDots />
                  ) : (
                    linkify(m.content)
                  )}
                </div>
              ),
            )}
            {busy &&
            (messages.length === 0 ||
              messages[messages.length - 1].role === "user") ? (
              <div className="mr-8 rounded-2xl rounded-tl-sm bg-[color:var(--color-surface-muted)] px-3.5 py-2.5 text-sm">
                <TypingDots />
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex items-center gap-2 border-t border-[color:var(--color-border)] px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              placeholder="Ask about Dimeguard…"
              aria-label="Message the assistant"
              className="flex-1 rounded-lg border border-[color:var(--color-border)] px-3 py-2 text-sm text-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ink)]/20"
            />
            <button
              type="submit"
              disabled={busy || input.trim() === ""}
              className="btn btn--primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

function TypingDots() {
  return (
    <span
      className="inline-flex items-center gap-1"
      role="status"
      aria-label="The assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--color-muted)] motion-reduce:animate-none"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
