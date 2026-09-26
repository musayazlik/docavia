"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export type ActionMenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;
  /** Click action — omit when the item is a link. */
  onSelect?: () => void;
  /** Navigate target — renders a next/link (or opens a new tab with `external`). */
  href?: string;
  external?: boolean;
  danger?: boolean;
  disabled?: boolean;
  title?: string;
};

const itemClass = (item: ActionMenuItem) =>
  cn(
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[0.875rem] font-medium transition-colors duration-150",
    item.danger
      ? "text-red-600 hover:bg-red-50"
      : "text-foreground/80 hover:bg-secondary hover:text-foreground",
    item.disabled && "cursor-not-allowed opacity-40 hover:bg-transparent"
  );

/**
 * Row-actions dropdown for admin tables — an ellipsis trigger opening the
 * row's actions (edit, preview, publish, delete…) in a styled menu, so
 * tables stay calm instead of lining up icon buttons.
 */
export function ActionMenu({
  label,
  items,
  disabled = false,
}: {
  /** Accessible name, e.g. "Actions for Heart Health". */
  label: string;
  items: ActionMenuItem[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (open && event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
    }
  };

  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="relative inline-block text-left" onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
          open && "bg-secondary text-foreground"
        )}
      >
        <Ellipsis className="size-4" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={label}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-border bg-white p-1.5 shadow-card"
          >
            {items.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  role="menuitem"
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  onClick={close}
                  className={itemClass(item)}
                  title={item.title}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  role="menuitem"
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    close();
                    item.onSelect?.();
                  }}
                  className={itemClass(item)}
                  title={item.title}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
