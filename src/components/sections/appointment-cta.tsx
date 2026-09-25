import Image from "next/image";
import { Phone } from "lucide-react";
import { site } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

export function AppointmentCta() {
  return (
    <section id="appointment" className="pt-24 pb-24 md:pt-32 md:pb-32">
      <div className="shell">
        <Reveal>
          <div className="relative rounded-[2.5rem] bg-pine text-white shadow-soft">
            {/* decorations */}
            <div
              aria-hidden="true"
              className="bg-dots-light absolute top-12 left-[44%] hidden size-40 opacity-50 lg:block"
            />
            <svg
              viewBox="0 0 48 48"
              aria-hidden="true"
              className="absolute bottom-12 left-12 hidden size-14 text-white/10 lg:block"
            >
              <path
                d="M18 4h12v14h14v12H30v14H18V30H4V18h14V4Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-20 size-60 rounded-full border-[28px] border-white/[0.04]"
            />

            <div className="p-8 sm:p-12 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-0">
              <div className="lg:py-20 lg:pl-16 lg:pr-0">
                <Eyebrow inverted>Book an Appointment</Eyebrow>
                <h2 className="font-heading mt-5 max-w-md text-[2rem] leading-[1.14] font-bold tracking-[-0.025em] text-balance sm:text-[2.5rem] lg:text-[2.85rem]">
                  Your Health Deserves the{" "}
                  <em className="font-accent font-normal text-primary-light italic">
                    Right Attention.
                  </em>
                </h2>
                <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-white/65">
                  Tell us what you need and we will match you with the right
                  specialist — usually within one working day.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 pb-2">
                  <Button href="/appointment" variant="light" withArrow>
                    Schedule Appointment
                  </Button>
                  <a
                    href={site.phoneHref}
                    className="inline-flex items-center gap-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
                  >
                    <Phone
                      className="size-4 text-primary-light"
                      aria-hidden="true"
                    />
                    or call {site.phone}
                  </a>
                </div>
              </div>

              {/* doctor image — rises above the dark panel on desktop */}
              <div className="relative mt-10 lg:mt-0 lg:min-h-[29rem]">
                <div className="relative mx-auto aspect-[4/4.4] w-full max-w-[320px] overflow-hidden rounded-[2rem] shadow-soft lg:absolute lg:inset-x-10 lg:top-[-4.5rem] lg:bottom-0 lg:max-w-none lg:w-auto lg:aspect-auto lg:rounded-b-none">
                  <Image
                    src="/images/cta-doctor.jpg"
                    alt="Docavia doctor standing in a modern clinic corridor"
                    fill
                    sizes="(min-width: 1024px) 400px, 320px"
                    className="object-cover object-top"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute -bottom-6 left-1/2 hidden h-12 w-[110%] -translate-x-1/2 rounded-[100%] bg-black/25 blur-xl lg:block"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
