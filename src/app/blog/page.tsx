import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { Container } from "@/components/container";
import { Disclosure } from "@/components/disclosure";
import { listPostSummaries } from "@/lib/blog";
import { formatDate } from "@/lib/format-date";

const PATH = "/blog";

export const revalidate = 300;

export const generateMetadata = () => buildMetadata({ path: PATH });

export default async function BlogIndexPage() {
  const posts = await listPostSummaries();

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Blog", path: PATH },
        ])}
        id="ld-breadcrumb"
      />
      <section className="bg-[color:var(--color-surface-muted)] pt-20 pb-12 md:pt-28 md:pb-16">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
            Blog
          </p>
          <h1
            className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-6xl"
            style={{ lineHeight: 1.05 }}
          >
            Notes on planning.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-ink-soft)] md:text-xl">
            Plain-language notes on insurance, retirement, and tax topics that
            come up in client conversations.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          {posts.length === 0 ? (
            <p className="text-[color:var(--color-muted)]">
              No posts yet — check back soon.
            </p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white transition-shadow hover:shadow-md"
                  >
                    {post.coverImage ? (
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      {(post.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]"
                        >
                          {tag}
                        </span>
                      ))}
                      <time
                        dateTime={post.publishedDate}
                        className="text-xs text-[color:var(--color-muted)]"
                      >
                        {formatDate(post.publishedDate)}
                      </time>
                    </div>
                    <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-3xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-[color:var(--color-muted)]">
                      {post.summary}
                    </p>
                    {post.author ? (
                      <p className="mt-4 text-xs text-[color:var(--color-muted)]">
                        By {post.author}
                      </p>
                    ) : null}
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-ink)] group-hover:underline">
                      Read post →
                    </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
          <Disclosure />
        </div>
      </div>
    </>
  );
}
