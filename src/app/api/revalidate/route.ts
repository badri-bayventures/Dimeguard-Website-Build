import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand revalidation for the Notion-backed blog.
 *
 * Both `/blog` and `/blog/[slug]` use ISR with a 5-minute window. When Saral
 * wants a post to go live immediately, hitting this endpoint busts the cache
 * for the listing page, the sitemap, and (optionally) a specific slug.
 *
 * Auth: shared secret in the `X-Revalidate-Secret` header (env
 * `REVALIDATE_SECRET`). If the env var is unset, every request is rejected.
 *
 * Request body (optional JSON): `{ "slug": "my-post-slug" }`.
 */
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "Revalidation secret is not configured" },
      { status: 401 },
    );
  }

  const provided = request.headers.get("x-revalidate-secret");
  if (!provided || provided !== expected) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let slug: string | undefined;
  try {
    const text = await request.text();
    if (text.trim().length > 0) {
      const parsed = JSON.parse(text) as unknown;
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "slug" in parsed &&
        typeof (parsed as { slug: unknown }).slug === "string"
      ) {
        const candidate = (parsed as { slug: string }).slug.trim();
        if (candidate.length > 0) {
          slug = candidate;
        }
      }
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const revalidated: string[] = [];
  revalidatePath("/blog");
  revalidated.push("/blog");
  revalidatePath("/sitemap.xml");
  revalidated.push("/sitemap.xml");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
    revalidated.push(`/blog/${slug}`);
  }

  return NextResponse.json({ ok: true, revalidated });
}
