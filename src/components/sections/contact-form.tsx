"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  SelectField,
  fieldClass,
  labelClass,
  type Option,
} from "@/components/ui/select-field";

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "sending" | "sent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [department, setDepartment] = useState("");
  const [departmentError, setDepartmentError] = useState(false);
  const reduce = useReducedMotion();

  const departmentOptions: Option[] = [
    ...services.map((service) => ({
      value: service.title,
      label: service.title,
    })),
    { value: "other", label: "Other / Not sure" },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;
    if (!department) {
      setDepartmentError(true);
      return;
    }
    setStatus("sending");
    // Demo clinic — no backend yet; simulate a short round-trip.
    window.setTimeout(() => setStatus("sent"), 900);
  };

  return (
    <div className="rounded-[2rem] border border-border bg-white p-7 shadow-card sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex min-h-[26rem] flex-col items-center justify-center text-center"
            aria-live="polite"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-primary-light text-primary">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </span>
            <h3 className="font-heading mt-6 text-2xl font-bold tracking-tight text-foreground">
              Message Received.
            </h3>
            <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
              Thank you for reaching out. Our care team will get back to you
              within one working day — usually much sooner.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setDepartment("");
                setDepartmentError(false);
              }}
              className="mt-7 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary/40 hover:bg-secondary"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Cooper"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@example.com"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className={labelClass}>
                  Phone{" "}
                  <span className="font-body font-normal text-muted">
                    (optional)
                  </span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 234 567 890"
                  className={fieldClass}
                />
              </div>
              <div>
                <SelectField
                  id="contact-department"
                  label="Department"
                  options={departmentOptions}
                  placeholder="Select a department"
                  value={department}
                  onChange={(next) => {
                    setDepartment(next);
                    setDepartmentError(false);
                  }}
                  hasError={departmentError}
                />
                {departmentError && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    Please select a department.
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us briefly what you need help with…"
                  className={cn(fieldClass, "resize-none")}
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
                <Send
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </button>
              <p className="text-xs leading-relaxed text-muted">
                By sending, you agree to our privacy policy.
                <br />
                We never share your details.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
