"use client";

import { Clock, Phone } from "lucide-react";
import { site } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-now";

const schedule = [
  { day: "Monday", hours: "08:00 – 20:00" },
  { day: "Tuesday", hours: "08:00 – 20:00" },
  { day: "Wednesday", hours: "08:00 – 20:00" },
  { day: "Thursday", hours: "08:00 – 20:00" },
  { day: "Friday", hours: "08:00 – 20:00" },
  { day: "Saturday", hours: "09:00 – 14:00" },
  { day: "Sunday", hours: "Closed" },
] as const;

function openingState(now: Date) {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (day === 0) return false;
  if (day === 6) return minutes >= 9 * 60 && minutes < 14 * 60;
  return minutes >= 8 * 60 && minutes < 20 * 60;
}

/**
 * Weekly opening-hours card — highlights today and shows an
 * open/closed badge computed on the client (never during prerender,
 * so the markup stays hydration-safe across timezones).
 */
export function OpeningHours() {
  const tick = useNow();
  const now = tick === null ? null : new Date(tick);

  const open = now ? openingState(now) : null;
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
        {schedule.map(({ day, hours }, index) => {
          const isToday = index === todayIndex;
          return (
            <li
              key={day}
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
          href={site.phoneHref}
          className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <Phone className="size-3.5" aria-hidden="true" />
          24/7 emergency line
        </a>
      </p>
    </div>
  );
}
