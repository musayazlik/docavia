import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Doctors } from "@/components/sections/doctors";
import { Testimonials } from "@/components/sections/testimonials";
import { AppointmentCta } from "@/components/sections/appointment-cta";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { services } from "@/lib/data";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Doctors",
  description:
    "Meet Docavia's specialists — board-certified cardiologists, neurologists, pediatricians and general practitioners who listen first.",
  alternates: { canonical: "/doctors" },
  openGraph: {
    title: "Doctors — Docavia",
    description: "Meet Docavia's specialists — board-certified cardiologists, neurologists, pediatricians and general practitioners who listen first.",
    url: "/doctors",
    images: [{ url: "/images/og.jpg" }],
  },
};

export default function DoctorsPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          label="Doctors"
          eyebrow="The Team"
          title={
            <>
              Experts Who{" "}
              <em className="font-accent font-normal text-primary italic">
                Listen First.
              </em>
            </>
          }
          description="Fifty board-certified physicians across thirty fields — hand-picked not only for their credentials, but for how they treat people."
        />

        <Doctors hideViewAll />

        {/* Specialties index */}
        <section aria-label="Care by field" className="py-24 md:py-32">
          <div className="shell grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <SectionHeading
              eyebrow="Care by Field"
              title={
                <>
                  Find the Right{" "}
                  <em className="font-accent font-normal text-primary italic">
                    Specialist.
                  </em>
                </>
              }
              description="Every department is led by senior physicians and supported by the same diagnostic lab, imaging and follow-up care."
            />

            <Stagger className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <StaggerItem key={service.title}>
                  <a
                    href="/services"
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-white px-5 py-4.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <service.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-heading flex-1 text-[0.95rem] font-bold tracking-tight text-foreground">
                      {service.title}
                    </span>
                    <ArrowUpRight
                      className="size-4.5 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <Testimonials />

        {/* Careers strip */}
        <section aria-label="Careers at Docavia">
          <div className="shell">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-primary-light bg-primary-light/50 px-8 py-10 sm:px-12 md:py-12">
                <div
                  aria-hidden="true"
                  className="bg-dots absolute top-6 right-8 hidden size-28 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)] md:block"
                />
                <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <h2 className="font-heading text-[1.5rem] leading-snug font-bold tracking-tight text-balance sm:text-[1.75rem]">
                      A great clinic is{" "}
                      <em className="font-accent font-normal text-primary italic">
                        its people.
                      </em>
                    </h2>
                    <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
                      We&apos;re always looking for physicians, nurses and
                      care staff who share our unhurried approach to
                      medicine. Sound like you?
                    </p>
                  </div>
                  <a
                    href={`mailto:${site.email}?subject=Joining%20Docavia`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-pine px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-dark"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    Join the Team
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <AppointmentCta />
      </main>
      <Footer />
    </>
  );
}
