import Link from "next/link";
import { siteConfig } from "@/site.config";

/**
 * Mid-page trust card introducing the founder. Placed between service tiles
 * and testimonials. Photo path is read from siteConfig.advisor.photoSrc;
 * shows a styled placeholder until the real headshot is delivered.
 */
export function MeetAdvisor() {
  const { advisor, business } = siteConfig;
  return (
    <div className="grid items-center gap-10 rounded-3xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:grid-cols-[280px_1fr] md:gap-12 md:p-10">
      <div className="mx-auto md:mx-0">
        {advisor.photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={advisor.photoSrc}
            alt={`${advisor.fullName}, ${advisor.title}`}
            width={280}
            height={280}
            className="h-[280px] w-[280px] rounded-2xl object-cover object-[center_20%]"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-[280px] w-[280px] flex-col items-end justify-end rounded-2xl bg-gradient-to-br from-[color:var(--color-ink)] to-[color:var(--color-ink-soft)] p-6 text-white"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
              Photo
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-tight">
              {advisor.fullName}
            </p>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
          Meet {advisor.firstName}
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-4xl">
          {advisor.fullName}
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          {advisor.title} · {business.legalName}
        </p>
        <p className="mt-5 max-w-xl text-lg text-[color:var(--color-ink-soft)]">
          {advisor.bioSnippet}
        </p>
        <Link
          href="/about"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-ink)] underline decoration-[color:var(--color-secondary)] decoration-2 underline-offset-4 hover:text-[color:var(--color-ink-soft)]"
        >
          More about {advisor.firstName} →
        </Link>
      </div>
    </div>
  );
}
