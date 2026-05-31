import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/schema/json-ld";
import { blogPosting, breadcrumb, faqPage } from "@/lib/schema";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/container";
import { Disclosure } from "@/components/disclosure";
import { BlogEndCta } from "@/components/blog-cta";
import { NotionBody } from "@/components/markdown";
import { getPostBySlug, listPostSummaries } from "@/lib/blog";
import { notionEnabled } from "@/lib/notion";
import { formatDate } from "@/lib/format-date";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await listPostSummaries();
  return posts.map((p) => ({ slug: p.slug }));
}

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return buildMetadata({
      path: `/blog/${slug}`,
      title: "Post not found · Dimeguard",
      description: "This blog post could not be found.",
      index: false,
    });
  }
  return buildMetadata({
    path: `/blog/${post.slug}`,
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.summary,
    ogImage: post.coverImage,
    ogType: "article",
    publishedTime: post.publishedDate,
    authors: [post.author ?? siteConfig.advisor.fullName],
  });
}

export default async function BlogPostPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;
  const jsonLdBlocks: Record<string, unknown>[] = [
    breadcrumb([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path },
    ]),
    blogPosting(siteConfig, {
      title: post.title,
      description: post.seoDescription ?? post.summary,
      path,
      datePublished: post.publishedDate,
      authorName: post.author ?? siteConfig.advisor.fullName,
      imageUrl: post.coverImage,
    }),
  ];
  if (post.faqs && post.faqs.length > 0) {
    jsonLdBlocks.push(
      faqPage(
        post.faqs.map((f) => ({ question: f.question, answerText: f.answer })),
      ),
    );
  }

  return (
    <>
      <JsonLd data={jsonLdBlocks} id="ld-blog-post" />

      <section className="bg-[color:var(--color-surface-muted)] pt-16 pb-10 md:pt-24 md:pb-14">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]"
          >
            <Link href="/blog" className="hover:underline">
              ← Blog
            </Link>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {(post.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]"
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
          <h1
            className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-5xl"
            style={{ lineHeight: 1.1 }}
          >
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-[color:var(--color-muted)]">
            By {post.author ?? siteConfig.advisor.fullName}
          </p>
        </Container>
      </section>

      {post.coverImage ? (
        <section className="bg-[color:var(--color-surface-muted)] pb-10 md:pb-14">
          <Container>
            <div className="relative mx-auto aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-12 md:py-16">
        <Container>
          <article className="post-body mx-auto max-w-2xl">
            {notionEnabled() ? (
              <NotionBody source={post.body} />
            ) : (
              <MDXRemote source={post.body} />
            )}
            <BlogEndCta />
          </article>
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
