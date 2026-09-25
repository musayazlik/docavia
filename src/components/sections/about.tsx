import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { getContent } from "@/lib/content/store";

/** Renders "15+" with the trailing +/% highlighted, matching the design. */
function BadgeValue({ value }: { value: string }) {
  const match = value.match(/^(.*?)([+%])$/);
  if (!match) return <>{value}</>;
  return (
    <>
      {match[1]}
      <span className="text-primary-light">{match[2]}</span>
    </>
  );
}

export async function About() {
  const about = (await getContent()).about;

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="shell grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        {/* image composition */}
        <Reveal className="relative">
          <div className="bg-dots absolute -top-10 -left-8 size-32 opacity-70" aria-hidden="true" />
          <div className="relative aspect-[16/11] overflow-hidden rounded-[2.5rem] rounded-tl-[6rem] shadow-soft">
            <Image
              src="/images/about-large.jpg"
              alt="Doctor warmly talking with a patient during a consultation at Docavia"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>

          <Reveal
            delay={0.2}
            className="absolute -right-3 -bottom-10 hidden w-44 sm:block md:-right-6 md:w-52"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] border-[6px] border-white shadow-card">
              <Image
                src="/images/about-small.jpg"
                alt="Docavia physician reviewing notes at her desk"
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal
            delay={0.3}
            className="absolute top-6 -left-3 sm:-left-6 md:top-10 md:-left-10"
          >
            <div className="rounded-2xl bg-pine px-6 py-5 text-white shadow-soft">
              <p className="font-heading text-[1.75rem] leading-none font-bold tracking-tight">
                <BadgeValue value={about.badgeValue} />
              </p>
              <p className="mt-1.5 text-xs leading-snug text-white/70">
                {about.badgeLabel}
              </p>
            </div>
          </Reveal>
        </Reveal>

        {/* copy */}
        <div>
          <SectionHeading
            eyebrow={about.eyebrow}
            title={
              <>
                {about.title}{" "}
                <em className="font-accent font-normal text-primary italic">
                  {about.titleAccent}
                </em>
              </>
            }
            description={about.description}
          />

          <Stagger className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {about.benefits.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <div className="flex gap-3.5">
                  <CheckCircle2
                    className="mt-1 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-heading text-[1.05rem] font-bold tracking-tight text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-11">
            <Button href="#services" variant="outline" withArrow>
              {about.buttonLabel}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
