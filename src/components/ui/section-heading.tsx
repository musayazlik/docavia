import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders "Plain title *Accent.*" — the italic serif accent part of section
 * headings. Content comes from the CMS as two plain strings.
 */
export function accentedTitle(
  title: string,
  accent: string,
  accentClassName = "font-accent font-normal text-primary italic"
): ReactNode {
  if (!accent) return title;
  return (
    <>
      {title}{" "}
      <em className={accentClassName}>{accent}</em>
    </>
  );
}

export function Eyebrow({
  children,
  className,
  inverted = false,
}: {
  children: ReactNode;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 font-heading text-xs font-bold tracking-[0.22em] uppercase",
        inverted ? "text-primary-light" : "text-primary",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          inverted ? "bg-primary-light" : "bg-primary"
        )}
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  inverted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow inverted={inverted}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "font-heading mt-4 text-[2.1rem] leading-[1.12] font-bold tracking-[-0.025em] text-balance sm:text-[2.6rem] lg:text-[3.1rem]",
          inverted ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-[1.0625rem] leading-relaxed",
            inverted ? "text-white/65" : "text-muted"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
