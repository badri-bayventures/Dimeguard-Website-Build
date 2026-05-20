"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { track } from "@/lib/analytics/track";

type ChartPoint = { age: number; balance: number };

type Projection = {
  series: ChartPoint[];
  /** Projected nest egg at retirement (FV_savings + FV_contrib). */
  finalBalance: number;
  /** Required nest egg = monthlySpend * 12 * drawdownYears. */
  requiredNestEgg: number;
};

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

/** Display as $X.XXM for headline numbers; falls back to $XXk under $1M. */
function formatMillions(value: number): string {
  const v = Math.max(0, value);
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}k`;
  return formatUsd(v);
}

/**
 * Year-by-year projection of FV_savings + FV_contrib from current age to
 * retirement age. Mirrors the formula in
 * docs/architecture-decisions-2026-05-20.md so the teaser and the full
 * calculator on /retirement-planning produce identical numbers.
 */
function project(args: {
  currentAge: number;
  retireAt: number;
  saved: number;
  monthlySpend: number;
}): Projection {
  const {
    assumedAnnualReturnPre: rPre,
    drawdownYears,
    teaserDefaults,
  } = siteConfig.calculators.retirement;
  const { monthlyContribution } = teaserDefaults;

  const years = Math.max(0, args.retireAt - args.currentAge);
  const monthlyRate = rPre / 12;
  const series: ChartPoint[] = [];
  for (let i = 0; i <= years; i += 1) {
    const months = i * 12;
    const fvSavings = args.saved * Math.pow(1 + rPre, i);
    const fvContrib =
      monthlyRate === 0
        ? monthlyContribution * months
        : monthlyContribution *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    series.push({ age: args.currentAge + i, balance: fvSavings + fvContrib });
  }
  const finalBalance = series.length
    ? series[series.length - 1].balance
    : args.saved;
  const requiredNestEgg = args.monthlySpend * 12 * drawdownYears;
  return { series, finalBalance, requiredNestEgg };
}

/**
 * Inline SVG line chart over a soft grid. No chart library — keeps the
 * teaser hydration-light and avoids a runtime dep. Lime accent stroke.
 */
function ProjectionChart({ series }: { series: ChartPoint[] }) {
  const width = 480;
  const height = 160;
  const padding = { top: 12, right: 12, bottom: 20, left: 12 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const path = useMemo(() => {
    if (series.length === 0) return "";
    const max = Math.max(...series.map((p) => p.balance), 1);
    const min = 0;
    const xStep = series.length > 1 ? innerW / (series.length - 1) : 0;
    return series
      .map((p, i) => {
        const x = padding.left + i * xStep;
        const y =
          padding.top + innerH - ((p.balance - min) / (max - min)) * innerH;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [series, innerW, innerH, padding.left, padding.top]);

  const areaPath = useMemo(() => {
    if (!path) return "";
    const baselineY = padding.top + innerH;
    const xStep = series.length > 1 ? innerW / (series.length - 1) : 0;
    const lastX = padding.left + (series.length - 1) * xStep;
    return `${path} L${lastX.toFixed(1)},${baselineY.toFixed(1)} L${padding.left.toFixed(1)},${baselineY.toFixed(1)} Z`;
  }, [path, series.length, innerW, innerH, padding.left, padding.top]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="block h-32 w-full md:h-36"
      role="img"
      aria-label="Projected savings growth from current age to retirement age"
    >
      {/* soft horizontal grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padding.top + innerH * t;
        return (
          <line
            key={t}
            x1={padding.left}
            x2={width - padding.right}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        );
      })}
      <path d={areaPath} fill="rgba(200,224,74,0.12)" />
      <path
        d={path}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function parseCurrency(input: string): number {
  return Number(input.replace(/[$,\s]/g, ""));
}

export function CalcTeaser() {
  const config = siteConfig.heroCalcTeaser;
  const {
    teaserDefaults,
    assumedAnnualReturnPre,
    assumedAnnualReturnPost,
    drawdownYears,
  } = siteConfig.calculators.retirement;

  const ageId = useId();
  const retireAtId = useId();
  const savedId = useId();
  const spendId = useId();

  const [age, setAge] = useState<string>(String(teaserDefaults.currentAge));
  const [retireAt, setRetireAt] = useState<string>(
    String(teaserDefaults.targetRetirementAge),
  );
  const [saved, setSaved] = useState<string>(
    formatUsd(teaserDefaults.currentSavings),
  );
  const [spend, setSpend] = useState<string>(
    formatUsd(teaserDefaults.monthlySpend),
  );

  const prePct = Math.round(assumedAnnualReturnPre * 100);
  const postPct = Math.round(assumedAnnualReturnPost * 100);

  // Live projection — recomputes from current field values as the user
  // types. Falls back to default age/retire-at so the chart never collapses,
  // but `saved` and `spend` always honor user input (including 0) so the
  // headline stays truthful.
  const livePreview = useMemo(() => {
    const ageNum =
      Number.isFinite(Number(age)) && Number(age) > 0
        ? Number(age)
        : teaserDefaults.currentAge;
    const retireNum =
      Number.isFinite(Number(retireAt)) && Number(retireAt) > ageNum
        ? Number(retireAt)
        : teaserDefaults.targetRetirementAge;
    const savedRaw = parseCurrency(saved);
    const spendRaw = parseCurrency(spend);
    return project({
      currentAge: ageNum,
      retireAt: retireNum,
      saved: Number.isFinite(savedRaw) ? Math.max(0, savedRaw) : 0,
      monthlySpend: Number.isFinite(spendRaw) ? Math.max(0, spendRaw) : 0,
    });
  }, [age, retireAt, saved, spend, teaserDefaults]);

  const shown = livePreview;
  const finalAge = Number(retireAt) || teaserDefaults.targetRetirementAge;
  const startAge = Number(age) || teaserDefaults.currentAge;
  const spendForLabel = (() => {
    const raw = parseCurrency(spend);
    return Number.isFinite(raw) && raw >= 0 ? raw : teaserDefaults.monthlySpend;
  })();

  // Allow advisors to opt out / swap the teaser kind. The life-value variant
  // isn't part of the Direction D mockup — fall back to a minimal label.
  if (config.calculator !== "retirement") return null;

  return (
    <div
      data-anno="calc-teaser"
      className="relative overflow-hidden rounded-3xl p-7 text-white shadow-[0_30px_60px_-30px_rgba(14,42,54,0.6)] md:p-8"
      style={{ backgroundColor: "#0e2a36" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-20 blur-2xl"
        style={{ background: "var(--color-accent)" }}
      />

      {/* Header: brand stamp left, live badge right */}
      <div className="relative flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
          · THE DIMEGUARD NUMBER
        </p>
        <p className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/65">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-[color:var(--color-accent)] ring-2 ring-[color:var(--color-accent)]/25"
          />
          Live · 90 sec
        </p>
      </div>

      {/* Single-stage teaser: chart updates live as user types, CTA always
          advances to the full 4-stage calculator on /retirement-planning. */}
      <div className="relative mt-5 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <FieldNumber
            id={ageId}
            label="Age"
            value={age}
            onChange={setAge}
            min={18}
            max={90}
            placeholder="45"
          />
          <FieldNumber
            id={retireAtId}
            label="Retire at"
            value={retireAt}
            onChange={setRetireAt}
            min={40}
            max={95}
            placeholder="65"
          />
          <FieldCurrency
            id={savedId}
            label="Saved"
            value={saved}
            onChange={setSaved}
            placeholder="$125,000"
          />
          <FieldCurrency
            id={spendId}
            label="Spend / mo"
            value={spend}
            onChange={setSpend}
            placeholder="$6,000"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
          <span>
            Projected, ages {startAge} → {finalAge}
          </span>
          <span className="text-[color:var(--color-accent)]/85">
            +{prePct}% pre-retirement
          </span>
        </div>

        <ProjectionChart series={shown.series} />

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
            Your number
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-4xl font-medium text-[color:var(--color-accent)] md:text-5xl">
            {formatMillions(shown.finalBalance)}
          </p>
          <p className="mt-1.5 text-xs text-white/65">
            vs {formatMillions(shown.requiredNestEgg)} needed for{" "}
            {formatUsd(spendForLabel)}/mo target income
          </p>
        </div>

        <Link
          href="/retirement-planning#calculator"
          onClick={() =>
            track("calculator_teaser_to_full", {
              calculator: "retirement",
              result:
                shown.finalBalance >= shown.requiredNestEgg ? "on_track" : "gap",
            })
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[#0e2a36]"
        >
          Run my number →
        </Link>

        <p className="text-[10px] leading-relaxed text-white/55">
          Estimate · {prePct}% pre / {postPct}% in-retirement · {drawdownYears}-yr
          drawdown · stress-tested both ways. Not advice — for informational
          purposes only.
        </p>
      </div>
    </div>
  );
}

function FieldNumber(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70"
      >
        {props.label}
      </label>
      <input
        id={props.id}
        type="number"
        inputMode="numeric"
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white placeholder:text-white/30 focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/40"
      />
    </div>
  );
}

function FieldCurrency(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70"
      >
        {props.label}
      </label>
      <input
        id={props.id}
        type="text"
        inputMode="numeric"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white placeholder:text-white/30 focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/40"
      />
    </div>
  );
}
