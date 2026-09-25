"use client";

import { Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-now";

export type OpeningHoursItem = { day: string; hours: string };

/** Parses "08:00 – 20:00" (also accepts "-") into [openMinutes, closeMinutes]. */
function parseHours(hours: string): [number, number] | null {
  const match = hours.match(/^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const [, openH, openM, closeH, closeM] = match;
  return [
    Number(openH) * 60 + Number(openM),
    Number(closeH) * 60 + Number(closeM),
  ];
}

/**
 * Weekly opening-hours card — highlights today and shows an open/closed
 * badge computed on the client (never during prerender, so the markup stays
 * hydration-safe across timezones). Hours come from the content store.
 */
export function OpeningHours({
  items,
  phoneHref,
}: {
  items: OpeningHoursItem[];
  phoneHref: string;
}) {
  const tick = useNow();
  const now = tick === null ? null : new Date(tick);

  const todayItem = now ? items[now.getDay() === 0 ? 6 : now.getDay() - 1] : undefined;
  const todayRange = todayItem ? parseHours(todayItem.hours) : null;
  const open =
    now && todayRange
      ? now.getHours() * 60 + now.getMinutes() >= todayRange[0] &&
        now.getHours() * 60 + now.getMinutes() < todayRange[1]
      : now
        ? false
        : null;
  const todayIndex = now ? (now.getDay() === 0 ? 6 : now.getDay() - 1) : -1;

  return (
    <div className="rounded-[2rem] border border-border bg-white p-7 shadow-card sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-13 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Clock className="size-6" aria-hidden="true" />
          </span>
          <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
            Opening Hours
          </h2>
        </div>
        {open !== null && (
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold",
              open
                ? "bg-primary-light text-primary-dark"
                : "bg-foreground/5 text-muted"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                open ? "bg-primary" : "bg-muted/60"
              )}
            />
            {open ? "Open now" : "Closed now"}
          </span>
        )}
      </div>

      <ul className="mt-6">
        {items.map(({ day, hours }, index) => {
          const isToday = index === todayIndex;
          return (
            <li
              key={day + index}
              className={cn(
                "flex items-center justify-between gap-4 border-b border-border/60 py-3 text-[0.9375rem] last:border-0",
                isToday && "-mx-3 rounded-xl bg-secondary/70 px-3"
              )}
            >
              <span
                className={cn(
                  "font-medium",
                  isToday ? "font-semibold text-primary" : "text-foreground/80"
                )}
              >
                {day}
                {isToday && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[0.6875rem] font-bold tracking-wide text-white uppercase">
                    Today
                  </span>
                )}
              </span>
              <span
                className={cn(
                  isToday
                    ? "font-semibold text-primary"
                    : hours === "Closed"
                      ? "text-muted/70"
                      : "text-muted"
                )}
              >
                {hours}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/60 pt-5 text-sm text-muted">
        Urgent outside hours?
        <a
          href={phoneHref}
          className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <Phone className="size-3.5" aria-hidden="true" />
          24/7 emergency line
        </a>
      </p>
    </div>
  );
}
