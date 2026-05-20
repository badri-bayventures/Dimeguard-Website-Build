"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { track } from "@/lib/analytics/track";

type RetirementResult = {
  kind: "on_track" | "gap";
  amount: number;
};

type LifeResult = {
  kind: "covered" | "gap";
  amount: number;
};

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

function computeRetirementGap(args: {
  currentAge: number;
  currentSavings: number;
}): RetirementResult {
  const { assumedAnnualReturn: r, drawdownYears, teaserDefaults } =
    siteConfig.calculators.retirement;
  const { targetRetirementAge, targetMonthlyIncome, monthlyContribution } =
    teaserDefaults;

  const n = Math.max(0, targetRetirementAge - args.currentAge);
  const fvSavings = args.currentSavings * Math.pow(1 + r, n);
  const monthlyRate = r / 12;
  const months = n * 12;
  const fvContrib =
    monthlyRate === 0
      ? monthlyContribution * months
      : monthlyContribution *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const requiredNestEgg = targetMonthlyIncome * 12 * drawdownYears;
  const gap = requiredNestEgg - (fvSavings + fvContrib);
  return gap <= 0
    ? { kind: "on_track", amount: 0 }
    : { kind: "gap", amount: gap };
}

function computeLifeGap(args: {
  annualIncome: number;
}): LifeResult {
  const { incomeMultiplier, teaserDefaults } = siteConfig.calculators.life;
  const { dependents, existingCoverage } = teaserDefaults;
  const recommended =
    args.annualIncome * (incomeMultiplier + dependents);
  const gap = recommended - existingCoverage;
  return gap <= 0
    ? { kind: "covered", amount: 0 }
    : { kind: "gap", amount: gap };
}

type Stage = "input" | "result";

export function CalcTeaser() {
  const config = siteConfig.heroCalcTeaser;
  const kind = config.calculator;

  const ageId = useId();
  const savingsId = useId();

  const [stage, setStage] = useState<Stage>("input");
  const [age, setAge] = useState<string>("");
  const [savings, setSavings] = useState<string>("");
  const [result, setResult] = useState<
    RetirementResult | LifeResult | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const headline =
    kind === "retirement"
      ? "Are you on track for retirement?"
      : "How much coverage may your family need?";
  const subhead =
    kind === "retirement"
      ? "A 30-second estimate. No email required."
      : "A 30-second estimate. No email required.";
  const fullHref =
    kind === "retirement" ? "/retirement-planning" : "/life-insurance";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ageNum = Number(age);
    const savingsNum = Number(savings.replace(/[$,\s]/g, ""));
    if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 90) {
      setError("Enter an age between 18 and 90.");
      return;
    }
    if (!Number.isFinite(savingsNum) || savingsNum < 0) {
      setError("Enter a non-negative savings amount.");
      return;
    }
    setError(null);
    const computed =
      kind === "retirement"
        ? computeRetirementGap({
            currentAge: ageNum,
            currentSavings: savingsNum,
          })
        : // For the life-value teaser, the "savings" field is reused as
          // annual income (label changes below) so the form stays 2 fields.
          computeLifeGap({ annualIncome: savingsNum });
    setResult(computed);
    setStage("result");
    track("calculator_teaser_engaged", {
      calculator: kind,
      result: computed.kind,
    });
  }

  function handleReset() {
    setStage("input");
    setResult(null);
  }

  return (
    <div
      data-anno="calc-teaser"
      className="relative overflow-hidden rounded-3xl p-8 text-white shadow-[0_30px_60px_-30px_rgba(14,42,54,0.6)]"
      style={{ backgroundColor: "#0e2a36" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-20 blur-2xl"
        style={{ background: "var(--color-accent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full opacity-15 blur-2xl"
        style={{ background: "var(--color-secondary)" }}
      />

      <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
        Quick check
      </p>
      <h2 className="relative mt-3 font-[family-name:var(--font-display)] text-2xl font-medium leading-tight md:text-3xl">
        {headline}
      </h2>
      <p className="relative mt-2 text-sm text-white/70">{subhead}</p>

      {stage === "input" ? (
        <form
          onSubmit={handleSubmit}
          className="relative mt-6 space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor={ageId}
              className="block text-xs font-medium uppercase tracking-wider text-white/75"
            >
              Your current age
            </label>
            <input
              id={ageId}
              type="number"
              inputMode="numeric"
              min={18}
              max={90}
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="45"
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white placeholder:text-white/30 focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/40"
            />
          </div>
          <div>
            <label
              htmlFor={savingsId}
              className="block text-xs font-medium uppercase tracking-wider text-white/75"
            >
              {kind === "retirement"
                ? "Current retirement savings"
                : "Annual household income"}
            </label>
            <input
              id={savingsId}
              type="text"
              inputMode="numeric"
              required
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              placeholder="$125,000"
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white placeholder:text-white/30 focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/40"
            />
          </div>
          {error ? (
            <p className="text-sm text-[color:var(--color-accent)]">{error}</p>
          ) : null}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[#0e2a36]"
          >
            See your gap →
          </button>
          <p className="text-[11px] leading-relaxed text-white/55">
            Estimate uses assumed {Math.round(
              siteConfig.calculators.retirement.assumedAnnualReturn * 100,
            )}
            % annual return, retirement at{" "}
            {siteConfig.calculators.retirement.teaserDefaults.targetRetirementAge}
            , and {formatUsd(
              siteConfig.calculators.retirement.teaserDefaults
                .targetMonthlyIncome,
            )}
            /mo target income. Not advice — for informational purposes only.
          </p>
        </form>
      ) : (
        <div className="relative mt-6 space-y-5">
          <div className="rounded-2xl bg-white/[0.06] p-5">
            {result?.kind === "on_track" || result?.kind === "covered" ? (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                  Estimated status
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium text-[color:var(--color-accent)]">
                  You may be on track.
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Based on the assumptions above. The full breakdown shows
                  where this estimate is most sensitive.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                  Estimated gap
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-medium text-[color:var(--color-accent)] md:text-5xl">
                  {formatUsd(result?.amount ?? 0)}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Between the assumed nest egg you would need and what your
                  current savings and contributions may grow to.
                </p>
              </>
            )}
          </div>
          <Link
            href={fullHref}
            onClick={() =>
              track("calculator_teaser_to_full", { calculator: kind })
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:brightness-95"
          >
            Get the full breakdown →
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="block w-full text-center text-xs text-white/55 underline-offset-4 hover:text-white/80 hover:underline"
          >
            Try different numbers
          </button>
        </div>
      )}
    </div>
  );
}
