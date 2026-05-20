import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { PageStub } from "@/components/page-stub";

const PATH = "/calculators/inflation";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function InflationCalculatorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators/inflation" },
          { name: "Inflation", path: PATH },
        ])}
        id="ld-breadcrumb"
      />
      <PageStub
        eyebrow="Calculator"
        title="See what your savings may buy in 10, 20, 30 years."
        lede="Estimate how inflation may erode purchasing power over time — quick what-if math for planning conversations."
        arrivingIn="Calconic embed lands in step 4"
        ctaHref="/"
      />
    </>
  );
}
