import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { financialService, breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { PageStub } from "@/components/page-stub";

const PATH = "/life-insurance";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function LifeInsurancePage() {
  return (
    <>
      <JsonLd
        data={financialService(siteConfig, {
          serviceType: "Life insurance",
          path: PATH,
          description:
            "Term and permanent life insurance through a licensed broker, with a Human Life Value calculator that estimates recommended coverage from income and dependents.",
        })}
        id="ld-financialservice"
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Life insurance", path: PATH },
        ])}
        id="ld-breadcrumb"
      />
      <PageStub
        eyebrow="Life insurance"
        title="Estimate the coverage your family may need."
        lede="A short conversation about who depends on your income, what they would need, and which term or permanent coverage may fit your situation."
        arrivingIn="Full page + calculator land in steps 3–4"
        ctaHref="/"
      />
    </>
  );
}
