import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Shared hero for inner pages — breadcrumb, eyebrow, page title and
 * description, decorated with the site's dot-grid and cross motifs.
 */
export function PageHero({
  label,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  /** Current page name shown as the last breadcrumb item. */
  label: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20",
        className
      )}
    >
      {/* decorations */}
      <div
        aria-hidden="true"
        className="bg-dots absolute -top-6 right-[6%] hidden size-44 opacity-70 [mask-image:radial-gradient(closest-side,black,transparent)] lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-secondary blur-3xl"
      />
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="absolute top-36 left-[4%] hidden size-14 text-primary/15 lg:block"
      >
        <path
          d="M18 4h12v14h14v12H30v14H18V30H4V18h14V4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

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
              <li aria-current="page" className="font-semibold text-primary">
                {label}
              </li>
            </ol>
          </nav>

          <div className="mt-7 grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className="font-heading mt-4 max-w-3xl text-[2.5rem] leading-[1.08] font-bold tracking-[-0.025em] text-balance text-foreground sm:text-[3.1rem] lg:text-[3.6rem]">
                {title}
              </h1>
            </div>
            {description && (
              <p className="max-w-md pb-2 text-[1.0625rem] leading-relaxed text-muted lg:ml-auto">
                {description}
              </p>
            )}
          </div>

          {children}
        </Reveal>
      </div>
    </section>
  );
}
