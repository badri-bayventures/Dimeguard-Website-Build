import { listPostSummaries } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/site.config";

export const revalidate = 300;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export async function GET() {
  const posts = await listPostSummaries();
  const feedUrl = absoluteUrl("/blog/rss.xml");
  const blogUrl = absoluteUrl("/blog");
  const title = `${siteConfig.business.legalName} — Notes on planning`;
  const description =
    "Plain-language notes on insurance, retirement, and tax topics that come up in client conversations.";

  const items = posts
    .map((post) => {
      const link = absoluteUrl(`/blog/${post.slug}`);
      const tagList = post.tags?.length
        ? post.tags
        : post.category
          ? [post.category]
          : [];
      const categories = tagList.map(
        (tag) => `      <category>${escapeXml(tag)}</category>`,
      );
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${toRfc822(post.publishedDate)}</pubDate>`,
        ...categories,
        `      <description>${escapeXml(post.summary)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const lastBuild =
    posts.length > 0 ? toRfc822(posts[0].publishedDate) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(blogUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
