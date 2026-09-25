import Link from "next/link";
import {
  CalendarCheck,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Eyebrow } from "@/components/ui/section-heading";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Secure by design",
    description: "Role-based access with end-to-end encryption.",
  },
  {
    icon: CalendarCheck,
    title: "Every appointment",
    description: "Bookings, schedules and availability in real time.",
  },
  {
    icon: LayoutDashboard,
    title: "One dashboard",
    description: "Doctors, services, articles and messages in one place.",
  },
];

const todayStats = [
  { label: "Appointments", value: "32", delta: "+6" },
  { label: "Doctors on duty", value: "8" },
  { label: "New messages", value: "5" },
];

/**
 * Deep-pine brand panel shown beside the admin login form on large
 * screens — the visual anchor of the split layout.
 */
export function BrandPanel() {
  return (
    <aside
      aria-label="Docavia admin panel"
      className="relative hidden flex-col justify-between overflow-hidden bg-pine p-10 text-white lg:flex xl:p-14"
    >
      {/* decorations */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-primary/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-dots-light absolute right-10 bottom-36 size-40 opacity-40 [mask-image:radial-gradient(closest-side,black,transparent)]"
      />
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="absolute top-14 right-12 size-16 text-white/10"
      >
        <path
          d="M18 4h12v14h14v12H30v14H18V30H4V18h14V4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative">
        <Link href="/" aria-label="Docavia — home">
          <Logo inverted />
        </Link>
      </div>

      <div className="relative max-w-md py-12">
        <Eyebrow inverted>Admin Panel</Eyebrow>
        <p className="font-heading mt-5 text-[2.1rem] leading-[1.14] font-bold tracking-[-0.02em] text-balance xl:text-[2.4rem]">
          The quiet engine behind{" "}
          <em className="font-accent font-normal text-primary-light italic">
            great care.
          </em>
        </p>

        <ul className="mt-10 space-y-6">
          {trustPoints.map((point) => (
            <li key={point.title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary-light">
                <point.icon className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-heading text-[0.95rem] font-bold tracking-tight">
                  {point.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  {point.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative max-w-md">
        <div className="relative rounded-[1.75rem] bg-white p-6 text-foreground shadow-soft sm:p-7">
          <span className="animate-float absolute -top-4 right-6 flex items-center gap-2 rounded-full bg-primary px-4 py-2 shadow-float">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
            </span>
            <span className="font-heading text-xs font-bold text-white">
              Live
            </span>
          </span>

          <h2 className="font-heading text-sm font-bold tracking-tight">
            Today at a glance
          </h2>
          <ul className="mt-4 space-y-3">
            {todayStats.map((stat) => (
              <li
                key={stat.label}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-muted">{stat.label}</span>
                <span className="font-heading flex items-center gap-2 font-bold">
                  {stat.value}
                  {stat.delta && (
                    <span className="text-xs font-semibold text-primary">
                      {stat.delta}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
