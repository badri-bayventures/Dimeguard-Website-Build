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
  /** MDX-only taxonomy. The live Notion database uses `tags` instead. */
  category?: BlogCategory;
  publishedDate: string;
  /** Byline. Falls back to "Saral Toms" for Notion posts with no Author. */
  author?: string;
  /** Topic tags (Notion `Tags` multi_select). */
  tags?: string[];
  /** Hero/cover image URL (signed Notion file URL, kept fresh by ISR). */
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPost = BlogPostSummary & {
  /** Markdown body, ready to render. */
  body: string;
};

const DEFAULT_DATABASE_ID = "371f76ded63280d79a31c53040533710";
const DEFAULT_AUTHOR = "Saral Toms";

function databaseId(): string {
  return process.env.NOTION_DATABASE_ID || DEFAULT_DATABASE_ID;
}

export function notionEnabled(): boolean {
  return Boolean(process.env.NOTION_TOKEN && databaseId());
}

let cachedClient: Client | null = null;
function getClient(): Client {
  if (!cachedClient) {
    cachedClient = new Client({ auth: process.env.NOTION_TOKEN });
  }
  return cachedClient;
}

type RichTextLike = { plain_text?: string };
function plain(rich: RichTextLike[] | undefined): string {
  if (!rich) return "";
  return rich.map((t) => t.plain_text ?? "").join("").trim();
}

type AnyProps = Record<string, unknown>;
type PropMap = Record<string, { type?: string } & AnyProps>;

type FileEntry = { file?: { url?: string }; external?: { url?: string } };

function firstFileUrl(prop: ({ type?: string } & AnyProps) | undefined):
  | string
  | undefined {
  const files = prop?.files as FileEntry[] | undefined;
  const f = files?.[0];
  return f?.file?.url ?? f?.external?.url ?? undefined;
}

type PageCover = {
  external?: { url?: string };
  file?: { url?: string };
} | null;

function pageCoverUrl(page: { cover?: PageCover }): string | undefined {
  const cover = page.cover;
  if (!cover) return undefined;
  return cover.external?.url ?? cover.file?.url ?? undefined;
}

function readTitle(props: PropMap): string {
  for (const key of Object.keys(props)) {
    const p = props[key];
    if (p?.type === "title") {
      return plain(p.title as RichTextLike[] | undefined);
    }
  }
  return "";
}

function readTags(prop: ({ type?: string } & AnyProps) | undefined): string[] {
  const opts = prop?.multi_select as Array<{ name?: string }> | undefined;
  if (!opts) return [];
  return opts.map((o) => o.name ?? "").filter(Boolean);
}

type NotionPage = { id: string; properties: PropMap; cover?: PageCover };

function readSummary(page: NotionPage): BlogPostSummary | null {
  const props = page.properties;

  const slugProp = props["Slug"];
  const statusProp = props["Status"];
  const dateProp = props["Publish Date"];
  const excerptProp = props["Excerpt"];
  const authorProp = props["Author"];
  const tagsProp = props["Tags"];
  const coverProp = props["Cover"];

  const title = readTitle(props);
  const slug = plain(slugProp?.rich_text as RichTextLike[] | undefined);
  const status = (statusProp?.select as { name?: string } | undefined)?.name;
  const publishedDate = (dateProp?.date as { start?: string } | undefined)
    ?.start;
  const summary = plain(excerptProp?.rich_text as RichTextLike[] | undefined);
  const author =
    plain(authorProp?.rich_text as RichTextLike[] | undefined) ||
    DEFAULT_AUTHOR;
  const tags = readTags(tagsProp);
  const coverImage = firstFileUrl(coverProp) ?? pageCoverUrl(page);

  if (status !== "Published") return null;
  if (!title || !slug || !publishedDate) return null;

  return {
    slug,
    title,
    summary,
    publishedDate,
    author,
    tags: tags.length ? tags : undefined,
    coverImage,
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
  const id = databaseId();
  const db = (await client.databases.retrieve({
    database_id: id,
  })) as { data_sources?: Array<{ id: string }> };
  const first = db.data_sources?.[0]?.id;
  if (!first) {
    throw new Error(
      `Notion database ${id} has no data sources — check the ID and that the integration has access.`,
    );
  }
  cachedDataSourceId = first;
  return first;
}

export async function fetchPublishedSummaries(): Promise<BlogPostSummary[]> {
  if (!notionEnabled()) return [];
  const client = getClient();
  const dataSourceId = await resolveDataSourceId();

  const out: BlogPostSummary[] = [];
  let cursor: string | undefined = undefined;

  // Follow Notion's cursor-based pagination so every published post is listed,
  // not just the first page of results.
  do {
    const res = await client.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [{ property: "Publish Date", direction: "descending" }],
      page_size: 100,
      start_cursor: cursor,
    });

    for (const page of res.results) {
      if (!isFullPage(page)) continue;
      const summary = readSummary(page as unknown as NotionPage);
      if (summary) out.push(summary);
    }

    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

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
  const summary = readSummary(page as unknown as NotionPage);
  if (!summary) return null;

  const n2m = new NotionToMarkdown({ notionClient: client });
  const blocks = await n2m.pageToMarkdown(page.id);
  const mdBlock = n2m.toMarkdownString(blocks);
  const body = (mdBlock.parent ?? "").trim();

  return { ...summary, body };
}
