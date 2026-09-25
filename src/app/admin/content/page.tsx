import Link from "next/link";
import { ArrowUpRight, LayoutTemplate } from "lucide-react";
import { getOverrideMeta } from "@/lib/content/store";
import { contentGroups } from "@/lib/content/registry";

const CATEGORY_META = {
  general: {
    title: "General",
    hint: "Identity and contact details shared by every page.",
  },
  home: {
    title: "Homepage",
    hint: "Each block of the landing page, top to bottom.",
  },
  pages: {
    title: "Inner Pages",
    hint: "Areas shared across the inner pages.",
  },
} as const;

const CATEGORY_ORDER = ["general", "home", "pages"] as const;

function describeGroup(group: (typeof contentGroups)[number]) {
  const parts: string[] = [];
  const scalarCount = group.fields.length;
  if (scalarCount > 0)
    parts.push(`${scalarCount} field${scalarCount === 1 ? "" : "s"}`);
  for (const list of group.lists) {
    parts.push(list.label.toLowerCase());
  }
  if (parts.length === 0) parts.push("content");
  return parts.join(" · ");
}

export default async function ContentOverview() {
  const meta = await getOverrideMeta();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header>
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <LayoutTemplate className="size-4" aria-hidden="true" />
          Content
        </p>
        <h1 className="font-heading mt-3 text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
          Editable{" "}
          <em className="font-accent font-normal text-primary italic">
            sections.
          </em>
        </h1>
        <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
          {contentGroups.length} sections of the site are open for editing.
          Sections without a custom copy display their original text.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {CATEGORY_ORDER.map((category) => {
          const groups = contentGroups.filter((g) => g.category === category);
          if (groups.length === 0) return null;
          const catMeta = CATEGORY_META[category];
          return (
            <section key={category} aria-labelledby={`cat-${category}`}>
              <div className="flex items-baseline justify-between gap-4">
                <h2
                  id={`cat-${category}`}
                  className="font-heading text-lg font-bold tracking-tight text-foreground"
                >
                  {catMeta.title}
                </h2>
                <p className="hidden text-sm text-muted sm:block">{catMeta.hint}</p>
              </div>

              <ul className="mt-4 grid gap-3">
                {groups.map((group) => {
                  const edited = group.key in meta;
                  const Icon = group.icon;
                  return (
                    <li key={group.key}>
                      <Link
                        href={`/admin/content/${group.key}`}
                        className="group flex items-center gap-5 rounded-3xl border border-border bg-white px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_20px_44px_-28px_rgb(24_63_58/0.45)]"
                      >
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2.5">
                            <span className="font-heading text-[1.05rem] font-bold tracking-tight text-foreground">
                              {group.title}
                            </span>
                            {edited && (
                              <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-[0.625rem] font-bold tracking-wide text-primary-dark uppercase">
                                customized
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted">
                            {group.description}
                          </span>
                          <span className="mt-1.5 block text-xs font-medium text-muted/80">
                            {describeGroup(group)}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="size-5 shrink-0 text-muted/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
