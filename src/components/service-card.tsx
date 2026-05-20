import Link from "next/link";
import type { ReactNode } from "react";

type ServiceCardProps = {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  href: string;
  cta?: string;
  icon?: ReactNode;
};

export function ServiceCard({
  eyebrow,
  title,
  description,
  href,
  cta = "Learn more",
  icon,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col rounded-2xl border border-[color:var(--color-border)] bg-white p-7 shadow-[var(--shadow-card)] transition-colors hover:border-[color:var(--color-ink)]"
    >
      {icon ? (
        <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)] text-[color:var(--color-ink)]">
          {icon}
        </div>
      ) : null}
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[color:var(--color-ink)]">
        {title}
      </h3>
      <div className="mt-3 text-[color:var(--color-muted)]">{description}</div>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-ink)]">
        {cta}
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </Link>
  );
}
