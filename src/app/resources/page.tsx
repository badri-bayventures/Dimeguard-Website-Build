import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { Disclosure } from "@/components/disclosure";
import {
  ResourceDownloads,
  type ResourceFile,
} from "@/components/resource-downloads";

const PATH = "/resources";

export const generateMetadata = () => buildMetadata({ path: PATH });

const files: ResourceFile[] = [
  {
    title: "Net worth tracker",
    description:
      "One column per quarter: assets on top, liabilities below, net worth at the bottom. The quarterly trend tells you more than any single number.",
    href: "/downloads/dimeguard-net-worth-tracker.csv",
    format: "CSV · opens in Excel, Google Sheets, or Numbers",
  },
  {
    title: "Monthly budget",
    description:
      "Planned vs actual for income, fixed expenses, savings goals, and flexible spending. The goal is awareness, not perfection.",
    href: "/downloads/dimeguard-monthly-budget.csv",
    format: "CSV · opens in Excel, Google Sheets, or Numbers",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Resources", path: PATH },
        ])}
        id="ld-breadcrumb"
      />

      <Hero
        eyebrow="Resources"
        title={<>Planning tools and spreadsheets.</>}
        lede={
          <>
            Free files for net worth tracking and monthly budgeting — the same
            ones used in the conversations we have with clients every week. No
            formulas to fight; just fill in the numbers.
          </>
        }
      />

      <Section>
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionHeading
              eyebrow="What's inside"
              title="Two files, kept deliberately simple."
              lede="Each one fits on a single sheet and takes minutes to fill in."
            />
            <div className="mt-8 space-y-6">
              {files.map((file) => (
                <div
                  key={file.href}
                  className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6"
                >
                  <p className="font-semibold text-[color:var(--color-ink)]">
                    {file.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
                    {file.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-6">
            <ResourceDownloads files={files} />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <Disclosure />
      </Section>
    </>
  );
}
