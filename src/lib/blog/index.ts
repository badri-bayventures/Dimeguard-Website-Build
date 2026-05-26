import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import {
  fetchPublishedSummaries,
  fetchPostBySlug,
  notionEnabled,
  type BlogPost,
  type BlogPostSummary,
  type BlogCategory,
} from "@/lib/notion";

/**
 * Unified blog source. If Notion env vars are set, the live source is Notion;
 * otherwise we transparently fall back to static MDX files in /content/blog.
 * Callers (pages, sitemap) should only ever import from this module so the
 * routing layer stays source-agnostic.
 */

export type { BlogPost, BlogPostSummary, BlogCategory };

export type BlogPostFaq = { question: string; answer: string };
export type BlogPostFull = BlogPost & { faqs?: BlogPostFaq[] };

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const VALID_CATEGORIES: BlogCategory[] = [
  "Insurance",
  "Retirement",
  "Tax",
  "Estate",
  "General",
];

type FrontmatterShape = {
  title?: unknown;
  slug?: unknown;
  category?: unknown;
  publishedDate?: unknown;
  summary?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
  faqs?: unknown;
};

/**
 * Tiny YAML-frontmatter parser scoped to the keys we use. We don't pull in a
 * heavy parser because the dependency budget for this task is fixed (only the
 * 3 Notion/MDX libs are allowed) and our frontmatter shape is constrained.
 */
function parseFrontmatter(raw: string): {
  data: FrontmatterShape;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const [, fmText, body] = match;

  const data: FrontmatterShape = {};
  const lines = fmText.split(/\r?\n/);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i += 1;
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) {
      i += 1;
      continue;
    }
    const [, key, rawVal] = kv;
    const val = rawVal.trim();

    if (val === "" && lines[i + 1]?.match(/^\s+-\s/)) {
      const items: Array<Record<string, string>> = [];
      i += 1;
      while (i < lines.length && lines[i].match(/^\s+-\s/)) {
        const item: Record<string, string> = {};
        const first = lines[i].match(/^\s+-\s+([A-Za-z0-9_]+):\s*(.*)$/);
        if (first) {
          item[first[1]] = stripQuotes(first[2]);
        }
        i += 1;
        while (i < lines.length && lines[i].match(/^\s{4,}[A-Za-z0-9_]+:/)) {
          const sub = lines[i].match(/^\s+([A-Za-z0-9_]+):\s*(.*)$/);
          if (sub) item[sub[1]] = stripQuotes(sub[2]);
          i += 1;
        }
        items.push(item);
      }
      (data as Record<string, unknown>)[key] = items;
      continue;
    }

    (data as Record<string, unknown>)[key] = stripQuotes(val);
    i += 1;
  }

  return { data, body: body ?? "" };
}

function stripQuotes(v: string): string {
  const t = v.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

function coerceCategory(v: unknown): BlogCategory {
  if (typeof v === "string" && (VALID_CATEGORIES as string[]).includes(v)) {
    return v as BlogCategory;
  }
  return "General";
}

function coerceFaqs(v: unknown): BlogPostFaq[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: BlogPostFaq[] = [];
  for (const item of v) {
    if (
      item &&
      typeof item === "object" &&
      typeof (item as Record<string, unknown>).question === "string" &&
      typeof (item as Record<string, unknown>).answer === "string"
    ) {
      out.push({
        question: (item as Record<string, string>).question,
        answer: (item as Record<string, string>).answer,
      });
    }
  }
  return out.length ? out : undefined;
}

async function readMdxFiles(): Promise<
  Array<{ summary: BlogPostSummary; body: string; faqs?: BlogPostFaq[] }>
> {
  let files: string[] = [];
  try {
    files = await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const out: Array<{
    summary: BlogPostSummary;
    body: string;
    faqs?: BlogPostFaq[];
  }> = [];
  for (const file of files) {
    if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(raw);
    const title = typeof data.title === "string" ? data.title : "";
    const slug =
      typeof data.slug === "string" ? data.slug : file.replace(/\.mdx?$/, "");
    const publishedDate =
      typeof data.publishedDate === "string" ? data.publishedDate : "";
    const summary = typeof data.summary === "string" ? data.summary : "";
    if (!title || !publishedDate || !summary) continue;
    out.push({
      summary: {
        slug,
        title,
        summary,
        category: coerceCategory(data.category),
        publishedDate,
        seoTitle:
          typeof data.seoTitle === "string" && data.seoTitle
            ? data.seoTitle
            : undefined,
        seoDescription:
          typeof data.seoDescription === "string" && data.seoDescription
            ? data.seoDescription
            : undefined,
      },
      body: body.trim(),
      faqs: coerceFaqs(data.faqs),
    });
  }
  return out;
}

export async function listPostSummaries(): Promise<BlogPostSummary[]> {
  if (notionEnabled()) {
    return fetchPublishedSummaries();
  }
  const files = await readMdxFiles();
  return files
    .map((f) => f.summary)
    .sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPostFull | null> {
  if (notionEnabled()) {
    const post = await fetchPostBySlug(slug);
    return post;
  }
  const files = await readMdxFiles();
  const match = files.find((f) => f.summary.slug === slug);
  if (!match) return null;
  return { ...match.summary, body: match.body, faqs: match.faqs };
}
