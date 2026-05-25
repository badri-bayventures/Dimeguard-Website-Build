import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/site.config";

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

  // Notion-sourced blog slugs go here once step 6 wires the adapter.
  const blogSlugs: { slug: string; lastModified: string }[] = [];
  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((s) => ({
    url: absoluteUrl(`/blog/${s.slug}`),
    lastModified: new Date(s.lastModified),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries];
}
