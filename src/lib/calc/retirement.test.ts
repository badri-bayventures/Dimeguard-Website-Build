import { describe, expect, it } from "vitest";
import { siteConfig } from "@/site.config";
import {
  formatMillions,
  formatUsd,
  project,
  type ProjectArgs,
} from "@/lib/calc/retirement";

/**
 * Guards the retirement projection math that powers the homepage hero number
 * and the calculator teaser. The `project()` formula (FV of savings + FV of an
 * annuity of monthly contributions, vs. a required nest egg) can silently drift
 * when defaults/assumptions in `siteConfig.calculators.retirement` change, so we
 * pin a representative set of inputs to independently-computed expected values.
 *
 * Expected values below are computed by hand from the closed-form formulas:
 *   FV_savings  = saved * (1 + r)^years
 *   FV_contrib  = mc * ((1 + r/12)^(years*12) - 1) / (r/12)   [r > 0]
 *               = mc * (years*12)                              [r == 0]
 *   required    = monthlySpend * 12 * drawdownYears
 *                 * (1 + inflation)^years   [if inflation > 0]
 *                 / (1 - taxRate)           [if 0 < taxRate < 1]
 */

const { assumedAnnualReturnPre, drawdownYears, teaserDefaults } =
  siteConfig.calculators.retirement;

describe("project() — config assumptions", () => {
  // These tests bake in the shipped defaults. If they fail because the config
  // changed, that's the safety net working — confirm the new numbers are
  // intentional, then update the expectations.
  it("uses the documented shipped defaults", () => {
    expect(assumedAnnualReturnPre).toBe(0.07);
    expect(drawdownYears).toBe(25);
    expect(teaserDefaults.monthlyContribution).toBe(1500);
  });
});

describe("project() — accumulation phase", () => {
  it("projects the hero-default scenario (45→65, $125k saved, $1,500/mo, 7%)", () => {
    const { series, finalBalance } = project({
      currentAge: 45,
      retireAt: 65,
      saved: 125000,
      monthlySpend: 6000,
    });

    // 20 years of accumulation → 21 points (ages 45..65 inclusive).
    expect(series).toHaveLength(21);
    expect(series[0]).toEqual({ age: 45, balance: 125000 });
    expect(series[series.length - 1].age).toBe(65);

    // FV_savings = 125000 * 1.07^20  +  FV_contrib of $1,500/mo @ 7%/12 for 240mo.
    expect(finalBalance).toBeCloseTo(1265100.5475, 2);
    expect(series[series.length - 1].balance).toBeCloseTo(finalBalance, 6);
  });

  it("matches an annuity-only projection from zero savings (30→60, $500/mo, 6%)", () => {
    const { finalBalance } = project({
      currentAge: 30,
      retireAt: 60,
      saved: 0,
      monthlySpend: 4000,
      monthlyContribution: 500,
      annualReturn: 0.06,
    });

    expect(finalBalance).toBeCloseTo(502257.5212, 2);
  });

  it("respects an explicit annualReturn override over the config default", () => {
    const base: ProjectArgs = {
      currentAge: 45,
      retireAt: 65,
      saved: 125000,
      monthlySpend: 6000,
    };
    const def = project(base);
    const higher = project({ ...base, annualReturn: 0.1 });
    const lower = project({ ...base, annualReturn: 0.04 });

    expect(higher.finalBalance).toBeGreaterThan(def.finalBalance);
    expect(lower.finalBalance).toBeLessThan(def.finalBalance);
  });

  it("the series grows monotonically with positive return and contributions", () => {
    const { series } = project({
      currentAge: 40,
      retireAt: 65,
      saved: 50000,
      monthlySpend: 5000,
    });
    for (let i = 1; i < series.length; i += 1) {
      expect(series[i].balance).toBeGreaterThan(series[i - 1].balance);
      expect(series[i].age).toBe(series[i - 1].age + 1);
    }
  });
});

describe("project() — required nest egg", () => {
  it("computes the nominal required nest egg (spend × 12 × drawdownYears)", () => {
    const { requiredNestEgg } = project({
      currentAge: 45,
      retireAt: 65,
      saved: 125000,
      monthlySpend: 6000,
    });
    // 6000 * 12 * 25
    expect(requiredNestEgg).toBe(1800000);
  });

  it("inflates the required nest egg to future dollars when inflation is given", () => {
    const { requiredNestEgg } = project({
      currentAge: 45,
      retireAt: 65,
      saved: 125000,
      monthlySpend: 6000,
      inflation: 0.03,
    });
    // 1800000 * 1.03^20
    expect(requiredNestEgg).toBeCloseTo(3251000.2224, 2);
  });

  it("grosses up the required nest egg for a pre-tax drawdown when taxRate is given", () => {
    const { requiredNestEgg } = project({
      currentAge: 45,
      retireAt: 65,
      saved: 125000,
      monthlySpend: 6000,
      taxRate: 0.22,
    });
    // 1800000 / (1 - 0.22)
    expect(requiredNestEgg).toBeCloseTo(2307692.3077, 2);
  });

  it("applies inflation then tax gross-up together", () => {
    const { requiredNestEgg } = project({
      currentAge: 45,
      retireAt: 65,
      saved: 125000,
      monthlySpend: 6000,
      inflation: 0.03,
      taxRate: 0.22,
    });
    // 1800000 * 1.03^20 / (1 - 0.22)
    expect(requiredNestEgg).toBeCloseTo(4167949.0031, 2);
  });

  it("ignores non-positive inflation and out-of-range tax rates", () => {
    const nominal = 6000 * 12 * drawdownYears;
    expect(
      project({
        currentAge: 45,
        retireAt: 65,
        saved: 0,
        monthlySpend: 6000,
        inflation: 0,
        taxRate: 0,
      }).requiredNestEgg,
    ).toBe(nominal);
    // taxRate of 1 (or more) would divide by zero / go negative — must be ignored.
    expect(
      project({
        currentAge: 45,
        retireAt: 65,
        saved: 0,
        monthlySpend: 6000,
        taxRate: 1,
      }).requiredNestEgg,
    ).toBe(nominal);
  });
});

describe("project() — edge cases", () => {
  it("handles zero current savings (contributions only)", () => {
    const { series, finalBalance } = project({
      currentAge: 45,
      retireAt: 65,
      saved: 0,
      monthlySpend: 6000,
    });
    expect(series[0]).toEqual({ age: 45, balance: 0 });
    // Pure annuity FV of $1,500/mo @ 7%/12 for 240 months.
    expect(finalBalance).toBeCloseTo(781389.9897, 2);
  });

  it("handles zero contributions (savings growth only)", () => {
    const { finalBalance } = project({
      currentAge: 45,
      retireAt: 65,
      saved: 125000,
      monthlySpend: 6000,
      monthlyContribution: 0,
    });
    // 125000 * 1.07^20
    expect(finalBalance).toBeCloseTo(483710.5578, 2);
  });

  it("handles zero return (linear contribution sum, no compounding)", () => {
    const { series, finalBalance } = project({
      currentAge: 40,
      retireAt: 65,
      saved: 100000,
      monthlySpend: 5000,
      monthlyContribution: 1000,
      annualReturn: 0,
    });
    // 100000 (no growth) + 1000 * 300 months.
    expect(finalBalance).toBe(400000);
    expect(series[series.length - 1].balance).toBe(400000);
  });

  it("returns a flat single-point series at retirement age (years === 0)", () => {
    const { series, finalBalance } = project({
      currentAge: 65,
      retireAt: 65,
      saved: 900000,
      monthlySpend: 6000,
    });
    expect(series).toHaveLength(1);
    expect(series[0]).toEqual({ age: 65, balance: 900000 });
    expect(finalBalance).toBe(900000);
  });

  it("clamps already-past retirement age to zero years (no negative compounding)", () => {
    const { series, finalBalance } = project({
      currentAge: 70,
      retireAt: 65,
      saved: 800000,
      monthlySpend: 6000,
    });
    expect(series).toHaveLength(1);
    expect(series[0]).toEqual({ age: 70, balance: 800000 });
    expect(finalBalance).toBe(800000);
  });
});

describe("formatUsd", () => {
  it("formats whole-dollar USD with no decimals and a thousands separator", () => {
    expect(formatUsd(1265100.5475)).toBe("$1,265,101");
    expect(formatUsd(1800000)).toBe("$1,800,000");
    expect(formatUsd(0)).toBe("$0");
  });

  it("rounds to the nearest dollar", () => {
    expect(formatUsd(99.49)).toBe("$99");
    expect(formatUsd(99.5)).toBe("$100");
  });

  it("clamps negative values to $0", () => {
    expect(formatUsd(-500)).toBe("$0");
  });
});

describe("formatMillions", () => {
  it("renders $X.XXM at or above $1M", () => {
    expect(formatMillions(1_265_100)).toBe("$1.27M");
    expect(formatMillions(1_000_000)).toBe("$1.00M");
    expect(formatMillions(4_167_949)).toBe("$4.17M");
  });

  it("renders $XXk between $1k and $1M", () => {
    expect(formatMillions(781_390)).toBe("$781k");
    expect(formatMillions(1_000)).toBe("$1k");
    expect(formatMillions(999_999)).toBe("$1000k");
  });

  it("falls back to full USD under $1k", () => {
    expect(formatMillions(999)).toBe("$999");
    expect(formatMillions(0)).toBe("$0");
  });

  it("clamps negative values to $0", () => {
    expect(formatMillions(-1_000_000)).toBe("$0");
  });
});
