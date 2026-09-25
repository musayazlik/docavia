import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  ExternalLink,
  FileText,
  FolderOpen,
  PencilLine,
  Quote,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { getContent, getOverrideMeta } from "@/lib/content/store";
import { contentGroups } from "@/lib/content/registry";
import { getPublishedPosts } from "@/lib/entities";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-server";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminDashboard() {
  const [session, , meta, doctors, publishedPosts] = await Promise.all([
    getSession(),
    getContent(),
    getOverrideMeta(),
    prisma.doctor.count().catch(() => 0),
    getPublishedPosts().then((posts) => posts?.length ?? 0).catch(() => 0),
  ]);

  const editedKeys = Object.keys(meta);
  const name = session?.user.name?.split(" ")[0] || "Admin";

  const stats = [
    {
      label: "Editable Sections",
      value: contentGroups.length,
      note: "copy across the whole site",
    },
    {
      label: "Sections Customized",
      value: editedKeys.length,
      note: editedKeys.length === 0 ? "all using defaults" : "published live",
    },
    {
      label: "Doctors",
      value: doctors,
      note: "managed as a table",
    },
    {
      label: "Blog Posts",
      value: publishedPosts,
      note: "published on /blog",
    },
  ];

  const manageLinks = [
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
    { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
    { href: "/admin/posts", label: "Blog Posts", icon: FileText },
    { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  ];

  const recent = editedKeys
    .map((key) => ({ key, ...meta[key] }))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Greeting */}
      <header>
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="size-4" aria-hidden="true" />
          Docavia Admin
        </p>
        <h1 className="font-heading mt-3 text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
          {greeting()},{" "}
          <em className="font-accent font-normal text-primary italic">{name}.</em>
        </h1>
        <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
          Every headline, service and opening hour on the public site is
          editable here — changes publish the moment you save.
        </p>
      </header>

      {/* Stats */}
      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-border bg-white px-6 py-6 shadow-[0_10px_32px_-24px_rgb(24_63_58/0.35)]"
          >
            <dd className="font-heading text-[2rem] leading-none font-bold tracking-tight text-foreground">
              {stat.value}
            </dd>
            <dt className="mt-3 text-sm font-semibold text-foreground">
              {stat.label}
            </dt>
            <p className="mt-0.5 text-xs text-muted">{stat.note}</p>
          </div>
        ))}
      </dl>

      {/* Managed entities */}
      <section aria-labelledby="manage" className="mt-10">
        <h2
          id="manage"
          className="font-heading text-lg font-bold tracking-tight text-foreground"
        >
          Manage
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {manageLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_36px_-24px_rgb(24_63_58/0.4)]"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <link.icon className="size-[1.1rem]" aria-hidden="true" />
                </span>
                <span className="text-[0.9375rem] font-bold text-foreground">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Quick edits */}
        <section
          aria-labelledby="quick-edits"
          className="rounded-[1.75rem] border border-border bg-white p-7 sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <h2
              id="quick-edits"
              className="font-heading text-lg font-bold tracking-tight text-foreground"
            >
              Jump into a section
            </h2>
            <Link
              href="/admin/content"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              All sections
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {contentGroups.slice(0, 6).map((group) => {
              const Icon = group.icon;
              const edited = group.key in meta;
              return (
                <li key={group.key}>
                  <Link
                    href={`/admin/content/${group.key}`}
                    className="group flex h-full items-start gap-4 rounded-2xl border border-border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_36px_-24px_rgb(24_63_58/0.4)]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon className="size-[1.1rem]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-[0.9375rem] font-bold text-foreground">
                        {group.title}
                        {edited && (
                          <span
                            className="rounded-full bg-primary-light px-2 py-0.5 text-[0.625rem] font-bold tracking-wide text-primary-dark uppercase"
                            title="This section has custom copy"
                          >
                            edited
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted">
                        {group.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Recent activity */}
        <section
          aria-labelledby="recent-edits"
          className="rounded-[1.75rem] border border-border bg-white p-7 sm:p-8"
        >
          <h2
            id="recent-edits"
            className="font-heading text-lg font-bold tracking-tight text-foreground"
          >
            Recently edited
          </h2>

          {recent.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-8 text-center">
              <CalendarClock
                className="mx-auto size-6 text-primary/60"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-semibold text-foreground">
                Nothing changed yet
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Edits appear here with their publish time. The site currently
                shows its original copy everywhere.
              </p>
            </div>
          ) : (
            <ul className="mt-6 space-y-1">
              {recent.map((item) => {
                const group = contentGroups.find((g) => g.key === item.key);
                const Icon = group?.icon ?? PencilLine;
                return (
                  <li key={item.key}>
                    <Link
                      href={`/admin/content/${item.key}`}
                      className="flex items-center gap-3.5 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-secondary/60"
                    >
                      <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {group?.title ?? item.key}
                        </span>
                        <span className="block text-xs text-muted">
                          {formatDate(item.updatedAt)}
                          {item.updatedBy ? ` · ${item.updatedBy}` : ""}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-muted/60"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            href="/"
            target="_blank"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Open the live site
          </Link>
        </section>
      </div>

    </div>
  );
}
