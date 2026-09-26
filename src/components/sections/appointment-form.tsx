"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CalendarCheck,
  Check,
  CheckCircle2,
  Copy,
  Hospital,
  Mail,
  Video,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import {
  SelectField,
  fieldClass,
  labelClass,
  type Option,
} from "@/components/ui/select-field";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker, slotsForDate } from "@/components/ui/time-picker";
import {
  createAppointment,
  getBookedAppointmentSlots,
} from "@/app/actions/appointments";

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "sending" | "sent";

const visitTypes = [
  { value: "in-person", label: "In-Person Visit", Icon: Hospital },
  { value: "video", label: "Video Consultation", Icon: Video },
] as const;

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function AppointmentForm({
  serviceTitles,
  doctors,
}: {
  /** Current service titles from the content store. */
  serviceTitles: string[];
  /** Current doctor roster from the content store. */
  doctors: Array<{ name: string; specialty: string }>;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [department, setDepartment] = useState("");
  const [departmentError, setDepartmentError] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [time, setTime] = useState("");
  const [bookedAvailability, setBookedAvailability] = useState<{
    key: string;
    slots: string[];
  }>({ key: "", slots: [] });
  const [visitType, setVisitType] = useState<string>("in-person");
  const [date, setDate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let active = true;
    const availabilityKey = `${doctor}::${date}`;

    if (!doctor || doctor === "no-preference" || !date) {
      return () => {
        active = false;
      };
    }

    getBookedAppointmentSlots({ doctor, date })
      .then((slots) => {
        if (!active) return;
        setBookedAvailability({ key: availabilityKey, slots });
        setTime((current) => (current && slots.includes(current) ? "" : current));
      })
      .catch(() => {
        if (active) setBookedAvailability({ key: availabilityKey, slots: [] });
      });

    return () => {
      active = false;
    };
  }, [date, doctor]);

  const availabilityKey = `${doctor}::${date}`;
  const bookedSlots =
    bookedAvailability.key === availabilityKey ? bookedAvailability.slots : [];

  // a new day can invalidate the chosen slot (different hours, full day)
  const handleDateChange = (iso: string) => {
    setDate(iso);
    setTime((current) =>
      current && !slotsForDate(iso).some((group) => group.slots.includes(current))
        ? ""
        : current
    );
  };

  const departmentOptions: Option[] = [
    ...serviceTitles.map((title) => ({ value: title, label: title })),
    { value: "other", label: "Other / Not sure" },
  ];

  const doctorOptions: Option[] = [
    ...doctors.map((doc) => ({
      value: doc.name,
      label: `${doc.name} — ${doc.specialty}`,
    })),
    { value: "no-preference", label: "No preference — match me" },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;
    if (!department) {
      setDepartmentError(true);
      return;
    }
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    setFormError(null);

    const result = await createAppointment({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      department,
      doctor: doctor || "no-preference",
      date,
      timeSlot: time,
      visitType,
      notes: String(data.get("notes") ?? ""),
      website: String(data.get("website") ?? ""),
    });

    if (result.ok) {
      setCode(result.code ?? "");
      setSubmittedEmail(String(data.get("email") ?? "").trim());
      setStatus("sent");
    } else {
      setStatus("idle");
      setFormError(result.message);
    }
  };

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — still show the
      // code so the user can copy it manually.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  const reset = () => {
    setStatus("idle");
    setDepartment("");
    setDepartmentError(false);
    setDoctor("");
    setTime("");
    setVisitType("in-person");
    setDate("");
    setFormError(null);
    setCode("");
    setSubmittedEmail("");
  };

  const summaryRows = [
    { label: "Department", value: department },
    {
      label: "Doctor",
      value:
        doctorOptions.find((o) => o.value === doctor)?.label ??
        "No preference — match me",
    },
    { label: "Date", value: date ? formatDate(date) : "" },
    {
      label: "Time",
      value: time || "Any time",
    },
    {
      label: "Visit type",
      value: visitTypes.find((t) => t.value === visitType)?.label ?? "",
    },
  ].filter((row) => row.value);

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
            className="py-6"
            aria-live="polite"
          >
            <div className="flex flex-col items-center text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-primary-light text-primary">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </span>
              <h3 className="font-heading mt-6 text-2xl font-bold tracking-tight text-foreground">
                Appointment Requested.
              </h3>
              <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
                Thank you — we have your request. Our care team will call to
                confirm the exact slot within one working day.
              </p>
              {code && (
                <div className="mt-6 rounded-2xl border border-primary/25 bg-primary-light/50 px-6 py-4">
                  <p className="font-heading text-xs font-bold tracking-[0.14em] text-primary-dark uppercase">
                    Your appointment code
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3">
                    <p className="font-heading text-2xl font-bold tracking-[0.08em] text-primary-dark">
                      {code}
                    </p>
                    <button
                      type="button"
                      onClick={copyCode}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary-dark/25 bg-white/70 px-3 py-1.5 text-xs font-semibold text-primary-dark transition-colors duration-200 hover:bg-white"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5" aria-hidden="true" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" aria-hidden="true" />
                          Copy code
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-primary-dark/80">
                    Keep this code — you can look up or cancel your appointment
                    with it below.
                  </p>
                </div>
              )}
              {submittedEmail && (
                <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
                  <Mail className="size-4 text-primary" aria-hidden="true" />
                  Confirmation email: {submittedEmail}
                </p>
              )}
            </div>

            <dl className="mt-8 grid gap-x-8 gap-y-4 rounded-2xl bg-secondary/60 p-6 sm:grid-cols-2">
              {summaryRows.map((row) => (
                <div key={row.label}>
                  <dt className="font-heading text-xs font-bold tracking-[0.14em] text-muted uppercase">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-[0.9375rem] font-semibold text-foreground">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary/40 hover:bg-secondary"
              >
                Book Another Appointment
              </button>
            </div>
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
                <label htmlFor="appointment-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="appointment-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Cooper"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="appointment-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="appointment-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+1 234 567 890"
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="appointment-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="appointment-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@example.com"
                  className={fieldClass}
                />
              </div>
              <div>
                <SelectField
                  id="appointment-department"
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
              <div>
                <SelectField
                  id="appointment-doctor"
                  label="Doctor"
                  options={doctorOptions}
                  placeholder="Any available doctor"
                  value={doctor}
                  onChange={setDoctor}
                  hasError={false}
                />
              </div>
              <div>
                <DatePicker
                  id="appointment-date"
                  label="Preferred Date"
                  value={date}
                  onChange={handleDateChange}
                  placeholder="Select a date"
                />
              </div>
              <div>
                <TimePicker
                  id="appointment-time"
                  label="Preferred Time"
                  value={time}
                  onChange={setTime}
                  dateIso={date}
                  disabledSlots={bookedSlots}
                  placeholder="No preference"
                />
              </div>

              <fieldset className="sm:col-span-2">
                <legend className={labelClass}>Visit Type</legend>
                <div className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-secondary/50 p-1.5 sm:grid-cols-2">
                  {visitTypes.map(({ value, label, Icon }) => (
                    <label key={value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="visitType"
                        value={value}
                        checked={visitType === value}
                        onChange={() => setVisitType(value)}
                        className="peer sr-only"
                      />
                      <span className="flex items-center justify-center gap-2.5 rounded-lg px-4 py-3 text-[0.9375rem] font-medium text-muted transition-all duration-200 peer-checked:bg-white peer-checked:font-semibold peer-checked:text-foreground peer-checked:shadow-float peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                        <Icon className="size-4" aria-hidden="true" />
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="sm:col-span-2">
                <label htmlFor="appointment-notes" className={labelClass}>
                  Notes{" "}
                  <span className="font-body font-normal text-muted">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="appointment-notes"
                  name="notes"
                  rows={4}
                  placeholder="Symptoms, previous visits, anything our doctors should know…"
                  className={cn(fieldClass, "resize-none")}
                />
              </div>
            </div>

            <div aria-hidden="true" className="sr-only">
              <label htmlFor="appointment-website">Website</label>
              <input
                id="appointment-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {formError && (
              <p
                role="alert"
                className="mt-5 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
              >
                {formError}
              </p>
            )}

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-60"
              >
                {status === "sending" ? "Requesting…" : "Request Appointment"}
                <CalendarCheck
                  className="size-4 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
              </button>
              <p className="text-xs leading-relaxed text-muted">
                You&apos;ll get a confirmation call within one working day.
                <br />
                By requesting, you agree to our privacy policy.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
