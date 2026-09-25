import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "light" | "ghost-dark";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[0.9375rem] font-semibold tracking-[-0.01em] transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_18px_36px_-14px_rgb(24_63_58/0.55)] active:translate-y-0",
  outline:
    "border border-border bg-white text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary",
  light:
    "bg-white text-pine hover:-translate-y-0.5 hover:bg-primary-light active:translate-y-0",
  "ghost-dark":
    "border border-white/20 text-white hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10",
};

export function Button({
  href,
  variant = "primary",
  withArrow = false,
  className,
  children,
  ariaLabel,
  onClick,
}: {
  href: string;
  variant?: ButtonVariant;
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowRight
          className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </>
  );
  const classes = cn(base, variants[variant], className);

  // internal routes get a real next/link for prefetching and client-side nav
  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={onClick} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {content}
    </a>
  );
}
