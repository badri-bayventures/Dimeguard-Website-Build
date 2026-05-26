import "server-only";
import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

/**
 * Thin wrapper around @notionhq/client + notion-to-md. All Notion-specific
 * shape lives here; the rest of the app talks to the `BlogPost` /
 * `BlogPostSummary` types returned by this module so the source can be
 * swapped for the static MDX fallback without callers caring.
 */

export type BlogCategory =
  | "Insurance"
  | "Retirement"
  | "Tax"
  | "Estate"
  | "General";

export type BlogPostSummary = {
  slug: string;
  title: string;
  summary: string;
  category: BlogCategory;
  publishedDate: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPost = BlogPostSummary & {
  /** Markdown body, ready to feed to next-mdx-remote. */
  body: string;
};

const VALID_CATEGORIES: BlogCategory[] = [
  "Insurance",
  "Retirement",
  "Tax",
  "Estate",
  "General",
];

export function notionEnabled(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_BLOG_DB_ID);
}

let cachedClient: Client | null = null;
function getClient(): Client {
  if (!cachedClient) {
    cachedClient = new Client({ auth: process.env.NOTION_API_KEY });
  }
  return cachedClient;
}

type RichTextLike = { plain_text?: string };
function plain(rich: RichTextLike[] | undefined): string {
  if (!rich) return "";
  return rich.map((t) => t.plain_text ?? "").join("").trim();
}

function coerceCategory(value: string | undefined): BlogCategory {
  if (value && (VALID_CATEGORIES as string[]).includes(value)) {
    return value as BlogCategory;
  }
  return "General";
}

type AnyProps = Record<string, unknown>;

function readSummary(page: { id: string; properties: AnyProps }):
  | BlogPostSummary
  | null {
  const props = page.properties as Record<string, { type?: string } & AnyProps>;

  const titleProp = props["Title"];
  const slugProp = props["Slug"];
  const statusProp = props["Status"];
  const dateProp = props["Published Date"];
  const summaryProp = props["Summary"];
  const categoryProp = props["Category"];
  const seoTitleProp = props["SEO Title"];
  const seoDescProp = props["SEO Description"];

  const title = plain(titleProp?.title as RichTextLike[] | undefined);
  const slug = plain(slugProp?.rich_text as RichTextLike[] | undefined);
  const status = (statusProp?.select as { name?: string } | undefined)?.name;
  const publishedDate = (dateProp?.date as { start?: string } | undefined)
    ?.start;
  const summary = plain(summaryProp?.rich_text as RichTextLike[] | undefined);
  const categoryRaw = (categoryProp?.select as { name?: string } | undefined)
    ?.name;
  const seoTitle = plain(seoTitleProp?.rich_text as RichTextLike[] | undefined);
  const seoDescription = plain(
    seoDescProp?.rich_text as RichTextLike[] | undefined,
  );

  if (status !== "Published") return null;
  if (!title || !slug || !publishedDate || !summary) return null;

  return {
    slug,
    title,
    summary,
    category: coerceCategory(categoryRaw),
    publishedDate,
    seoTitle: seoTitle || undefined,
    seoDescription: seoDescription || undefined,
  };
}

/**
 * Notion API v5 (2026-03-11+) splits databases from data sources: queries now
 * run against a `data_source_id`, not the database id itself. We resolve the
 * first data source for the configured database on first use and cache it for
 * the lifetime of the process.
 */
let cachedDataSourceId: string | null = null;
async function resolveDataSourceId(): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId;
  const client = getClient();
  const databaseId = process.env.NOTION_BLOG_DB_ID!;
  const db = (await client.databases.retrieve({
    database_id: databaseId,
  })) as { data_sources?: Array<{ id: string }> };
  const first = db.data_sources?.[0]?.id;
  if (!first) {
    throw new Error(
      `Notion database ${databaseId} has no data sources — check the ID and that the integration has access.`,
    );
  }
  cachedDataSourceId = first;
  return first;
}

export async function fetchPublishedSummaries(): Promise<BlogPostSummary[]> {
  if (!notionEnabled()) return [];
  const client = getClient();
  const dataSourceId = await resolveDataSourceId();

  const res = await client.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "Status",
      select: { equals: "Published" },
    },
    sorts: [{ property: "Published Date", direction: "descending" }],
    page_size: 100,
  });

  const out: BlogPostSummary[] = [];
  for (const page of res.results) {
    if (!isFullPage(page)) continue;
    const summary = readSummary(page);
    if (summary) out.push(summary);
  }
  return out;
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!notionEnabled()) return null;
  const client = getClient();

  const dataSourceId = await resolveDataSourceId();
  const res = await client.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        { property: "Status", select: { equals: "Published" } },
        { property: "Slug", rich_text: { equals: slug } },
      ],
    },
    page_size: 1,
  });

  const page = res.results[0];
  if (!page || !isFullPage(page)) return null;
  const summary = readSummary(page);
  if (!summary) return null;

  const n2m = new NotionToMarkdown({ notionClient: client });
  const blocks = await n2m.pageToMarkdown(page.id);
  const mdBlock = n2m.toMarkdownString(blocks);
  const body = (mdBlock.parent ?? "").trim();

  return { ...summary, body };
}
