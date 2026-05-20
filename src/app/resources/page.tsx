import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { PageStub } from "@/components/page-stub";

const PATH = "/resources";

export const generateMetadata = () => buildMetadata({ path: PATH });

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
      <PageStub
        eyebrow="Resources"
        title="Planning tools and spreadsheets."
        lede="Free files for net worth tracking and monthly budgeting — used in the conversations Saral has with clients every week."
        arrivingIn="Tool list + gated downloads land in steps 3 and 5"
        ctaHref="/"
      />
    </>
  );
}
