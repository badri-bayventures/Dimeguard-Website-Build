import type { HTMLAttributes, ReactNode } from "react";
import { Container } from "./container";

type Tone = "surface" | "muted" | "ink";

const toneClasses: Record<Tone, string> = {
  surface: "bg-[color:var(--color-surface)] text-[color:var(--color-ink)]",
  muted: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-ink)]",
  ink: "bg-[color:var(--color-ink)] text-white",
};

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: Tone;
  containerClassName?: string;
};

export function Section({
  tone = "surface",
  className = "",
  containerClassName = "",
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      {...rest}
      className={`py-20 md:py-28 ${toneClasses[tone]} ${className}`.trim()}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  inverted?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  inverted = false,
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const ledeColor = inverted
    ? "text-white/80"
    : "text-[color:var(--color-muted)]";
  const eyebrowColor = inverted
    ? "text-[color:var(--color-accent)]"
    : "text-[color:var(--color-ink-soft)]";
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow ? (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${eyebrowColor}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight md:text-5xl"
        style={{ lineHeight: 1.1 }}
      >
        {title}
      </h2>
      {lede ? (
        <p className={`mt-5 text-lg leading-relaxed ${ledeColor}`}>{lede}</p>
      ) : null}
    </div>
  );
}
