export type InflationResult = {
  /** What today's amount will buy in future dollars terms after N years. */
  purchasingPower: number;
  /** What today's amount of goods will cost in N years. */
  equivalentCost: number;
  /** Share of purchasing power lost, 0..1. */
  powerLost: number;
};

export type InflationArgs = {
  /** Today's dollar amount. Clamped to ≥ 0. */
  amount: number;
  /** Years into the future. Clamped to ≥ 0, floored to an integer. */
  years: number;
  /** Annual inflation rate as a decimal (e.g. 0.03). Clamped to ≥ 0. */
  annualInflation: number;
};

function clampNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Inflation impact estimate — compound erosion of purchasing power.
 *
 *   purchasingPower = amount / (1 + i)^years
 *   equivalentCost  = amount × (1 + i)^years
 *
 * A single flat rate, compounded annually. Like the other calculators this is
 * a directional estimate for a conversation, not a forecast.
 */
export function inflationImpact(args: InflationArgs): InflationResult {
  const amount = clampNonNegative(args.amount);
  const years = Math.floor(clampNonNegative(args.years));
  const rate = clampNonNegative(args.annualInflation);

  const factor = Math.pow(1 + rate, years);
  const purchasingPower = factor === 0 ? amount : amount / factor;
  const equivalentCost = amount * factor;
  const powerLost = amount > 0 ? 1 - purchasingPower / amount : 0;

  return { purchasingPower, equivalentCost, powerLost };
}
