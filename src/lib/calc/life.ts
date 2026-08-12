import { siteConfig } from "@/site.config";

export type LifeValueResult = {
  /** Income replacement component: income × incomeMultiplier. */
  incomeComponent: number;
  /** Dependent component: income × perDependentMultiplier × dependents. */
  dependentComponent: number;
  /** Gross human life value = incomeComponent + dependentComponent. */
  grossNeed: number;
  /** Existing coverage credited against the gross need. */
  existingCoverage: number;
  /**
   * Signed gap: grossNeed − existingCoverage. Positive = additional coverage
   * indicated; zero or negative = existing coverage meets the estimate.
   */
  gap: number;
  /** Effective multiple of income the gross need represents. */
  effectiveMultiple: number;
};

export type LifeValueArgs = {
  /** Gross annual income to replace. Clamped to ≥ 0. */
  annualIncome: number;
  /** Number of dependents. Clamped to an integer ≥ 0. */
  dependents: number;
  /** In-force life insurance coverage. Clamped to ≥ 0. */
  existingCoverage: number;
  /**
   * Years of income to replace. Defaults to the configured
   * `incomeMultiplier` so the config stays the single source of truth.
   */
  incomeMultiplier?: number;
};

function clampNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Human Life Value estimate.
 *
 * Formula (mirrors `siteConfig.calculators.life`):
 *
 *   grossNeed = income × incomeMultiplier
 *             + income × perDependentMultiplier × dependents
 *   gap       = grossNeed − existingCoverage
 *
 * The income-multiple method is deliberately simple: each dependent adds one
 * further year of income on top of the base multiple. Like the retirement
 * projection, it is a directional estimate for a conversation — not an
 * underwriting figure and not advice.
 */
export function lifeValue(args: LifeValueArgs): LifeValueResult {
  const { incomeMultiplier: defaultMultiplier, perDependentMultiplier } =
    siteConfig.calculators.life;

  const income = clampNonNegative(args.annualIncome);
  const dependents = Math.floor(clampNonNegative(args.dependents));
  const existingCoverage = clampNonNegative(args.existingCoverage);
  const incomeMultiplier = clampNonNegative(
    args.incomeMultiplier ?? defaultMultiplier,
  );

  const incomeComponent = income * incomeMultiplier;
  const dependentComponent = income * perDependentMultiplier * dependents;
  const grossNeed = incomeComponent + dependentComponent;
  const gap = grossNeed - existingCoverage;
  const effectiveMultiple =
    income > 0 ? grossNeed / income : incomeMultiplier;

  return {
    incomeComponent,
    dependentComponent,
    grossNeed,
    existingCoverage,
    gap,
    effectiveMultiple,
  };
}
