"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const MENU_WIDTH = 192; // w-48
const MENU_GAP = 8;

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
 * Row-actions dropdown for admin tables. The open menu is portaled to
 * document.body with fixed coordinates, so it never gets clipped by the
 * table's overflow-hidden/scroll shells and never triggers scrollbars.
 * Flips above the trigger when there is no room below.
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
  const [placement, setPlacement] = useState<{ left: number; top: number } | null>(null);
  // SSR-safe hydration gate for the portal (no effect needed)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const openMenu = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const estimatedHeight = items.length * 41 + 14;
    const left = Math.min(
      Math.max(MENU_GAP, rect.right - MENU_WIDTH),
      window.innerWidth - MENU_WIDTH - MENU_GAP
    );
    const openUp =
      window.innerHeight - rect.bottom < estimatedHeight + MENU_GAP &&
      rect.top > estimatedHeight + MENU_GAP;
    const top = openUp
      ? Math.max(MENU_GAP, rect.top - estimatedHeight - MENU_GAP)
      : Math.min(rect.bottom + MENU_GAP, window.innerHeight - estimatedHeight - MENU_GAP);
    setPlacement({ left, top });
    setOpen(true);
  }, [items.length]);

  // a fixed-position menu must not outlive scroll/resize of its anchor
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  // close on outside pointerdown — the portaled menu counts as inside
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
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
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={cn(
          "flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
          open && "bg-secondary text-foreground"
        )}
      >
        <Ellipsis className="size-4" aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && placement && (
              <motion.div
                ref={menuRef}
                role="menu"
                aria-label={label}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.22, ease: EASE }}
                style={{
                  position: "fixed",
                  left: placement.left,
                  top: placement.top,
                  width: MENU_WIDTH,
                }}
                className="z-60 rounded-xl border border-border bg-white p-1.5 shadow-card"
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
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
