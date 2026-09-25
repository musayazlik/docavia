import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { getContent } from "@/lib/content/store";

export async function WhyUs() {
  const whyUs = (await getContent()).whyUs;

  return (
    <section id="why-us" className="py-24 md:py-32">
      <div className="shell grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-20 xl:gap-24">
        <div>
          <SectionHeading
            eyebrow={whyUs.eyebrow}
            title={
              <>
                {whyUs.title}{" "}
                <em className="font-accent font-normal text-primary italic">
                  {whyUs.titleAccent}
                </em>
              </>
            }
            description={whyUs.description}
          />

          <Stagger className="mt-14 divide-y divide-border border-y border-border">
            {whyUs.features.map((feature, index) => (
              <StaggerItem key={feature.title}>
                <div className="flex gap-8 py-8">
                  <span
                    className="font-accent w-12 shrink-0 text-[1.7rem] leading-none text-primary/45 italic"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="relative">
          <div
            className="bg-dots absolute -top-9 -right-5 size-36 opacity-80"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/3.3] overflow-hidden rounded-[2.5rem] rounded-br-[6rem] shadow-soft lg:aspect-auto lg:h-full">
            <Image
              src="/images/why-us.jpg"
              alt="Doctor explaining results to a patient during a modern consultation"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover object-[42%_center]"
            />
          </div>

          <div className="absolute -bottom-8 left-5 sm:left-9">
            <div className="flex animate-float items-center gap-4 rounded-2xl border border-border/70 bg-white/92 px-6 py-5 shadow-float backdrop-blur-md motion-reduce:animate-none">
              <span className="font-heading text-4xl font-bold tracking-tight text-primary">
                {whyUs.badgeValue}
              </span>
              <span className="text-sm leading-snug text-muted">
                {whyUs.badgeLabel}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
