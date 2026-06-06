import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { breadcrumb } from "@/lib/schema";
import { Container } from "@/components/container";
import { Disclosure } from "@/components/disclosure";
import { listPostSummaries } from "@/lib/blog";
import {
  groupTopicsIntoSections,
  normalizeTopic,
  normalizeTopics,
} from "@/lib/blog/topics";
import { formatDate } from "@/lib/format-date";

const PATH = "/blog";
const PAGE_SIZE = 9;

export const revalidate = 300;

export const generateMetadata = () => buildMetadata({ path: PATH });

// Build a /blog link that preserves the active topic filter and only adds the
// page param when it's beyond the first page, keeping page-1 URLs canonical.
function buildPageHref(topic: string | null, page: number): string {
  const params = new URLSearchParams();
  if (topic) params.set("topic", topic);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${PATH}?${qs}` : PATH;
}

function topicsForPost(post: { tags?: string[]; category?: string }): string[] {
  const raw =
    post.tags && post.tags.length
      ? post.tags
      : [post.category].filter((t): t is string => Boolean(t));
  return normalizeTopics(raw);
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const posts = await listPostSummaries();

  const topicCounts = new Map<string, number>();
  for (const post of posts) {
    for (const topic of topicsForPost(post)) {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    }
  }
  const topicSections = groupTopicsIntoSections([...topicCounts.entries()]);
  const hasTopics = topicSections.length > 0;

  const { topic: rawTopic, page: rawPage } = await searchParams;
  const requestedTopic = Array.isArray(rawTopic) ? rawTopic[0] : rawTopic;
  // Normalize the incoming value so both canonical links (?topic=Life insurance)
  // and raw/bookmarked Notion-tag links (?topic=%23lifeinsurance) still resolve.
  const normalizedRequested = requestedTopic
    ? normalizeTopic(requestedTopic)
    : null;
  const activeTopic =
    normalizedRequested && topicCounts.has(normalizedRequested)
      ? normalizedRequested
      : null;

  const visiblePosts = activeTopic
    ? posts.filter((post) => topicsForPost(post).includes(activeTopic))
    : posts;

  // On the default (unfiltered) view, lift the latest post into a larger
  // featured card and drop it from the standard grid. Filtered views keep the
  // plain grid behaviour.
  const gridSource = !activeTopic ? visiblePosts.slice(1) : visiblePosts;

  // Paginate the grid so long lists stay browsable. Page 1 of the unfiltered
  // view also carries the featured card; later pages are a plain grid.
  const totalPages = Math.max(1, Math.ceil(gridSource.length / PAGE_SIZE));
  const requestedPage = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const parsedPage = Number.parseInt(requestedPage ?? "1", 10);
  const currentPage = Number.isFinite(parsedPage)
    ? Math.min(Math.max(parsedPage, 1), totalPages)
    : 1;

  const featuredPost =
    !activeTopic && currentPage === 1 ? visiblePosts[0] : undefined;
  const gridPosts = gridSource.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
            {hasTopics ? (
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <nav
                  aria-label="Browse topics"
                  className="rounded-2xl border border-[color:var(--color-border)] bg-white p-5 lg:p-6"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="inline-block h-5 w-1.5 rounded-full bg-[color:var(--color-accent)]"
                    />
                    <p className="font-[family-name:var(--font-display)] text-lg font-medium tracking-tight text-[color:var(--color-ink)]">
                      Browse topics
                    </p>
                  </div>

                  <Link
                    href={PATH}
                    aria-current={activeTopic ? undefined : "true"}
                    className={`mt-4 flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                      activeTopic
                        ? "border-[color:var(--color-border)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
                        : "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                    }`}
                  >
                    <span className="font-medium">All posts</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        activeTopic
                          ? "bg-[color:var(--color-surface-muted)] text-[color:var(--color-muted)]"
                          : "bg-white/15 text-white/80"
                      }`}
                    >
                      {posts.length}
                    </span>
                  </Link>

                  <div className="mt-6 space-y-6">
                    {topicSections.map((section) => (
                      <section key={section.title}>
                        <div className="flex items-center gap-2.5 border-b border-[color:var(--color-border)] pb-2">
                          <span
                            aria-hidden
                            className="inline-block h-3.5 w-1 rounded-full bg-[color:var(--color-secondary)]"
                          />
                          <h2 className="font-[family-name:var(--font-display)] text-base font-medium tracking-tight text-[color:var(--color-ink)]">
                            {section.title}
                          </h2>
                        </div>
                        <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                          {section.topics.map(({ topic, count }) => {
                            const isActive = activeTopic === topic;
                            return (
                              <li key={topic}>
                                <Link
                                  href={`${PATH}?topic=${encodeURIComponent(topic)}`}
                                  aria-current={isActive ? "true" : undefined}
                                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors lg:flex lg:w-full lg:items-center lg:justify-between lg:rounded-lg lg:border-0 lg:px-2.5 lg:py-1.5 ${
                                    isActive
                                      ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white lg:bg-[color:var(--color-ink)] lg:text-white"
                                      : "border-[color:var(--color-border)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] lg:bg-transparent lg:hover:bg-[color:var(--color-surface-muted)]"
                                  }`}
                                >
                                  <span>{topic}</span>
                                  <span
                                    className={`text-xs tabular-nums ${
                                      isActive
                                        ? "text-white/70"
                                        : "text-[color:var(--color-muted)]"
                                    }`}
                                  >
                                    {count}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    ))}
                  </div>
                </nav>
              </aside>
            ) : null}
            <div>
              {activeTopic ? (
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--color-border)] pb-5">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="inline-block h-7 w-1.5 rounded-full bg-[color:var(--color-accent)]"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
                        Topic
                      </p>
                      <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-3xl">
                        {activeTopic}
                        <span className="ml-2 text-base font-normal text-[color:var(--color-muted)]">
                          {visiblePosts.length}{" "}
                          {visiblePosts.length === 1 ? "post" : "posts"}
                        </span>
                      </h2>
                    </div>
                  </div>
                  <Link
                    href={PATH}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-ink)]"
                  >
                    <span aria-hidden>←</span>
                    All posts
                  </Link>
                </div>
              ) : null}
              {!activeTopic && featuredPost ? (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group mb-6 flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white transition-shadow hover:shadow-md md:flex-row"
                >
                  {featuredPost.coverImage ? (
                    <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-auto md:w-1/2">
                      <Image
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6 md:p-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[color:var(--color-ink)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                        Latest
                      </span>
                      {normalizeTopics(featuredPost.tags).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]"
                        >
                          {tag}
                        </span>
                      ))}
                      <time
                        dateTime={featuredPost.publishedDate}
                        className="text-xs text-[color:var(--color-muted)]"
                      >
                        {formatDate(featuredPost.publishedDate)}
                      </time>
                    </div>
                    <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-4xl">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-3 text-[color:var(--color-muted)]">
                      {featuredPost.summary}
                    </p>
                    {featuredPost.author ? (
                      <p className="mt-4 text-xs text-[color:var(--color-muted)]">
                        By {featuredPost.author}
                      </p>
                    ) : null}
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-ink)] group-hover:underline">
                      Read post →
                    </span>
                  </div>
                </Link>
              ) : null}
              <ul className="grid gap-6 sm:grid-cols-2">
                {gridPosts.map((post) => (
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
                        {normalizeTopics(post.tags).map((tag) => (
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
              {totalPages > 1 ? (
                <nav
                  aria-label="Blog pages"
                  className="mt-12 flex flex-wrap items-center justify-center gap-2"
                >
                  {currentPage > 1 ? (
                    <Link
                      href={buildPageHref(activeTopic, currentPage - 1)}
                      rel="prev"
                      className="inline-flex items-center rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[color:var(--color-ink)] transition-colors hover:text-[color:var(--color-ink-soft)]"
                    >
                      ← Previous
                    </Link>
                  ) : null}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => {
                      const isCurrent = pageNum === currentPage;
                      return (
                        <Link
                          key={pageNum}
                          href={buildPageHref(activeTopic, pageNum)}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
                            isCurrent
                              ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                              : "border-[color:var(--color-border)] bg-white text-[color:var(--color-ink)] hover:text-[color:var(--color-ink-soft)]"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    },
                  )}
                  {currentPage < totalPages ? (
                    <Link
                      href={buildPageHref(activeTopic, currentPage + 1)}
                      rel="next"
                      className="inline-flex items-center rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[color:var(--color-ink)] transition-colors hover:text-[color:var(--color-ink-soft)]"
                    >
                      Next →
                    </Link>
                  ) : null}
                </nav>
              ) : null}
            </div>
          </div>
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
