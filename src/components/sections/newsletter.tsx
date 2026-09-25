"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle2, MailOpen } from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    // Demo clinic — subscription is simulated locally.
    setSent(true);
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-primary-light bg-primary-light/50 px-6 py-12 sm:px-12 md:py-16">
      <div
        aria-hidden="true"
        className="bg-dots absolute top-6 right-8 hidden size-32 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)] md:block"
      />
      <div
        aria-hidden="true"
        className="absolute -top-20 left-[18%] size-56 rounded-full bg-white/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="mx-auto flex size-13 items-center justify-center rounded-2xl bg-white text-primary shadow-float">
          <MailOpen className="size-6" aria-hidden="true" />
        </span>
        <h2 className="font-heading mt-6 text-[1.75rem] leading-tight font-bold tracking-[-0.02em] text-balance text-foreground sm:text-[2.1rem]">
          Health Tips Worth{" "}
          <em className="font-accent font-normal text-primary italic">
            Opening.
          </em>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-muted">
          One thoughtful email a month from our doctors — practical prevention,
          seasonal advice and clinic news. No spam, ever.
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.p
              key="sent"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2.5 rounded-2xl border border-primary/25 bg-white px-5 py-4 text-sm font-semibold text-foreground"
              aria-live="polite"
            >
              <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
              You&apos;re on the list — see you in your inbox.
            </motion.p>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                className={cn(
                  "w-full flex-1 rounded-xl border border-border bg-white px-4 py-3.5 text-[0.9375rem] text-foreground",
                  "placeholder:text-muted/70 transition-colors duration-200 hover:border-primary/35",
                  "focus:border-primary focus:outline-none"
                )}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-primary px-6 py-3.5 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-dark"
              >
                Subscribe
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
