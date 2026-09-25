"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { fieldClass, labelClass } from "@/components/ui/select-field";
import { useNow } from "@/lib/use-now";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Monday-first weekday labels, matching the opening-hours order. */
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

type Month = { year: number; month: number };

function monthOf(date: Date): Month {
  return { year: date.getFullYear(), month: date.getMonth() };
}

function sameMonth(a: Month, b: Month) {
  return a.year === b.year && a.month === b.month;
}

function shiftMonth({ year, month }: Month, delta: number): Month {
  const next = new Date(year, month + delta, 1);
  return { year: next.getFullYear(), month: next.getMonth() };
}

/**
 * Custom date picker styled to the site's design language — the native
 * date input can't be styled, so we render our own accessible calendar
 * popover (Monday-first, past dates disabled, full keyboard support).
 */
export function DatePicker({
  id,
  label,
  value,
  onChange,
  placeholder = "Select a date",
}: {
  id: string;
  label: string;
  /** Selected date as a local ISO string (yyyy-mm-dd). */
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
}) {
  const tick = useNow();
  const today = tick === null ? null : startOfDay(new Date(tick));

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Month | null>(null);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const selected = value ? startOfDay(new Date(`${value}T00:00:00`)) : null;

  const focusDay = (iso: string) => {
    requestAnimationFrame(() => {
      const grid = gridRef.current;
      const target =
        grid?.querySelector<HTMLButtonElement>(`[data-iso="${iso}"]`) ??
        grid?.querySelector<HTMLButtonElement>("button:not(:disabled)");
      target?.focus();
    });
  };

  const openPanel = () => {
    const base = selected ?? today;
    if (base) setView(monthOf(base));
    setOpen(true);
    if (selected) focusDay(value);
    else if (today) focusDay(toISO(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  const toggle = () => {
    if (open) {
      setOpen(false);
    } else {
      openPanel();
    }
  };

  const pick = (iso: string) => {
    onChange(iso);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const moveFocus = (from: string, deltaDays: number) => {
    if (!view) return;
    const date = new Date(`${from}T00:00:00`);
    date.setDate(date.getDate() + deltaDays);
    const iso = toISO(date.getFullYear(), date.getMonth(), date.getDate());
    const nextView = monthOf(date);
    if (!sameMonth(nextView, view)) {
      setView(nextView);
      focusDay(iso);
    } else {
      document
        .querySelector<HTMLButtonElement>(`[data-iso="${iso}"]`)
        ?.focus();
    }
  };

  const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    const dayButton = (event.target as HTMLElement).closest?.("button[data-iso]");
    const from = dayButton?.getAttribute("data-iso");
    if (!from || !view) return;

    const fromDate = new Date(`${from}T00:00:00`);
    const weekIndex = (fromDate.getDay() + 6) % 7;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveFocus(from, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(from, -1);
        break;
      case "ArrowDown":
        event.preventDefault();
        moveFocus(from, 7);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(from, -7);
        break;
      case "Home":
        event.preventDefault();
        moveFocus(from, -weekIndex);
        break;
      case "End":
        event.preventDefault();
        moveFocus(from, 6 - weekIndex);
        break;
      case "PageUp":
      case "PageDown": {
        event.preventDefault();
        const delta = event.key === "PageUp" ? -1 : 1;
        const nextView = shiftMonth(view, delta);
        const day = Math.min(fromDate.getDate(), daysInMonth(nextView.year, nextView.month));
        const iso = toISO(nextView.year, nextView.month, day);
        setView(nextView);
        focusDay(iso);
        break;
      }
    }
  };

  const formatted = selected
    ? selected.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const prevDisabled =
    !view || !today || sameMonth(view, monthOf(today));

  const weeks: (number | null)[][] = [];
  if (view) {
    const offset = (new Date(view.year, view.month, 1).getDay() + 6) % 7;
    const total = daysInMonth(view.year, view.month);
    let week: (number | null)[] = Array(offset).fill(null);
    for (let day = 1; day <= total; day += 1) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length) {
      weeks.push([...week, ...Array(7 - week.length).fill(null)]);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <span id={`${id}-label`} className={labelClass}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        aria-labelledby={`${id}-label`}
        onClick={toggle}
        className={cn(fieldClass, "flex items-center justify-between gap-2 text-left")}
      >
        <span className={cn("flex min-w-0 items-center gap-2", !formatted && "text-muted/70")}>
          <Calendar
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 transition-colors duration-200",
              formatted ? "text-primary" : "text-muted/70"
            )}
          />
          <span className="truncate">{formatted ?? placeholder}</span>
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
        {open && view && (
          <motion.div
            id={`${id}-panel`}
            role="dialog"
            aria-label={`Choose a date — ${new Date(view.year, view.month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute inset-x-0 top-full z-20 mt-2 rounded-2xl border border-border bg-white p-3.5 shadow-card"
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setView((current) => (current ? shiftMonth(current, -1) : current))}
                disabled={prevDisabled}
                aria-label="Previous month"
                className="flex size-8 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <p
                aria-live="polite"
                className="font-heading text-[0.9rem] font-bold tracking-tight text-foreground"
              >
                {new Date(view.year, view.month, 1).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <button
                type="button"
                onClick={() => setView((current) => (current ? shiftMonth(current, 1) : current))}
                aria-label="Next month"
                className="flex size-8 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div
              ref={gridRef}
              role="grid"
              aria-labelledby={`${id}-label`}
              onKeyDown={onGridKeyDown}
              className="mt-3"
            >
              <div role="row" className="grid grid-cols-7">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    role="columnheader"
                    className="flex h-8 items-center justify-center text-[0.7rem] font-bold tracking-wider text-muted uppercase"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} role="row" className="grid grid-cols-7">
                  {week.map((day, dayIndex) => {
                    if (day === null) {
                      return <div key={dayIndex} role="gridcell" />;
                    }
                    const iso = toISO(view.year, view.month, day);
                    const date = new Date(view.year, view.month, day);
                    const isDisabled = today !== null && date < today;
                    const isSelected = value === iso;
                    const isToday = today?.getTime() === date.getTime();
                    return (
                      <div
                        key={iso}
                        role="gridcell"
                        aria-selected={isSelected}
                        className="flex items-center justify-center p-0.5"
                      >
                        <button
                          type="button"
                          data-iso={iso}
                          disabled={isDisabled}
                          aria-current={isToday ? "date" : undefined}
                          aria-label={date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                          onClick={() => pick(iso)}
                          className={cn(
                            "flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors duration-150",
                            isDisabled
                              ? "cursor-default text-muted/35"
                              : "font-medium text-foreground/80 hover:bg-secondary hover:text-foreground",
                            isToday &&
                              !isSelected &&
                              "font-bold text-primary ring-1 ring-inset ring-primary/40",
                            isSelected && "bg-primary font-semibold text-white"
                          )}
                        >
                          {day}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-border/60 px-1 pt-2.5">
              {today && (
                <button
                  type="button"
                  onClick={() => pick(toISO(today.getFullYear(), today.getMonth(), today.getDate()))}
                  className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
                >
                  Today
                </button>
              )}
              <p className="text-xs text-muted">We confirm every slot by phone.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
