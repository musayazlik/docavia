import { ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section id="services" className="bg-secondary/60 py-24 md:py-32">
      <div className="shell">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionHeading
            eyebrow="Our Services"
            title={
              <>
                Care for Every{" "}
                <em className="font-accent font-normal text-primary italic">
                  Stage of Life.
                </em>
              </>
            }
          />
          <Reveal delay={0.1}>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted lg:ml-auto lg:pb-2">
              From everyday check-ups to specialist programs, thirty medical
              services under one calm roof — always with the same standard of
              attention.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <StaggerItem key={service.title} className="h-full">
              <article
                className={cn(
                  "group flex h-full flex-col rounded-[1.75rem] border p-7 transition-all duration-300 ease-out hover:-translate-y-1.5",
                  service.highlight === "dark"
                    ? "border-transparent bg-pine text-white shadow-soft hover:shadow-soft hover:brightness-110"
                    : service.highlight === "tint"
                      ? "border-primary-light bg-primary-light/50 hover:border-primary/40 hover:bg-primary-light/70 hover:shadow-card"
                      : "border-border bg-white hover:border-primary/35 hover:shadow-card"
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "flex size-13 items-center justify-center rounded-2xl transition-colors duration-300",
                      service.highlight === "dark"
                        ? "bg-white/10 text-primary-light group-hover:bg-primary group-hover:text-white"
                        : "bg-secondary text-primary group-hover:bg-primary group-hover:text-white"
                    )}
                  >
                    <service.icon className="size-6" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "font-accent text-xl italic",
                      service.highlight === "dark"
                        ? "text-white/35"
                        : "text-muted/60"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-heading mt-7 text-xl font-bold tracking-tight">
                  {service.title}
                </h3>
                <p
                  className={cn(
                    "mt-2.5 flex-1 text-[0.9375rem] leading-relaxed",
                    service.highlight === "dark" ? "text-white/65" : "text-muted"
                  )}
                >
                  {service.description}
                </p>

                <span
                  className={cn(
                    "mt-6 inline-flex items-center gap-2 text-sm font-semibold",
                    service.highlight === "dark"
                      ? "text-primary-light"
                      : "text-primary"
                  )}
                >
                  Learn more
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
                    aria-hidden="true"
                  />
                </span>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
