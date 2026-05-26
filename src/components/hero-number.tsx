import Link from "next/link";
import { siteConfig } from "@/site.config";
import { project, formatMillions } from "@/lib/calc/retirement";

export function HeroNumber() {
  const { teaserDefaults } = siteConfig.calculators.retirement;
  const { currentAge, targetRetirementAge, monthlyContribution, currentSavings, monthlySpend } =
    teaserDefaults;

  const { finalBalance } = project({
    currentAge,
    retireAt: targetRetirementAge,
    saved: currentSavings,
    monthlySpend,
    monthlyContribution,
  });

  const contributionLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthlyContribution);

  return (
    <div className="relative flex flex-col items-start md:items-end">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-soft)]">
        Projected — a sample profile
      </p>
      <div className="relative mt-4 w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(200,224,74,0.55), rgba(200,224,74,0) 70%)",
          }}
        />
        <p
          className="font-[family-name:var(--font-display)] text-[8rem] leading-none tracking-tight text-[color:var(--color-accent)] md:text-right md:text-[10rem]"
          style={{ fontWeight: 500 }}
        >
          {formatMillions(finalBalance)}
        </p>
      </div>
      <p className="mt-5 max-w-sm text-base text-[color:var(--color-ink-soft)] md:text-right md:text-lg">
        What a {currentAge}-year-old saving {contributionLabel}/month could have by age{" "}
        {targetRetirementAge}.
      </p>
      <Link
        href="/#calculator"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-ink)] underline decoration-[color:var(--color-accent)] decoration-2 underline-offset-4 transition hover:text-[color:var(--color-ink-soft)]"
      >
        Run yours →
      </Link>
    </div>
  );
}
