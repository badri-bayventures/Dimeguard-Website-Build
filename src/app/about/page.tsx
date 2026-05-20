import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { person, localBusiness, breadcrumb } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { PageStub } from "@/components/page-stub";

export const generateMetadata = () => buildMetadata({ path: "/about" });

export default function AboutPage() {
  return (
    <>
      <JsonLd data={person(siteConfig)} id="ld-person" />
      <JsonLd data={localBusiness(siteConfig)} id="ld-localbusiness" />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
        id="ld-breadcrumb"
      />
      <PageStub
        eyebrow="About"
        title={`Meet ${siteConfig.advisor.fullName}.`}
        lede={siteConfig.advisor.bioSnippet}
        arrivingIn="Full bio, photo, and credentials land in step 3"
        ctaHref="/retirement-planning"
        ctaLabel="See the retirement check"
      />
    </>
  );
}
