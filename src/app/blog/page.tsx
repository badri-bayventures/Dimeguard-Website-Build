import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { PageStub } from "@/components/page-stub";

const PATH = "/blog";

export const generateMetadata = () => buildMetadata({ path: PATH });

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Blog", path: PATH },
        ])}
        id="ld-breadcrumb"
      />
      <PageStub
        eyebrow="Blog"
        title="Notes on planning."
        lede="Plain-language notes on insurance, retirement, and tax topics that come up in client conversations."
        arrivingIn="Notion-powered posts land in step 6"
        ctaHref="/"
      />
    </>
  );
}
