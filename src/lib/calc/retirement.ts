import { siteConfig } from "@/site.config";

export type ChartPoint = { age: number; balance: number };

export type Projection = {
  series: ChartPoint[];
  /** Projected nest egg at retirement (FV_savings + FV_contrib). */
  finalBalance: number;
  /** Required nest egg = monthlySpend * 12 * drawdownYears. */
  requiredNestEgg: number;
};

export type ProjectArgs = {
  currentAge: number;
  retireAt: number;
  saved: number;
  monthlySpend: number;
  monthlyContribution?: number;
};

/**
 * Year-by-year projection of FV_savings + FV_contrib from current age to
 * retirement age. Mirrors the formula in
 * docs/architecture-decisions-2026-05-20.md so the hero number, teaser, and
 * full calculator all produce identical numbers.
 */
export function project(args: ProjectArgs): Projection {
  const {
    assumedAnnualReturnPre: rPre,
    drawdownYears,
    teaserDefaults,
  } = siteConfig.calculators.retirement;
  const monthlyContribution =
    args.monthlyContribution ?? teaserDefaults.monthlyContribution;

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

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

/** Display as $X.XXM for headline numbers; falls back to $XXk under $1M. */
export function formatMillions(value: number): string {
  const v = Math.max(0, value);
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}k`;
  return formatUsd(v);
}
