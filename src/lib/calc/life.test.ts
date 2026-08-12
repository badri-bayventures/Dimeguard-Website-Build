import { describe, expect, it } from "vitest";

import { lifeValue } from "./life";
import { siteConfig } from "@/site.config";

const { incomeMultiplier, perDependentMultiplier } = siteConfig.calculators.life;

describe("lifeValue", () => {
  it("computes gross need as income × multiplier with no dependents", () => {
    const r = lifeValue({
      annualIncome: 100_000,
      dependents: 0,
      existingCoverage: 0,
    });
    expect(r.incomeComponent).toBe(100_000 * incomeMultiplier);
    expect(r.dependentComponent).toBe(0);
    expect(r.grossNeed).toBe(100_000 * incomeMultiplier);
  });

  it("adds one perDependentMultiplier of income per dependent", () => {
    const r = lifeValue({
      annualIncome: 100_000,
      dependents: 2,
      existingCoverage: 0,
    });
    expect(r.dependentComponent).toBe(100_000 * perDependentMultiplier * 2);
    expect(r.grossNeed).toBe(
      100_000 * (incomeMultiplier + perDependentMultiplier * 2),
    );
  });

  it("credits existing coverage against the gross need", () => {
    const r = lifeValue({
      annualIncome: 100_000,
      dependents: 2,
      existingCoverage: 500_000,
    });
    expect(r.gap).toBe(r.grossNeed - 500_000);
    expect(r.gap).toBeGreaterThan(0);
  });

  it("reports a non-positive gap when coverage meets the estimate", () => {
    const gross = 100_000 * (incomeMultiplier + perDependentMultiplier * 2);
    const r = lifeValue({
      annualIncome: 100_000,
      dependents: 2,
      existingCoverage: gross + 250_000,
    });
    expect(r.gap).toBe(-250_000);
  });

  it("matches the config defaults used by the teaser", () => {
    const { teaserDefaults } = siteConfig.calculators.life;
    const r = lifeValue({
      annualIncome: 100_000,
      dependents: teaserDefaults.dependents,
      existingCoverage: teaserDefaults.existingCoverage,
    });
    expect(r.grossNeed).toBe(
      100_000 *
        (incomeMultiplier + perDependentMultiplier * teaserDefaults.dependents),
    );
  });

  it("returns zeros for zero income", () => {
    const r = lifeValue({ annualIncome: 0, dependents: 3, existingCoverage: 0 });
    expect(r.grossNeed).toBe(0);
    expect(r.gap).toBe(0);
    expect(r.effectiveMultiple).toBe(incomeMultiplier);
  });

  it("clamps negative and non-finite inputs to zero", () => {
    const r = lifeValue({
      annualIncome: -50_000,
      dependents: Number.NaN,
      existingCoverage: -10,
    });
    expect(r.grossNeed).toBe(0);
    expect(r.existingCoverage).toBe(0);
    expect(r.gap).toBe(0);
  });

  it("floors fractional dependents", () => {
    const a = lifeValue({
      annualIncome: 100_000,
      dependents: 2.9,
      existingCoverage: 0,
    });
    const b = lifeValue({
      annualIncome: 100_000,
      dependents: 2,
      existingCoverage: 0,
    });
    expect(a.grossNeed).toBe(b.grossNeed);
  });

  it("honors an explicit incomeMultiplier override", () => {
    const r = lifeValue({
      annualIncome: 80_000,
      dependents: 0,
      existingCoverage: 0,
      incomeMultiplier: 12,
    });
    expect(r.grossNeed).toBe(960_000);
    expect(r.effectiveMultiple).toBe(12);
  });

  it("reports the effective income multiple including dependents", () => {
    const r = lifeValue({
      annualIncome: 100_000,
      dependents: 2,
      existingCoverage: 0,
    });
    expect(r.effectiveMultiple).toBeCloseTo(
      incomeMultiplier + perDependentMultiplier * 2,
    );
  });
});
