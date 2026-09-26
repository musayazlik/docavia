"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarX2, ChevronDown, Clock } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { fieldClass, labelClass } from "@/components/ui/select-field";
import { useNow } from "@/lib/use-now";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Opening hours by weekday (0 = Sunday) in minutes; null = closed. */
const OPENING: Record<number, [number, number] | null> = {
  0: null,
  1: [8 * 60, 20 * 60],
  2: [8 * 60, 20 * 60],
  3: [8 * 60, 20 * 60],
  4: [8 * 60, 20 * 60],
  5: [8 * 60, 20 * 60],
  6: [9 * 60, 14 * 60],
};

const PERIODS = [
  { label: "Morning", from: 8 * 60, to: 12 * 60 },
  { label: "Afternoon", from: 12 * 60, to: 17 * 60 },
  { label: "Evening", from: 17 * 60, to: 20 * 60 },
] as const;

function formatTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export type SlotGroup = { label: string; slots: string[] };

/**
 * 30-minute bookable slots for a given day. Without a date, weekday
 * hours are assumed; `nowMinutes` trims slots that are already too
 * close to the current time (used when booking for today).
 */
export function slotsForDate(
  dateIso: string | null,
  nowMinutes: number | null = null
): SlotGroup[] {
  const day = dateIso ? new Date(`${dateIso}T00:00:00`).getDay() : 1;
  const range = OPENING[day];
  if (!range) return [];
  return PERIODS.map(({ label, from, to }) => {
    const slots: string[] = [];
    for (
      let m = Math.max(from, range[0]);
      m < Math.min(to, range[1]);
      m += 30
    ) {
      if (nowMinutes !== null && m - nowMinutes < 30) continue;
      slots.push(formatTime(m));
    }
    return { label, slots };
  }).filter((group) => group.slots.length > 0);
}

/**
 * Custom time picker styled to the site's design language — 30-minute
 * slots grouped by period, day-aware opening hours, "no slots" empty
 * state and full keyboard support. Time is optional (clearable).
 */
export function TimePicker({
  id,
  label,
  value,
  onChange,
  dateIso,
  disabledSlots = [],
  placeholder = "No preference",
}: {
  id: string;
  label: string;
  /** Selected slot start in HH:MM (24h), or "" when unset. */
  value: string;
  onChange: (time: string) => void;
  /** Local ISO date (yyyy-mm-dd) the slots apply to, or "" when unset. */
  dateIso: string;
  /** Slots already booked for the selected doctor and date. */
  disabledSlots?: string[];
  placeholder?: string;
}) {
  const tick = useNow();
  const now = tick === null ? null : new Date(tick);
  const todayIso =
    now === null
      ? null
      : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const nowMinutes = now ? now.getHours() * 60 + now.getMinutes() : null;

  const isToday = Boolean(dateIso) && dateIso === todayIso;
  const groups = slotsForDate(dateIso || null, isToday ? nowMinutes : null);
  const flatSlots = groups.flatMap((group) => group.slots);
  const closed = groups.length === 0;

  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const focusSlot = (slot: string | null) => {
    requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target = slot
        ? panel.querySelector<HTMLButtonElement>(
            `[data-slot="${slot}"]:not(:disabled)`
          )
        : panel.querySelector<HTMLButtonElement>(
            'button[role="option"]:not(:disabled)'
          );
      target?.focus();
    });
  };

  const toggle = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
      focusSlot(value || null);
    }
  };

  const pick = (slot: string) => {
    onChange(slot);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    const chip = (event.target as HTMLElement).closest?.("button[data-slot]");
    const slot = chip?.getAttribute("data-slot");
    if (!slot) return;

    const deltas: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 4,
      ArrowUp: -4,
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();

    let index = flatSlots.indexOf(slot) + delta;
    while (index >= 0 && index < flatSlots.length) {
      const target = flatSlots[index];
      const button = panelRef.current?.querySelector<HTMLButtonElement>(
        `[data-slot="${target}"]`
      );
      if (button && !button.disabled) {
        button.focus();
        break;
      }
      index += Math.sign(delta);
    }
  };

  const contextDate = dateIso
    ? new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "Mon – Fri hours";

  const isSunday =
    dateIso ? new Date(`${dateIso}T00:00:00`).getDay() === 0 : false;

  const emptyState = isSunday
    ? {
        title: "We're closed on Sundays.",
        description: "Please pick another day to see available slots.",
      }
    : {
        title: "No slots left for this day.",
        description: "Please pick another day or leave the time to us.",
      };

  return (
    <div ref={rootRef} className="relative">
      <span id={`${id}-label`} className={labelClass}>
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label`}
        onClick={toggle}
        className={cn(
          fieldClass,
          "flex items-center justify-between gap-2 text-left"
        )}
      >
        <span className={cn("flex min-w-0 items-center gap-2", !value && "text-muted/70")}>
          <Clock
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 transition-colors duration-200",
              value ? "text-primary" : "text-muted/70"
            )}
          />
          <span className="truncate">{value || placeholder}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={`${id}-panel`}
            role="dialog"
            aria-label="Choose a time"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            onKeyDown={onPanelKeyDown}
            className="absolute inset-x-0 top-full z-20 mt-2 rounded-2xl border border-border bg-white p-3.5 shadow-card"
          >
            <div className="flex items-center justify-between gap-2 px-1">
              <p className="font-heading text-[0.9rem] font-bold tracking-tight text-foreground">
                Available Times
              </p>
              <p className="text-xs font-medium text-muted">{contextDate}</p>
            </div>

            {closed ? (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
                  <CalendarX2 className="size-5" aria-hidden="true" />
                </span>
                <p className="font-heading mt-4 text-[1.05rem] font-bold tracking-tight text-foreground">
                  {emptyState.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {emptyState.description}
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-3.5">
                {groups.map((group) => (
                  <div key={group.label}>
                    <p
                      id={`${id}-${group.label.toLowerCase()}`}
                      className="font-heading px-1 text-[0.7rem] font-bold tracking-[0.14em] text-muted uppercase"
                    >
                      {group.label}
                    </p>
                    <div
                      role="listbox"
                      aria-labelledby={`${id}-${group.label.toLowerCase()}`}
                      className="mt-1.5 grid grid-cols-4 gap-1.5"
                    >
                      {group.slots.map((slot) => {
                        const isSelected = value === slot;
                        const isDisabled = disabledSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            role="option"
                            data-slot={slot}
                            aria-selected={isSelected}
                            aria-label={isDisabled ? `${slot}, unavailable` : slot}
                            disabled={isDisabled}
                            onClick={() => pick(slot)}
                            className={cn(
                              "rounded-lg px-1 py-2 text-[0.8125rem] font-medium transition-colors duration-150",
                              isSelected
                                ? "bg-primary font-semibold text-white"
                                : isDisabled
                                  ? "cursor-not-allowed bg-secondary/70 text-muted/45 line-through"
                                  : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2.5 flex items-center justify-between border-t border-border/60 px-1 pt-2.5">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className={cn(
                  "text-sm font-semibold transition-colors duration-200",
                  value
                    ? "text-primary hover:text-primary-dark"
                    : "text-muted"
                )}
              >
                No preference
              </button>
              <p className="text-xs text-muted">All slots are 30 minutes.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
