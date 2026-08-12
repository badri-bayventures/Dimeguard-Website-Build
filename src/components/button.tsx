import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[colors,transform,box-shadow] duration-150 ease-out active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-secondary)] focus-visible:ring-offset-[color:var(--color-surface)] disabled:opacity-60 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)] hover:brightness-95 hover:shadow-md",
  secondary:
    "bg-[color:var(--color-ink)] text-white hover:bg-[color:var(--color-ink-soft)] hover:shadow-md",
  ghost:
    "bg-transparent text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-muted)] border border-[color:var(--color-border)]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

/**
 * Class string for elements that can't be a <Button>/<ButtonLink> — e.g. a
 * plain <a download> (next/link would intercept the click) or a form button
 * that needs extra state classes. Keeps every CTA on the one button system.
 */
export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  extra = "",
): string {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`.trim();
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...rest
}: ButtonLinkProps) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a {...rest} href={href} className={cls} rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
