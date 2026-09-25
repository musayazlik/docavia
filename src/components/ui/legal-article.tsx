import type { ReactNode } from "react";

export type LegalSection = {
  /** Anchor id used by the "On this page" table of contents. */
  id: string;
  title: string;
  body: ReactNode;
};

/**
 * Shared body for legal pages — sticky table of contents beside
 * numbered, anchor-linked sections.
 */
export function LegalArticle({
  updated,
  intro,
  sections,
}: {
  /** e.g. "September 26, 2026" */
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="shell">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-muted uppercase">
          Last updated · {updated}
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
          <nav
            aria-label="On this page"
            className="hidden self-start lg:sticky lg:top-32 lg:block"
          >
            <p className="font-heading text-xs font-bold tracking-[0.18em] text-muted uppercase">
              On this page
            </p>
            <ol className="mt-5 space-y-1 border-l border-border">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-sm text-muted transition-colors duration-200 hover:border-primary hover:text-primary"
                  >
                    <span className="mr-2 font-semibold text-primary/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-3xl">
            <p className="text-[1.0625rem] leading-relaxed text-foreground/85">
              {intro}
            </p>

            <div className="mt-14 space-y-14">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-title`}
                  className="scroll-mt-32 border-t border-border pt-10 first:border-0 first:pt-0"
                >
                  <h2
                    id={`${section.id}-title`}
                    className="font-heading flex items-baseline gap-3 text-[1.35rem] font-bold tracking-tight text-foreground"
                  >
                    <span className="font-body text-sm font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed text-muted [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-4 [&_a]:hover:underline [&_li]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-5">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
