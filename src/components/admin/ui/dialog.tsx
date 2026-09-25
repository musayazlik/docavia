"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Accessible modal dialog used for entity create/edit forms and
 * confirmations. Escape closes; the scrim click closes; focus moves to the
 * panel on open and body scroll is locked.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-60 flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute inset-0 cursor-default bg-pine-deep/55 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn(
              "relative m-3 w-full rounded-[1.75rem] border border-border bg-white shadow-soft outline-none sm:m-6",
              size === "lg" ? "max-w-3xl" : "max-w-xl"
            )}
          >
            <div className="flex items-start justify-between gap-6 border-b border-border px-7 py-6">
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[min(70vh,44rem)] overflow-y-auto px-7 py-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Presentational pieces shared by the admin entity forms. */
export const inputClasses =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-[0.9375rem] leading-relaxed text-foreground shadow-[0_1px_2px_rgb(24_63_58/0.05)] transition-all duration-200 placeholder:text-muted/60 hover:border-primary/35 focus:border-primary focus:shadow-[0_0_0_3px_rgb(47_118_109/0.12)] focus:outline-none";

export function FormField({
  label,
  htmlFor,
  error,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-foreground"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {help && !error && (
        <p className="mt-2 text-xs leading-relaxed text-muted">{help}</p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
