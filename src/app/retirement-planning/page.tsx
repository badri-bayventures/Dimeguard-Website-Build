import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { financialService, breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { PageStub } from "@/components/page-stub";

const PATH = "/retirement-planning";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function RetirementPlanningPage() {
  return (
    <>
      <JsonLd
        data={financialService(siteConfig, {
          serviceType: "Retirement planning",
          path: PATH,
          description:
            "Retirement readiness review — estimate gap to target retirement income from current savings, contributions, and timeline.",
        })}
        id="ld-financialservice"
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Retirement planning", path: PATH },
        ])}
        id="ld-breadcrumb"
      />
      <PageStub
        eyebrow="Retirement planning"
        title="Find out where you stand."
        lede="A short, free retirement readiness check designed to help you see your current gap and what your options may be."
        arrivingIn="Full page + calculator land in steps 3–4"
        ctaHref="/"
      />
    </>
  );
}
