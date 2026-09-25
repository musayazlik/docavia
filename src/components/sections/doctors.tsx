import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { doctors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export function Doctors({ hideViewAll = false }: { hideViewAll?: boolean }) {
  return (
    <section id="doctors" className="bg-secondary/60 py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Our Specialists"
            title={
              <>
                Meet the People{" "}
                <em className="font-accent font-normal text-primary italic">
                  Behind Your Care.
                </em>
              </>
            }
          />
          {!hideViewAll && (
            <Reveal delay={0.1} className="hidden sm:block">
              <Button href="/doctors" variant="outline" withArrow>
                View All Doctors
              </Button>
            </Reveal>
          )}
        </div>

        <Stagger className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <StaggerItem key={doctor.name}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
                  <Image
                    src={doctor.image}
                    alt={`Portrait of ${doctor.name}, ${doctor.specialty} at Docavia`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-pine/55 via-pine/0 to-pine/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute right-4 bottom-4 flex size-11 translate-y-2 items-center justify-center rounded-full bg-white text-pine opacity-0 shadow-float transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <ArrowUpRight className="size-4.5" />
                  </span>
                </div>

                <div className="mt-5 transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                  <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                    {doctor.name}
                  </h3>
                  <p className="mt-0.5 text-sm font-semibold text-primary">
                    {doctor.specialty}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {doctor.bio}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {!hideViewAll && (
          <Reveal className="mt-12 text-center sm:hidden">
            <Button href="/doctors" variant="outline" withArrow>
              View All Doctors
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
