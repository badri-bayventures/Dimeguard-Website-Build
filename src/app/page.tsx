import { siteConfig } from "@/site.config";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-24 text-center">
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          {siteConfig.business.legalName} — {siteConfig.nap.addressLocality},{" "}
          {siteConfig.nap.addressRegion}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          {siteConfig.business.tagline}
        </h1>
        <p className="mt-6 text-base text-zinc-600">
          {siteConfig.advisor.fullName} — {siteConfig.advisor.title}. Licensed
          in{" "}
          {siteConfig.licensure.licensedStates
            .map((s) => s.code)
            .join(", ")}
          .
        </p>
        <p className="mt-10 text-xs text-zinc-500">
          Scaffold is live. Design system and pages land in step 2.
        </p>
      </div>
    </main>
  );
}
