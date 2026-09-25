"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";
import { contentGroups } from "@/lib/content/registry";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, { label: string; hint: string }> = {
  general: { label: "General", hint: "Site-wide identity" },
  home: { label: "Homepage", hint: "Landing page sections" },
  pages: { label: "Inner Pages", hint: "Shared page areas" },
};

const CATEGORY_ORDER = ["general", "home", "pages"] as const;

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="flex flex-col gap-7">
      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_LABELS[category];
        const groups = contentGroups.filter((g) => g.category === category);
        if (groups.length === 0) return null;
        return (
          <div key={category}>
            <p className="px-4 text-[0.6875rem] font-bold tracking-[0.14em] text-white/35 uppercase">
              {meta.label}
            </p>
            <ul className="mt-3 space-y-1">
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
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-[1.1rem] shrink-0 transition-colors duration-200",
                          active
                            ? "text-primary-light"
                            : "text-white/40 group-hover:text-primary-light"
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

function UserCard({
  user,
}: {
  user: { name: string; email: string };
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const initials = (user.name || user.email || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const handleSignOut = async () => {
    if (pending) return;
    setPending(true);
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="border-t border-white/10 px-4 py-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
        >
          {initials || "D"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {user.name || "Admin"}
          </p>
          <p className="truncate text-xs text-white/50">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={pending}
          aria-label="Sign out"
          title="Sign out"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors duration-200 hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          <LogOut className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({
  user,
}: {
  user: { name: string; email: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isDashboard = pathname === "/admin";

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-white/90 px-5 py-3 backdrop-blur-md lg:hidden">
        <Link href="/admin" aria-label="Docavia admin dashboard">
          <Logo className="h-8" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="flex size-11 items-center justify-center rounded-xl border border-border text-foreground"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="h-[4.25rem] lg:hidden" aria-hidden="true" />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17.5rem] flex-col bg-pine-deep lg:flex">
        <div className="bg-dots-light pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(120%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative flex items-center px-7 pt-8 pb-7">
          <Link href="/admin" aria-label="Docavia admin dashboard">
            <Logo inverted />
          </Link>
        </div>
        <div className="relative flex-1 overflow-y-auto px-3">
          <Link
            href="/admin"
            className={cn(
              "mb-6 flex items-center gap-3 rounded-xl px-4 py-2.5 text-[0.9375rem] font-medium transition-all duration-200",
              isDashboard
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/[0.06] hover:text-white"
            )}
          >
            <LayoutDashboard
              className={cn(
                "size-[1.1rem] shrink-0",
                isDashboard ? "text-primary-light" : "text-white/40"
              )}
              aria-hidden="true"
            />
            Dashboard
          </Link>
          <NavItems />
        </div>
        <UserCard user={user} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-pine-deep/60 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[19rem] max-w-[85vw] flex-col bg-pine-deep shadow-soft">
            <div className="flex items-center justify-between px-6 pt-6 pb-5">
              <Logo inverted className="h-8" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close admin menu"
                className="flex size-10 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3">
              <Link
                href="/admin"
                className={cn(
                  "mb-6 flex items-center gap-3 rounded-xl px-4 py-2.5 text-[0.9375rem] font-medium",
                  isDashboard ? "bg-white/10 text-white" : "text-white/60"
                )}
              >
                <LayoutDashboard className="size-[1.1rem] text-white/40" aria-hidden="true" />
                Dashboard
              </Link>
              <NavItems />
              <Link
                href="/"
                className="mt-7 flex items-center gap-3 rounded-xl px-4 py-2.5 text-[0.9375rem] font-medium text-white/60 hover:bg-white/[0.06] hover:text-white"
              >
                <Home className="size-[1.1rem] text-white/40" aria-hidden="true" />
                View Site
                <ArrowUpRight className="ml-auto size-4 text-white/30" aria-hidden="true" />
              </Link>
            </div>
            <UserCard user={user} />
          </aside>
        </div>
      )}
    </>
  );
}
