import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, ChevronRight, Clock } from "lucide-react";
import { articles, type ArticleBlock } from "@/lib/data";
import { site } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AppointmentCta } from "@/components/sections/appointment-cta";
import { Comments } from "@/components/sections/comments";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

type BlogPostParams = Promise<{ slug: string }>;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: BlogPostParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = articles.find((article) => article.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

function JsonLd({ post }: { post: (typeof articles)[number] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: `${site.url}${post.image}`,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.role,
        },
        publisher: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
        },
        mainEntityOfPage: `${site.url}/blog/${post.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${site.url}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="font-heading mt-12 text-[1.55rem] leading-snug font-bold tracking-tight text-foreground first:mt-0"
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p
                key={index}
                className="mt-6 text-[1.0625rem] leading-[1.85] text-foreground/75"
              >
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={index} className="mt-7 space-y-3.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span className="text-[1.0625rem] leading-[1.75] text-foreground/75">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="mt-10 rounded-[1.5rem] bg-secondary/70 px-8 py-9"
              >
                <p className="font-accent text-[1.45rem] leading-snug text-primary italic md:text-[1.65rem]">
                  “{block.text}”
                </p>
                {block.cite && (
                  <cite className="mt-4 block text-sm font-semibold text-muted not-italic">
                    — {block.cite}
                  </cite>
                )}
              </blockquote>
            );
        }
      })}
    </>
  );
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = articles.find((article) => article.slug === slug);
  if (!post) notFound();

  const related = articles.filter((article) => article.slug !== post.slug);

  return (
    <>
      <JsonLd post={post} />
      <Navbar />
      <main id="main">
        {/* Article header */}
        <section className="relative overflow-hidden pt-36 pb-12 md:pt-44 md:pb-16">
          <div
            aria-hidden="true"
            className="absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-secondary blur-3xl"
          />
          <div className="shell relative">
            <Reveal>
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-sm font-medium text-muted">
                  <li>
                    <Link
                      href="/"
                      className="transition-colors duration-200 hover:text-primary"
                    >
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="size-3.5 text-border" />
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="transition-colors duration-200 hover:text-primary"
                    >
                      Blog
                    </Link>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="size-3.5 text-border" />
                  </li>
                  <li
                    aria-current="page"
                    className="max-w-[16rem] truncate font-semibold text-primary"
                  >
                    {post.title}
                  </li>
                </ol>
              </nav>

              <div className="mt-8 max-w-3xl">
                <p className="inline-flex items-center rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-pine">
                  {post.category}
                </p>
                <h1 className="font-heading mt-5 text-[2.3rem] leading-[1.1] font-bold tracking-[-0.025em] text-balance text-foreground sm:text-[2.8rem] lg:text-[3.2rem]">
                  {post.title}
                </h1>
                <p className="mt-5 text-[1.125rem] leading-relaxed text-muted md:text-[1.1875rem]">
                  {post.description}
                </p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-border pt-7">
                <div className="flex items-center gap-3.5">
                  <Image
                    src={post.author.avatar}
                    alt={`Portrait of ${post.author.name}`}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-heading text-[0.95rem] font-bold text-foreground">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-muted">{post.author.role}</p>
                  </div>
                </div>
                <p className="flex items-center gap-2 text-sm text-muted">
                  <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                  <time dateTime={post.publishedAt}>{post.date}</time>
                </p>
                <p className="flex items-center gap-2 text-sm text-muted">
                  <Clock className="size-4 text-primary" aria-hidden="true" />
                  {post.readingTime} min read
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Hero image */}
        <section className="pb-4 md:pb-6">
          <div className="shell">
            <Reveal>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] sm:aspect-[16/8]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Article body */}
        <section className="py-14 md:py-20">
          <div className="shell">
            <div className="mx-auto max-w-[44rem]">
              <ArticleBody blocks={post.content} />

              {/* Author card */}
              <aside className="mt-16 flex flex-col gap-5 rounded-[1.75rem] border border-border bg-secondary/50 p-8 sm:flex-row sm:items-center md:p-10">
                <Image
                  src={post.author.avatar}
                  alt={`Portrait of ${post.author.name}`}
                  width={72}
                  height={72}
                  className="size-18 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                    Written by
                  </p>
                  <p className="font-heading mt-1.5 text-lg font-bold text-foreground">
                    {post.author.name}
                    <span className="font-normal text-primary">
                      {" "}
                      · {post.author.role}
                    </span>
                  </p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                    {post.author.bio} Every Docavia article is reviewed for
                    medical accuracy before publication.
                  </p>
                </div>
              </aside>

              {/* Comments */}
              <Comments slug={post.slug} />
            </div>
          </div>
        </section>

        {/* Related articles */}
        <section className="bg-secondary/60 py-24 md:py-32">
          <div className="shell">
            <SectionHeading
              eyebrow="Keep Reading"
              title={
                <>
                  More from the{" "}
                  <em className="font-accent font-normal text-primary italic">
                    Health Journal.
                  </em>
                </>
              }
            />

            <Stagger className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2">
              {related.map((article) => (
                <StaggerItem key={article.slug}>
                  <article className="group">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="block"
                      aria-label={article.title}
                    >
                      <div className="relative aspect-[3/2] overflow-hidden rounded-[1.5rem]">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        />
                        <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-pine backdrop-blur-sm">
                          {article.category}
                        </span>
                      </div>
                      <p className="mt-5 text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                        {article.date} · {article.readingTime} min read
                      </p>
                      <h3 className="font-heading mt-2.5 text-xl leading-snug font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                        {article.title}
                      </h3>
                      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                        {article.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Read Article
                        <ArrowRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <AppointmentCta />
      </main>
      <Footer />
    </>
  );
}
