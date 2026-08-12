"use client";

import { useId, useMemo, useState } from "react";
import { siteConfig } from "@/site.config";
import { track } from "@/lib/analytics/track";
import {
  project,
  formatUsd,
  formatMillions,
  type ChartPoint,
} from "@/lib/calc/retirement";
import { LeadGate } from "./lead-gate";
import { ButtonLink } from "./button";

/**
 * Full Retirement Readiness calculator.
 *
 * Shares `project()` with the hero teaser so both surfaces always produce the
 * same numbers — the math lives in `lib/calc/retirement.ts` and is unit-tested
 * there. The field styling is deliberately NOT shared with `calc-teaser.tsx`:
 * that component sits on the dark hero and its inputs are styled for it.
 *
 * Split of free vs gated is intentional. Inputs and the growth curve are
 * always visible — that is the part worth indexing and worth a visitor's
 * trust. The interpretation (required nest egg, surplus or shortfall, what it
 * implies) sits behind the lead gate.
 */

const LIGHT_FIELD =
  "mt-1.5 w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2.5 text-base text-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ink)]/20";

const LABEL =
  "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]";

function parseCurrency(input: string): number {
  const n = Number(input.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function clamp(value: number, lo: number, hi: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(hi, Math.max(lo, value));
}

/** Inline SVG line chart. No chart library — keeps the page hydration-light. */
function GrowthChart({ series }: { series: ChartPoint[] }) {
  const width = 560;
  const height = 200;
  const padX = 8;
  const padY = 12;
  const titleId = useId();

  const path = useMemo(() => {
    if (series.length < 2) return "";
    const max = Math.max(...series.map((p) => p.balance), 1);
    const stepX = (width - padX * 2) / (series.length - 1);
    return series
      .map((p, i) => {
        const x = padX + i * stepX;
        const y = height - padY - (p.balance / max) * (height - padY * 2);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [series]);

  const first = series[0];
  const last = series[series.length - 1];

  return (
    <figure className="mt-6">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-labelledby={titleId}
        preserveAspectRatio="none"
      >
        <title id={titleId}>
          {first && last
            ? `Projected balance growing from ${formatUsd(first.balance)} at age ${first.age} to ${formatUsd(last.balance)} at age ${last.age}.`
            : "Projected balance over time."}
        </title>
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={width - padX}
            y1={padY + t * (height - padY * 2)}
            y2={padY + t * (height - padY * 2)}
            stroke="currentColor"
            strokeWidth={1}
            className="text-[color:var(--color-border)]"
          />
        ))}
        {path ? (
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[color:var(--color-ink)]"
          />
        ) : null}
      </svg>
      <figcaption className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
        <span>Age {first?.age ?? "—"}</span>
        <span>Age {last?.age ?? "—"}</span>
      </figcaption>
    </figure>
  );
}

export function RetirementCalculator() {
  const { teaserDefaults, drawdownYears: defaultDrawdown } =
    siteConfig.calculators.retirement;
  const ids = {
    age: useId(),
    retire: useId(),
    saved: useId(),
    contrib: useId(),
    spend: useId(),
    ret: useId(),
    draw: useId(),
  };

  const [currentAge, setCurrentAge] = useState(String(teaserDefaults.currentAge));
  const [retireAt, setRetireAt] = useState(
    String(teaserDefaults.targetRetirementAge),
  );
  const [saved, setSaved] = useState(String(teaserDefaults.currentSavings));
  const [contribution, setContribution] = useState(
    String(teaserDefaults.monthlyContribution),
  );
  const [monthlySpend, setMonthlySpend] = useState(
    String(teaserDefaults.monthlySpend),
  );
  const [annualReturn, setAnnualReturn] = useState(
    teaserDefaults.expectedReturn * 100,
  );
  const [drawdownYears, setDrawdownYears] = useState(defaultDrawdown);

  const age = clamp(Number(currentAge), 18, 85, teaserDefaults.currentAge);
  const retire = clamp(
    Number(retireAt),
    age + 1,
    95,
    teaserDefaults.targetRetirementAge,
  );

  const result = useMemo(
    () =>
      project({
        currentAge: age,
        retireAt: retire,
        saved: parseCurrency(saved),
        monthlySpend: parseCurrency(monthlySpend),
        monthlyContribution: parseCurrency(contribution),
        annualReturn: annualReturn / 100,
        drawdownYears,
      }),
    [age, retire, saved, monthlySpend, contribution, annualReturn, drawdownYears],
  );

  const gap = result.finalBalance - result.requiredNestEgg;
  const onTrack = gap >= 0;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Inputs + curve — always free. */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={ids.age} className={LABEL}>
                Current age
              </label>
              <input
                id={ids.age}
                type="number"
                inputMode="numeric"
                min={18}
                max={85}
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                className={LIGHT_FIELD}
              />
            </div>
            <div>
              <label htmlFor={ids.retire} className={LABEL}>
                Retire at
              </label>
              <input
                id={ids.retire}
                type="number"
                inputMode="numeric"
                min={age + 1}
                max={95}
                value={retireAt}
                onChange={(e) => setRetireAt(e.target.value)}
                className={LIGHT_FIELD}
              />
            </div>
            <div>
              <label htmlFor={ids.saved} className={LABEL}>
                Saved so far
              </label>
              <input
                id={ids.saved}
                type="text"
                inputMode="numeric"
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                className={LIGHT_FIELD}
              />
            </div>
            <div>
              <label htmlFor={ids.contrib} className={LABEL}>
                Saving per month
              </label>
              <input
                id={ids.contrib}
                type="text"
                inputMode="numeric"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                className={LIGHT_FIELD}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={ids.spend} className={LABEL}>
                Monthly spending in retirement
              </label>
              <input
                id={ids.spend}
                type="text"
                inputMode="numeric"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(e.target.value)}
                className={LIGHT_FIELD}
              />
            </div>
          </div>

          <GrowthChart series={result.series} />

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
            Projected at age {retire}
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-4xl text-[color:var(--color-ink)]">
            {formatMillions(result.finalBalance)}
          </p>
        </div>

        {/* Assumptions stay visible and adjustable — never collapsed behind a
            click. A projection whose assumptions are hidden is a sales prop. */}
        <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
            Assumptions — adjust these
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={ids.ret} className={LABEL}>
                  Annual return before retiring
                </label>
                <span className="text-sm font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {annualReturn.toFixed(1)}%
                </span>
              </div>
              <input
                id={ids.ret}
                type="range"
                min={1}
                max={12}
                step={0.5}
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="mt-2 w-full accent-[color:var(--color-ink)]"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={ids.draw} className={LABEL}>
                  Years in retirement
                </label>
                <span className="text-sm font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {drawdownYears}
                </span>
              </div>
              <input
                id={ids.draw}
                type="range"
                min={10}
                max={40}
                step={1}
                value={drawdownYears}
                onChange={(e) => setDrawdownYears(Number(e.target.value))}
                className="mt-2 w-full accent-[color:var(--color-ink)]"
              />
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[color:var(--color-muted)]">
            A single flat return, no inflation adjustment, and no tax treatment.
            Real markets do not move in straight lines — this is a directional
            estimate for a conversation, not a projection of what will happen.
          </p>
        </div>
      </div>

      {/* Interpretation — gated. */}
      <div className="lg:col-span-5">
        <LeadGate
          source="Retirement Readiness calculator"
          storageKey="dg-gate-retirement"
          title="See what this number means"
          blurb="Your readout compares the projection against what you'd actually need, and flags the gap in plain language."
          submitLabel="Show my readout"
        >
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
              Your readout
            </p>

            <dl className="mt-5 space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-[color:var(--color-muted)]">
                  Projected at {retire}
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {formatUsd(result.finalBalance)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-[color:var(--color-muted)]">
                  Needed for {drawdownYears} years
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {formatUsd(result.requiredNestEgg)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-[color:var(--color-border)] pt-4">
                <dt className="text-sm font-semibold text-[color:var(--color-ink)]">
                  {onTrack ? "Surplus" : "Shortfall"}
                </dt>
                <dd className="text-2xl font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {formatUsd(Math.abs(gap))}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-sm leading-relaxed text-[color:var(--color-muted)]">
              {onTrack
                ? `On these assumptions you'd reach ${retire} with more than the ${drawdownYears} years of spending you described. The useful questions become how much of it is exposed to a bad sequence of returns, and how it gets passed on.`
                : `On these assumptions there's a gap between what you'd have at ${retire} and what ${drawdownYears} years of that spending needs. Closing it usually comes down to some mix of saving more, working slightly longer, spending less in retirement, or covering part of the income differently.`}
            </p>

            <div className="mt-6">
              <ButtonLink
                href="/book"
                onClick={() =>
                  track("calculator_readout_cta", {
                    source: "retirement",
                    on_track: onTrack,
                  })
                }
              >
                {siteConfig.ctaLabels.bookCall}
              </ButtonLink>
            </div>
          </div>
        </LeadGate>
      </div>
    </div>
  );
}
