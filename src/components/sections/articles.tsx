import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { getContent } from "@/lib/content/store";

export async function Articles() {
  const [content] = await Promise.all([getContent()]);
  const articlesSection = content.articles;

  return (
    <section id="blog" className="py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow={articlesSection.eyebrow}
            title={
              <>
                {articlesSection.title}{" "}
                <em className="font-accent font-normal text-primary italic">
                  {articlesSection.titleAccent}
                </em>
              </>
            }
          />
          <Reveal delay={0.1} className="hidden sm:block">
            <Button href="/blog" variant="outline" withArrow>
              {articlesSection.viewAllLabel}
            </Button>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-3">
          {articles.map((article) => (
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
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-pine backdrop-blur-sm">
                      {article.category}
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                    {article.date}
                  </p>
                  <h3 className="font-heading mt-2.5 text-xl leading-snug font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
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
  );
}
