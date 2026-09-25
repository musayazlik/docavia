import { SectionHeading } from "@/components/ui/section-heading";
import { DrawLine, Reveal } from "@/components/motion/reveal";
import { getContent } from "@/lib/content/store";

export async function HowItWorks() {
  const howItWorks = (await getContent()).howItWorks;

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          align="center"
          eyebrow={howItWorks.eyebrow}
          title={
            <>
              {howItWorks.title}{" "}
              <em className="font-accent font-normal text-primary italic">
                {howItWorks.titleAccent}
              </em>
            </>
          }
          description={howItWorks.description}
        />

        <div className="relative mt-16 md:mt-20">
          {/* connecting line — spans from the first to the last step chip */}
          <DrawLine
            className="absolute top-7 hidden h-px origin-left bg-border md:block left-[calc(16.667%-0.83rem)] right-[calc(16.667%-0.83rem)]"
          />

          <ol className="relative grid gap-12 md:grid-cols-3 md:gap-10">
            {howItWorks.steps.map((step, index) => (
              <li key={step.title + index}>
                <Reveal delay={index * 0.12} className="group text-center">
                  <span
                    className="font-heading relative z-10 mx-auto flex size-14 items-center justify-center rounded-full border border-border bg-white font-bold text-primary shadow-[0_10px_24px_-14px_rgb(24_63_58/0.35)] transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading mt-6 text-xl font-bold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2.5 max-w-xs text-[0.9375rem] leading-relaxed text-muted">
                    {step.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
