"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  FileText,
  FolderOpen,
  LayoutDashboard,
  ListTree,
  LogOut,
  Menu,
  Quote,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";
import { contentGroups } from "@/lib/content/registry";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  home: "Homepage",
  pages: "Inner Pages",
  blog: "Blog",
  admin: "Administration",
};

const CATEGORY_ORDER = ["general", "home", "pages", "blog", "admin"] as const;

type NavEntry = {
  href: string;
  label: string;
  icon: typeof Users;
  category: (typeof CATEGORY_ORDER)[number];
  exact?: boolean;
};

const ENTITY_NAV: NavEntry[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, category: "general", exact: true },
  { href: "/admin/users", label: "Users", icon: Users, category: "admin" },
  { href: "/admin/doctors", label: "Doctors", icon: Stethoscope, category: "admin" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote, category: "admin" },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText, category: "blog" },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen, category: "blog" },
];

/** Title shown in the fixed top bar for entity routes. */
const ROUTE_TITLES: Array<[RegExp, string]> = [
  [/^\/admin\/users$/, "Users"],
  [/^\/admin\/doctors$/, "Doctors"],
  [/^\/admin\/testimonials$/, "Testimonials"],
  [/^\/admin\/posts$/, "Blog Posts"],
  [/^\/admin\/posts\/new$/, "New Post"],
  [/^\/admin\/categories$/, "Categories"],
  [/^\/admin\/content\/site$/, "Site Settings"],
  [/^\/admin\/content$/, "Content Sections"],
];

function deriveTitle(pathname: string): string {
  for (const [pattern, title] of ROUTE_TITLES) {
    if (pattern.test(pathname)) return title;
  }
  const groupMatch = pathname.match(/^\/admin\/content\/(.+)$/);
  if (groupMatch) {
    return contentGroups.find((g) => g.key === groupMatch[1])?.title ?? "Content";
  }
  return "Dashboard";
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Admin sections" className="flex flex-col gap-7">
      {CATEGORY_ORDER.map((category) => {
        const entities = ENTITY_NAV.filter((entry) => entry.category === category);
        const groups =
          category === "general"
            ? contentGroups.filter((g) => g.category === "general")
            : category === "home" || category === "pages"
              ? contentGroups.filter((g) => g.category === category)
              : [];
        if (entities.length === 0 && groups.length === 0) return null;

        return (
          <div key={category}>
            <p className="px-4 text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
              {CATEGORY_LABELS[category]}
            </p>
            <ul className="mt-3 space-y-1">
              {entities.map((entry) => {
                const active = entry.exact
                  ? pathname === entry.href
                  : pathname.startsWith(entry.href);
                const Icon = entry.icon;
                return (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-[0.9375rem] font-medium transition-all duration-200",
                        active
                          ? "bg-primary-light text-primary-dark"
                          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-[1.1rem] shrink-0 transition-colors duration-200",
                          active
                            ? "text-primary"
                            : "text-muted group-hover:text-primary"
                        )}
                        aria-hidden="true"
                      />
                      {entry.label}
                    </Link>
                  </li>
                );
              })}
              {groups.map((group) => {
                const href = `/admin/content/${group.key}`;
                const active = href === pathname;
                const Icon = group.icon;
                return (
                  <li key={group.key}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-[0.9375rem] font-medium transition-all duration-200",
                        active
                          ? "bg-primary-light text-primary-dark"
                          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-[1.1rem] shrink-0 transition-colors duration-200",
                          active
                            ? "text-primary"
                            : "text-muted group-hover:text-primary"
                        )}
                        aria-hidden="true"
                      />
                      {group.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  // Same height as the top header so the two border lines align.
  return (
    <div className="flex h-[4.5rem] shrink-0 items-center border-b border-border px-7">
      <Link href="/admin" aria-label="Docavia admin dashboard">
        <Logo />
      </Link>
    </div>
  );
}

/**
 * Admin shell: fixed light sidebar, fixed top header, fixed footer —
 * everything between scrolls in <main>.
 */
export function AdminShell({
  user,
  children,
}: {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingSignOut, setPendingSignOut] = useState(false);
  const title = deriveTitle(pathname);
  const isDashboard = pathname === "/admin";
  const readOnly = user.role === "demo";

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const signOut = async () => {
    if (pendingSignOut) return;
    setPendingSignOut(true);
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials =
    (user.name || user.email || "?")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "D";

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar — fixed, owns its own scroll */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17.5rem] flex-col border-r border-border bg-white lg:flex">
        <div className="relative">
          <BrandMark />
        </div>
        <div className="relative flex-1 overflow-y-auto px-3 pb-6">
          <NavList pathname={pathname} />
        </div>
        <div className="relative border-t border-border px-7 py-5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
          >
            View Site
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-pine-deep/40 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[19rem] max-w-[85vw] flex-col bg-white shadow-soft">
            <div className="flex items-center justify-between pr-6">
              <BrandMark />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close admin menu"
                className="flex size-10 items-center justify-center rounded-lg text-muted hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-6">
              <NavList
                pathname={pathname}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </aside>
        </div>
      )}

      {/* Right column: fixed header, scrolling main, fixed footer */}
      <div className="flex h-dvh flex-col lg:pl-[17.5rem]">
        <header className="flex h-[4.5rem] shrink-0 items-center justify-between gap-4 border-b border-border bg-white/92 px-5 backdrop-blur-md sm:px-8 lg:px-12">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open admin menu"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-foreground lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
                Docavia Admin
              </p>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading truncate text-[1.05rem] leading-tight font-bold tracking-tight text-foreground">
                  {title}
                </h1>
                {readOnly && (
                  <span
                    title="Demo accounts can view every page but cannot save changes."
                    className="hidden rounded-full bg-[#f2b01e]/15 px-2.5 py-0.5 text-[0.625rem] font-bold tracking-wide text-[#8a6200] uppercase sm:inline"
                  >
                    Demo · Read-only
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="hidden size-11 items-center justify-center rounded-xl border border-border text-muted transition-colors duration-200 hover:border-primary/40 hover:text-primary sm:flex"
              aria-label="Open the live site"
              title="Open the live site"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-3 rounded-xl border border-border py-2 pr-2 pl-3">
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-[0.8125rem] leading-tight font-semibold text-foreground">
                  {user.name || "Admin"}
                </p>
                <p className="truncate text-xs leading-tight text-muted">
                  {user.email}
                </p>
              </div>
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white"
                >
                  {initials}
                </span>
              )}
              <button
                type="button"
                onClick={signOut}
                disabled={pendingSignOut}
                aria-label="Sign out"
                title="Sign out"
                className="flex size-8 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground disabled:opacity-40"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main
          id="main"
          className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-12 lg:py-10"
        >
          {children}
        </main>

        <footer className="flex h-12 shrink-0 items-center justify-between border-t border-border px-5 text-xs text-muted sm:px-8 lg:px-12">
          <p>Docavia Admin · Staff area</p>
          {!isDashboard && (
            <Link
              href="/admin"
              className="transition-colors duration-200 hover:text-foreground"
            >
              <ListTree className="mr-1.5 inline size-3.5" aria-hidden="true" />
              Dashboard
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}
