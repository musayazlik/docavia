"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function DesktopLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children?: typeof navLinks[number]["children"];
}) {
  const linkClass =
    "relative inline-flex items-center gap-1 py-2 font-heading text-[0.9rem] font-semibold tracking-[-0.01em] text-foreground/80 transition-colors duration-300 hover:text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100";

  if (!children) {
    return (
      <Link href={href} className={linkClass}>
        {label}
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link href={href} className={linkClass} aria-haspopup="true">
        {label}
        <ChevronDown
          className="size-3.5 transition-transform duration-300 group-hover:rotate-180"
          aria-hidden="true"
        />
      </Link>
      <div className="invisible absolute top-full left-1/2 -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="w-56 rounded-2xl border border-border bg-white p-2 shadow-card">
          {children.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/75 transition-colors duration-200 hover:bg-secondary hover:text-foreground"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border/80 bg-white/85 shadow-[0_10px_36px_-24px_rgb(24_63_58/0.35)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="shell flex h-[4.75rem] items-center justify-between">
          <Link href="/" aria-label={`${site.name} — home`}>
            {/* wordmark sits optically low in the lockup — nudge up to align with nav text */}
            <Logo priority className="-translate-y-[3px]" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <DesktopLink
                key={link.label}
                label={link.label}
                href={link.href}
              >
                {link.children}
              </DesktopLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.phoneHref}
              className="mr-1 hidden items-center gap-2.5 xl:flex"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-light text-primary">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              <span className="font-heading text-sm font-bold text-foreground">
                {site.phone}
              </span>
            </a>
            <Button
              href="/appointment"
              className="hidden px-5 py-3 text-sm sm:inline-flex"
              withArrow
            >
              Book Appointment
            </Button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label="Open menu"
              className="flex size-11 items-center justify-center rounded-xl border border-border bg-white/70 text-foreground backdrop-blur transition-colors duration-300 hover:bg-secondary lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: "-4%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: "-4%" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-60 flex flex-col bg-pine text-white lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="shell flex h-[4.75rem] shrink-0 items-center justify-between">
              <Logo inverted className="-translate-y-[3px]" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex size-11 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Mobile"
              className="shell flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-8"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-4 font-heading text-[1.75rem] font-bold tracking-tight text-white/90 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
              className="shell flex shrink-0 flex-col gap-4 pb-10"
            >
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-3 text-white/80"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-white/10">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <span className="font-heading font-bold">{site.phone}</span>
              </a>
              <Button href="/appointment" variant="light" withArrow onClick={() => setOpen(false)}>
                Book Appointment
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
