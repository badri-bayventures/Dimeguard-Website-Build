"use client";

import { useId, useMemo, useState } from "react";
import { siteConfig } from "@/site.config";
import { track } from "@/lib/analytics/track";
import { formatUsd } from "@/lib/calc/retirement";
import { lifeValue } from "@/lib/calc/life";
import { LeadGate } from "./lead-gate";
import { ButtonLink } from "./button";

/**
 * Full Human Life Value calculator.
 *
 * Same free/gated split as the retirement calculator: the inputs and the
 * gross coverage estimate stay visible (the indexable, trust-building
 * surface); the interpretation — gap vs existing coverage and what it
 * implies — sits behind the lead gate. The math lives in `lib/calc/life.ts`
 * and is unit-tested there.
 */

const LIGHT_FIELD =
  "mt-1.5 w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2.5 text-base text-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ink)]/20";

const LABEL =
  "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]";

function parseCurrency(input: string): number {
  const n = Number(input.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function LifeValueCalculator() {
  const { teaserDefaults, incomeMultiplier: defaultMultiplier } =
    siteConfig.calculators.life;
  const ids = {
    income: useId(),
    dependents: useId(),
    coverage: useId(),
    years: useId(),
  };

  const [income, setIncome] = useState("100000");
  const [dependents, setDependents] = useState(
    String(teaserDefaults.dependents),
  );
  const [coverage, setCoverage] = useState(
    String(teaserDefaults.existingCoverage),
  );
  const [yearsOfIncome, setYearsOfIncome] = useState(defaultMultiplier);

  const result = useMemo(
    () =>
      lifeValue({
        annualIncome: parseCurrency(income),
        dependents: Number(dependents),
        existingCoverage: parseCurrency(coverage),
        incomeMultiplier: yearsOfIncome,
      }),
    [income, dependents, coverage, yearsOfIncome],
  );

  const covered = result.gap <= 0;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Inputs + gross estimate — always free. */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={ids.income} className={LABEL}>
                Annual income
              </label>
              <input
                id={ids.income}
                type="text"
                inputMode="numeric"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className={LIGHT_FIELD}
              />
            </div>
            <div>
              <label htmlFor={ids.dependents} className={LABEL}>
                Dependents
              </label>
              <input
                id={ids.dependents}
                type="number"
                inputMode="numeric"
                min={0}
                max={12}
                value={dependents}
                onChange={(e) => setDependents(e.target.value)}
                className={LIGHT_FIELD}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={ids.coverage} className={LABEL}>
                Life insurance you already have
              </label>
              <input
                id={ids.coverage}
                type="text"
                inputMode="numeric"
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
                className={LIGHT_FIELD}
              />
            </div>
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
            Estimated coverage to discuss
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-4xl text-[color:var(--color-ink)]">
            {formatUsd(result.grossNeed)}
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            {result.effectiveMultiple.toFixed(0)}× your annual income —{" "}
            {yearsOfIncome} years of income replacement
            {Number(dependents) > 0
              ? ` plus ${dependents} more for your dependent${Number(dependents) === 1 ? "" : "s"}`
              : ""}
            .
          </p>
        </div>

        {/* Assumptions stay visible and adjustable — never collapsed. */}
        <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
            Assumptions — adjust these
          </p>
          <div className="mt-4">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor={ids.years} className={LABEL}>
                Years of income to replace
              </label>
              <span className="text-sm font-semibold tabular-nums text-[color:var(--color-ink)]">
                {yearsOfIncome}
              </span>
            </div>
            <input
              id={ids.years}
              type="range"
              min={5}
              max={20}
              step={1}
              value={yearsOfIncome}
              onChange={(e) => setYearsOfIncome(Number(e.target.value))}
              className="mt-2 w-full accent-[color:var(--color-ink)]"
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[color:var(--color-muted)]">
            A simple income-multiple method: each dependent adds one further
            year of income on top of the base multiple. It ignores debts,
            college costs, a surviving partner&rsquo;s income, and how the
            proceeds would be invested — all of which matter in practice. A
            directional estimate for a conversation, not an underwriting
            figure.
          </p>
        </div>
      </div>

      {/* Interpretation — gated. */}
      <div className="lg:col-span-5">
        <LeadGate
          source="Human Life Value calculator"
          storageKey="dg-gate-life-value"
          title="See what this number means"
          blurb="Your readout compares the estimate against the coverage you already have, and flags the gap in plain language."
          submitLabel="Show my readout"
        >
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
              Your readout
            </p>

            <dl className="mt-5 space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-[color:var(--color-muted)]">
                  Estimated need
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {formatUsd(result.grossNeed)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-[color:var(--color-muted)]">
                  Coverage in place
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {formatUsd(result.existingCoverage)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-[color:var(--color-border)] pt-4">
                <dt className="text-sm font-semibold text-[color:var(--color-ink)]">
                  {covered ? "Estimate met" : "Potential gap"}
                </dt>
                <dd className="text-2xl font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {formatUsd(Math.abs(result.gap))}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-sm leading-relaxed text-[color:var(--color-muted)]">
              {covered
                ? "On these assumptions, the coverage you already have meets the estimate. The useful questions become whether the policy type still fits, how long the term runs, and whether the beneficiaries are current."
                : "On these assumptions there's a gap between the coverage you have and what replacing your income would take. Whether — and how — to close it depends on your budget, your health, and whether term or permanent coverage fits; that's a conversation, not a checkout."}
            </p>

            <div className="mt-6">
              <ButtonLink
                href="/book?source=life"
                onClick={() =>
                  track("calculator_readout_cta", {
                    source: "life_value",
                    covered,
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
