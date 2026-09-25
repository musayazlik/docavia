import type { Metadata } from "next";
import Image from "next/image";
import {
  Award,
  CalendarCheck,
  HeartHandshake,
  Microscope,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stats } from "@/components/sections/stats";
import { WhyUs } from "@/components/sections/why-us";
import { AppointmentCta } from "@/components/sections/appointment-cta";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const valueIcons = [HeartHandshake, Award, Microscope, CalendarCheck];

import { getContent } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Docavia — our story, our values and the team philosophy behind modern, patient-centered healthcare.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Docavia",
    description: "Learn about Docavia — our story, our values and the team philosophy behind modern, patient-centered healthcare.",
    url: "/about",
    images: [{ url: "/images/og.jpg" }],
  },
};

export default async function AboutPage() {
  const content = await getContent();
  const hero = content.pages.about;

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          label={hero.label}
          eyebrow={hero.eyebrow}
          title={
            <>
              {hero.title}{" "}
              <em className="font-accent font-normal text-primary italic">
                {hero.titleAccent}
              </em>
            </>
          }
          description={hero.description}
        />

        {/* Story */}
        <section className="py-16 md:py-24">
          <div className="shell grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Our Story"
                title={
                  <>
                    Fifteen Years of{" "}
                    <em className="font-accent font-normal text-primary italic">
                      Better Care.
                    </em>
                  </>
                }
              />
              <div className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
                <p>
                  Docavia began in 2011 as a three-room practice with a simple
                  conviction: healthcare should feel calm, honest and
                  unhurried. No endless waiting rooms, no ten-minute
                  consultations, no jargon — just doctors who take the time to
                  understand the person in front of them.
                </p>
                <p>
                  Today our clinic brings together more than fifty specialists
                  across thirty medical services, from everyday primary care to
                  advanced cardiology and neurology. The equipment is modern
                  and the buildings are new — but the promise hasn&apos;t
                  changed since day one.
                </p>
              </div>

              <Reveal delay={0.15} className="mt-9">
                <blockquote className="border-l-2 border-primary/40 pl-6">
                  <p className="font-accent text-[1.3rem] leading-snug text-foreground italic">
                    “Treat every patient the way you would treat your own
                    family. Everything else follows from that.”
                  </p>
                  <footer className="mt-4">
                    <p className="font-heading text-sm font-bold text-foreground">
                      Dr. Emily Carter
                    </p>
                    <p className="text-sm text-muted">
                      Founder &amp; Medical Director
                    </p>
                  </footer>
                </blockquote>
              </Reveal>
            </div>

            {/* image composition */}
            <Reveal className="relative">
              <div
                className="bg-dots absolute -top-10 -right-8 size-32 opacity-70"
                aria-hidden="true"
              />
              <div className="relative aspect-[16/11] overflow-hidden rounded-[2.5rem] rounded-tr-[6rem] shadow-soft">
                <Image
                  src="/images/about-large.jpg"
                  alt="Doctor warmly talking with a patient during a consultation at Docavia"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <Reveal
                delay={0.2}
                className="absolute -bottom-10 -left-3 hidden w-44 sm:block md:-left-6 md:w-52"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-[1.5rem] border-[6px] border-white shadow-card">
                  <Image
                    src="/images/about-small.jpg"
                    alt="Docavia physician reviewing notes at her desk"
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <div className="absolute -top-6 -left-3 sm:-left-6">
                <div className="rounded-2xl bg-pine px-6 py-5 text-white shadow-soft">
                  <p className="font-heading text-[1.75rem] leading-none font-bold tracking-tight">
                    15<span className="text-primary-light">+</span>
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-white/70">
                    Years of
                    <br />
                    Experience
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary/60 py-24 md:py-32">
          <div className="shell">
            <SectionHeading
              align="center"
              eyebrow="Our Values"
              title={
                <>
                  What We{" "}
                  <em className="font-accent font-normal text-primary italic">
                    Stand For.
                  </em>
                </>
              }
              description="Four principles guide every consultation, every diagnosis and every follow-up at Docavia."
            />

            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {content.about.benefits.map((benefit, index) => {
                const Icon = valueIcons[index];
                return (
                  <StaggerItem key={benefit.title} className="h-full">
                    <article className="group h-full rounded-[1.75rem] border border-border bg-white p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-card">
                      <span className="flex size-13 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <h3 className="font-heading mt-6 text-lg font-bold tracking-tight text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                        {benefit.description}
                      </p>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        <div className="pt-16 md:pt-24">
          <Stats />
        </div>
        <WhyUs />
        <AppointmentCta />
      </main>
      <Footer />
    </>
  );
}
