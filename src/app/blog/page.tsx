import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/components/sections/newsletter";
import { AppointmentCta } from "@/components/sections/appointment-cta";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { articles } from "@/lib/data";

const [featured, ...rest] = articles;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "The Docavia Health Journal — practical articles on heart health, prevention and wellbeing, written by our physicians.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Docavia",
    description:
      "The Docavia Health Journal — practical articles on heart health, prevention and wellbeing, written by our physicians.",
    url: "/blog",
    images: [{ url: featured.image }],
  },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          label="Blog"
          eyebrow="Health Journal"
          title={
            <>
              Insights for{" "}
              <em className="font-accent font-normal text-primary italic">
                Better Health.
              </em>
            </>
          }
          description="Practical, physician-reviewed articles on prevention, heart health and everyday wellbeing — no scare tactics, just clarity."
        />

        {/* Featured article */}
        <section className="py-16 md:py-24">
          <div className="shell">
            <Reveal>
              <article className="group grid overflow-hidden rounded-[2.5rem] border border-border bg-white shadow-card transition-shadow duration-500 hover:shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    sizes="(min-width: 1024px) 52vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-5 left-5 rounded-full border border-white/40 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-pine backdrop-blur-sm">
                    {featured.category}
                  </span>
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                    {featured.date} · {featured.readingTime} min read
                  </p>
                  <h2 className="font-heading mt-4 text-[1.7rem] leading-[1.15] font-bold tracking-tight text-balance text-foreground sm:text-[2.1rem]">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
                    {featured.description}
                  </p>
                  <div className="mt-8">
                    <Button
                      href={`/blog/${featured.slug}`}
                      variant="outline"
                      withArrow
                    >
                      Read Article
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Article grid */}
        <section id="blog" className="bg-secondary/60 py-24 md:py-32">
          <div className="shell">
            <Stagger className="grid gap-x-6 gap-y-12 md:grid-cols-2">
              {rest.map((article) => (
                <StaggerItem key={article.title}>
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

            <Reveal delay={0.1}>
              <p className="mt-14 text-center text-sm text-muted">
                New articles are published monthly — subscribe below and
                never miss one.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Newsletter */}
        <section aria-label="Newsletter" className="py-24 md:py-32">
          <div className="shell">
            <Reveal>
              <Newsletter />
            </Reveal>
          </div>
        </section>

        <AppointmentCta />
      </main>
      <Footer />
    </>
  );
}
