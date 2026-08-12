"use client";

import { useId, useMemo, useState } from "react";
import { formatUsd } from "@/lib/calc/retirement";
import { inflationImpact } from "@/lib/calc/inflation";

/**
 * Native Inflation Impact calculator (built in-house 2026-08-07, replacing
 * the originally planned third-party embed — no external script, no vendor
 * account, same visual system as the other calculators).
 *
 * Deliberately ungated: the proposal gates only the two native lead-capture
 * calculators (retirement, life value). This one is quick what-if math and
 * stays fully free.
 */

const LIGHT_FIELD =
  "mt-1.5 w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2.5 text-base text-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ink)]/20";

const LABEL =
  "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]";

function parseCurrency(input: string): number {
  const n = Number(input.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function InflationCalculator() {
  const ids = { amount: useId(), years: useId(), rate: useId() };

  const [amount, setAmount] = useState("100000");
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(3);

  const result = useMemo(
    () =>
      inflationImpact({
        amount: parseCurrency(amount),
        years,
        annualInflation: rate / 100,
      }),
    [amount, years, rate],
  );

  const milestones = useMemo(
    () =>
      [10, 20, 30].map((y) => ({
        years: y,
        ...inflationImpact({
          amount: parseCurrency(amount),
          years: y,
          annualInflation: rate / 100,
        }),
      })),
    [amount, rate],
  );

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
          <div>
            <label htmlFor={ids.amount} className={LABEL}>
              Amount in today&rsquo;s dollars
            </label>
            <input
              id={ids.amount}
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={LIGHT_FIELD}
            />
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={ids.years} className={LABEL}>
                  Years from now
                </label>
                <span className="text-sm font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {years}
                </span>
              </div>
              <input
                id={ids.years}
                type="range"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="mt-2 w-full accent-[color:var(--color-ink)]"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={ids.rate} className={LABEL}>
                  Annual inflation
                </label>
                <span className="text-sm font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {rate.toFixed(1)}%
                </span>
              </div>
              <input
                id={ids.rate}
                type="range"
                min={0}
                max={8}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-2 w-full accent-[color:var(--color-ink)]"
              />
            </div>
          </div>

          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
            What it would buy in {years} years
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-4xl text-[color:var(--color-ink)]">
            {formatUsd(result.purchasingPower)}
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            About {(result.powerLost * 100).toFixed(0)}% of today&rsquo;s
            purchasing power lost. Put the other way: what costs{" "}
            {formatUsd(parseCurrency(amount))} today would cost about{" "}
            {formatUsd(result.equivalentCost)} then.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6">
          <p className="text-xs leading-relaxed text-[color:var(--color-muted)]">
            A single flat rate, compounded annually. Real inflation moves year
            to year and differs by category — housing, healthcare, and college
            tend to run hotter than the average. A directional estimate for a
            conversation, not a forecast.
          </p>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
            At {rate.toFixed(1)}% per year
          </p>
          <dl className="mt-5 space-y-4">
            {milestones.map((m) => (
              <div
                key={m.years}
                className="flex items-baseline justify-between gap-4"
              >
                <dt className="text-sm text-[color:var(--color-muted)]">
                  In {m.years} years
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-[color:var(--color-ink)]">
                  {formatUsd(m.purchasingPower)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-[color:var(--color-muted)]">
            This is why &ldquo;keeping it in cash&rdquo; is itself a decision
            with a cost — and why retirement planning talks about real
            (after-inflation) income, not just a nest-egg number.
          </p>
        </div>
      </div>
    </div>
  );
}
