"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Loader2, SearchX } from "lucide-react";
import {
  cancelAppointment,
  lookupAppointments,
  type LookupResult,
} from "@/app/actions/appointments";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Public "My appointment" lookup — patients search by their code or email,
 * see the matching requests and can cancel them (code acts as the token).
 */
export function AppointmentLookup() {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [confirmingCode, setConfirmingCode] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [searched, setSearched] = useState(false);
  const reduce = useReducedMotion();

  const search = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (pending || !query.trim()) return;
    setPending(true);
    const res = await lookupAppointments({ query });
    setResult(res);
    setSearched(true);
    setPending(false);
  };

  const cancel = async (code: string) => {
    if (cancelling) return;
    setCancelling(code);
    const res = await cancelAppointment({ code });
    if (res.ok) {
      setResult((current) =>
        current?.appointments
          ? {
              ...current,
              appointments: current.appointments.map((entry) =>
                entry.code === code ? { ...entry, status: "cancelled" } : entry,
              ),
            }
          : current,
      );
    }
    setConfirmingCode(null);
    setCancelling(null);
    // refresh statuses in place; a light re-lookup keeps data honest
    if (!res.ok) {
      setResult({ ok: false, message: res.message });
    } else {
      const fresh = await lookupAppointments({ query });
      if (fresh.ok) setResult(fresh);
    }
  };

  return (
    <div
      id="my-appointment"
      className="rounded-[2rem] border border-border bg-white p-7 shadow-card sm:p-9"
    >
      <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
        My Appointment
      </h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
        Look up your request with the code from your confirmation, or the email
        you booked with — and cancel it if your plans change.
      </p>

      <form onSubmit={search} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="APT-XXXXXX or your email"
          aria-label="Appointment code or email"
          className="w-full flex-1 rounded-xl border border-border bg-white px-4 py-3 text-[0.9375rem] text-foreground transition-all duration-200 placeholder:text-muted/60 hover:border-primary/35 focus:border-primary focus:shadow-[0_0_0_3px_rgb(47_118_109/0.12)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !query.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark disabled:opacity-50"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Look Up
        </button>
      </form>

      {searched && result && (
        <div aria-live="polite" className="mt-5">
          {!result.ok ? (
            <p className="flex items-center gap-2.5 rounded-2xl bg-secondary/70 px-5 py-4 text-sm text-muted">
              <SearchX className="size-4 shrink-0" aria-hidden="true" />
              {result.message}
            </p>
          ) : (
            <ul className="space-y-3">
              {result.appointments?.map((entry) => {
                const cancelled = entry.status === "cancelled";
                return (
                  <li
                    key={entry.code}
                    className={cn(
                      "rounded-2xl border p-5",
                      cancelled ? "border-border bg-secondary/40" : "border-border",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-heading font-mono text-sm font-bold tracking-[0.08em] text-primary">
                          {entry.code}
                        </p>
                        <p className="mt-1 text-[0.9375rem] font-semibold text-foreground">
                          {entry.department}
                          {entry.doctor && entry.doctor !== "no-preference"
                            ? ` · ${entry.doctor}`
                            : ""}
                        </p>
                        <p className="mt-0.5 text-sm text-muted">
                          {formatDate(entry.date)}
                          {entry.timeSlot ? ` · ${entry.timeSlot}` : " · any time"}
                          {` · ${entry.visitType === "video" ? "video" : "in-person"}`}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize",
                          cancelled
                            ? "bg-red-50 text-red-600"
                            : entry.status === "confirmed"
                              ? "bg-[#f2b01e]/15 text-[#8a6200]"
                              : entry.status === "completed"
                                ? "bg-foreground/5 text-muted"
                                : "bg-primary-light text-primary-dark",
                        )}
                      >
                        {entry.status}
                      </span>
                    </div>

                    {entry.status === "new" && (
                      <AnimatePresence mode="wait" initial={false}>
                        {confirmingCode === entry.code ? (
                          <motion.div
                            key="confirm"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-secondary/70 px-4 py-3"
                          >
                            <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted">
                              Cancel this appointment? The slot will be released
                              for other patients.
                            </p>
                            <button
                              type="button"
                              onClick={() => cancel(entry.code)}
                              disabled={cancelling !== null}
                              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
                            >
                              {cancelling === entry.code && (
                                <Loader2 className="mr-1.5 inline size-3.5 animate-spin" aria-hidden="true" />
                              )}
                              Yes, cancel it
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingCode(null)}
                              className="rounded-lg px-4 py-2 text-xs font-semibold text-foreground transition-colors duration-200 hover:bg-white"
                            >
                              Keep it
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="idle"
                            type="button"
                            onClick={() => setConfirmingCode(entry.code)}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="mt-4 rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
                          >
                            Cancel appointment
                          </motion.button>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
