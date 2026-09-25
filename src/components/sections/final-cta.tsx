import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  return (
    <section className="pb-24 md:pb-32">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[3rem] bg-primary-light/60 px-6 py-20 text-center md:py-28">
            {/* decorations */}
            <div
              aria-hidden="true"
              className="bg-dots absolute top-10 left-10 size-40 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]"
            />
            <div
              aria-hidden="true"
              className="bg-dots absolute right-10 bottom-10 size-40 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]"
            />
            <div
              aria-hidden="true"
              className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/50 blur-3xl"
            />
            <svg
              viewBox="0 0 48 48"
              aria-hidden="true"
              className="absolute top-14 right-[12%] hidden size-12 text-primary/20 md:block"
            >
              <path
                d="M18 4h12v14h14v12H30v14H18V30H4V18h14V4Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>

            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-heading text-[2.1rem] leading-[1.12] font-bold tracking-[-0.025em] text-balance text-foreground sm:text-[2.75rem] lg:text-[3.25rem]">
                Ready to Take Better{" "}
                <em className="font-accent font-normal text-primary italic">
                  Care of Your Health?
                </em>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
                Book an appointment with one of our specialists and take the
                next step toward better health.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button href="#appointment" withArrow>
                  Book Appointment
                </Button>
                <Button href="#contact" variant="outline">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
