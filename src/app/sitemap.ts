import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/site.config";
import { listPostSummaries } from "@/lib/blog";

/**
 * Sitemap is generated from siteConfig.routes — adding a route to the config
 * automatically includes it here, in llms.txt, and in default metadata.
 *
 * Blog post slugs will be merged in during step 6 (Notion adapter). For now
 * the stub list is empty so the file still validates and lists every static
 * route Saral can show on Friday.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = siteConfig.routes
    .filter((r) => r.canonical !== false)
    .map((r) => ({
      url: absoluteUrl(r.path),
      lastModified: new Date(r.lastModified),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    }));

  // Blog slugs are sourced from the unified blog loader — Notion when the
  // env vars are present, the static MDX fallback otherwise. Either way the
  // sitemap stays in sync without a redeploy.
  const posts = await listPostSummaries();
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.publishedDate),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries];
}
