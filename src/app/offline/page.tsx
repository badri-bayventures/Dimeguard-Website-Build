import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

/**
 * Neutral holding page served (via middleware rewrite, HTTP 503) on every
 * route while `siteConfig.maintenance.enabled` is true. Deliberately carries
 * no business name, logo, services, contact details or links.
 */
export const metadata: Metadata = {
  title: { absolute: "Temporarily offline" },
  description: "This site is temporarily offline.",
  robots: { index: false, follow: false, nocache: true },
};

export default function OfflinePage() {
  const { headline, body } = siteConfig.maintenance;
  return (
    <main
      id="main"
      className="min-h-screen flex items-center justify-center px-6 py-16"
    >
      <div className="max-w-md text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-500 tracking-tight">
          {headline}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[color:var(--color-ink-soft)]">
          {body}
        </p>
      </div>
    </main>
  );
}
