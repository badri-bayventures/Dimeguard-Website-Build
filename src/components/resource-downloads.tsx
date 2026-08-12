"use client";

import { track } from "@/lib/analytics/track";
import { buttonClasses } from "./button";
import { LeadGate } from "./lead-gate";

export type ResourceFile = {
  title: string;
  description: string;
  /** Path under /public, e.g. "/downloads/dimeguard-net-worth-tracker.csv". */
  href: string;
  /** Short format hint shown next to the link, e.g. "CSV · opens in Excel/Sheets". */
  format: string;
};

/**
 * Gated download list for /resources. Same gate design as the calculators:
 * the tools are described in the open (that's the indexable surface); the
 * files themselves unlock behind the name+email gate, which posts to the
 * same /api/lead route with a distinguishing source.
 */
export function ResourceDownloads({ files }: { files: ResourceFile[] }) {
  return (
    <LeadGate
      source="Resources downloads"
      storageKey="dg-gate-resources"
      eyebrow="Free downloads"
      title="Get both files — free"
      blurb="Leave your name and email and the download buttons unlock right here, instantly. Both files open in Excel, Google Sheets, or Numbers."
      submitLabel="Unlock the downloads"
    >
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
          Your downloads
        </p>
        <ul className="mt-5 space-y-5">
          {files.map((file) => (
            <li
              key={file.href}
              className="flex flex-col gap-2 border-b border-[color:var(--color-border)] pb-5 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-[color:var(--color-ink)]">
                  {file.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-muted)]">
                  {file.description}
                </p>
              </div>
              <a
                href={file.href}
                download
                onClick={() =>
                  track("resource_downloaded", { file: file.href })
                }
                className={buttonClasses("primary", "md", "self-start")}
              >
                Download <span className="sr-only">{file.title} </span>
                <span aria-hidden>↓</span>
              </a>
              <p className="text-xs text-[color:var(--color-muted)]">
                {file.format}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </LeadGate>
  );
}
