import { describe, expect, it } from "vitest";

import { inflationImpact } from "./inflation";

describe("inflationImpact", () => {
  it("erodes purchasing power at a compound rate", () => {
    const r = inflationImpact({ amount: 100_000, years: 10, annualInflation: 0.03 });
    expect(r.purchasingPower).toBeCloseTo(100_000 / Math.pow(1.03, 10), 6);
    expect(r.purchasingPower).toBeLessThan(100_000);
  });

  it("compounds the equivalent future cost symmetrically", () => {
    const r = inflationImpact({ amount: 100_000, years: 20, annualInflation: 0.03 });
    expect(r.equivalentCost).toBeCloseTo(100_000 * Math.pow(1.03, 20), 6);
    // Round-trip: purchasingPower × factor = amount
    expect(r.purchasingPower * Math.pow(1.03, 20)).toBeCloseTo(100_000, 6);
  });

  it("is identity at zero inflation", () => {
    const r = inflationImpact({ amount: 50_000, years: 30, annualInflation: 0 });
    expect(r.purchasingPower).toBe(50_000);
    expect(r.equivalentCost).toBe(50_000);
    expect(r.powerLost).toBe(0);
  });

  it("is identity at zero years", () => {
    const r = inflationImpact({ amount: 50_000, years: 0, annualInflation: 0.05 });
    expect(r.purchasingPower).toBe(50_000);
    expect(r.equivalentCost).toBe(50_000);
  });

  it("reports the share of purchasing power lost", () => {
    const r = inflationImpact({ amount: 100_000, years: 24, annualInflation: 0.03 });
    // Rule of 72: ~24 years at 3% roughly halves purchasing power.
    expect(r.powerLost).toBeGreaterThan(0.48);
    expect(r.powerLost).toBeLessThan(0.52);
  });

  it("clamps negative and non-finite inputs", () => {
    const r = inflationImpact({
      amount: -100,
      years: Number.NaN,
      annualInflation: -0.02,
    });
    expect(r.purchasingPower).toBe(0);
    expect(r.equivalentCost).toBe(0);
    expect(r.powerLost).toBe(0);
  });

  it("floors fractional years", () => {
    const a = inflationImpact({ amount: 1_000, years: 9.9, annualInflation: 0.04 });
    const b = inflationImpact({ amount: 1_000, years: 9, annualInflation: 0.04 });
    expect(a.purchasingPower).toBe(b.purchasingPower);
  });
});
