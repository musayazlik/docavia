import type { Metadata } from "next";
import {
  ArrowUpRight,
  Bike,
  Bus,
  Car,
  MapPin,
  Phone,
  TrainFront,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { AppointmentForm } from "@/components/sections/appointment-form";
import { OpeningHours } from "@/components/sections/opening-hours";
import { Faq } from "@/components/sections/faq";
import { Reveal } from "@/components/motion/reveal";
import { getContent } from "@/lib/content/store";

const directionsHref =
  "https://www.google.com/maps/search/?api=1&query=123+Medical+Avenue+New+York+NY";

// Real Google Maps embed (no API key needed) — same Midtown pin as /contact.
const mapEmbedHref =
  "https://maps.google.com/maps?q=40.7440,-73.9860&z=15&output=embed";

const nextSteps = [
  {
    title: "We review your request",
    description: "Our care team checks your preferred specialist and slot.",
  },
  {
    title: "We confirm by phone",
    description: "You get a call or email within one working day.",
  },
  {
    title: "You visit us",
    description: "Arrive 10 minutes early with your ID and insurance card.",
  },
] as const;

const transport = [
  {
    icon: Car,
    title: "Free patient parking",
    description: "Dedicated lot behind the building, with accessible spaces.",
  },
  {
    icon: TrainFront,
    title: "Metro & rail",
    description: "A 5-minute walk from the nearest metro station.",
  },
  {
    icon: Bus,
    title: "Bus lines",
    description: "Lines M15 and M34 stop right on Medical Avenue.",
  },
  {
    icon: Bike,
    title: "Cycling",
    description: "Secure bike racks at the main entrance.",
  },
] as const;

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book your Docavia appointment online — choose your specialist, date and time, and we'll confirm within one working day. Free parking, metro access and a 24/7 emergency line.",
  alternates: { canonical: "/appointment" },
  openGraph: {
    title: "Book an Appointment — Docavia",
    description:
      "Choose your specialist, date and time — we'll confirm within one working day.",
    url: "/appointment",
    images: [{ url: "/images/og.jpg" }],
  },
};

export default async function AppointmentPage() {
  const content = await getContent();
  const site = content.site;
  const hero = content.pages.appointment;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: site.name,
    url: "https://docavia.com",
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          label={hero.label}
          eyebrow={hero.eyebrow}
          image={{
            src: "/images/cta-doctor.jpg",
            alt: "Docavia doctor ready to welcome patients",
            objectPosition: "center 25%",
          }}
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

        {/* Request form + opening hours */}
        <section
          id="appointment"
          className="scroll-mt-28 py-16 md:py-24"
          aria-label="Appointment request"
        >
          <div className="shell grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <SectionHeading
                eyebrow="Request an Appointment"
                title={
                  <>
                    Tell Us When{" "}
                    <em className="font-accent font-normal text-primary italic">
                      Suits You.
                    </em>
                  </>
                }
                description="Fill in the form below — no account needed. We'll call to confirm the exact time."
              />
              <Reveal className="mt-9" delay={0.1}>
                <AppointmentForm
                  serviceTitles={content.services.items.map((item) => item.title)}
                  doctors={content.doctors.items.map((item) => ({
                    name: item.name,
                    specialty: item.specialty,
                  }))}
                />
              </Reveal>
            </div>

            <div className="flex flex-col gap-5">
              <Reveal delay={0.15}>
                <OpeningHours items={[...content.openingHours.items]} phoneHref={content.site.phoneHref} />
              </Reveal>

              <Reveal delay={0.2}>
                <div className="rounded-[2rem] border border-border bg-white p-7 shadow-card sm:p-8">
                  <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
                    What Happens Next
                  </h2>
                  <ol className="mt-6 space-y-6">
                    {nextSteps.map((step, index) => (
                      <li key={step.title} className="flex items-start gap-4">
                        <span className="font-heading flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-heading text-[1.05rem] font-bold tracking-tight text-foreground">
                            {step.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-muted">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-7 border-t border-border/60 pt-5 text-sm leading-relaxed text-muted">
                    Prefer to talk it through? Call us at{" "}
                    <a
                      href={site.phoneHref}
                      className="font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                      {site.phone}
                    </a>{" "}
                    — we answer Mon – Fri, 08:00 – 20:00.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Getting here */}
        <section
          aria-label="Getting here"
          className="scroll-mt-28 bg-secondary/60 py-24 md:py-32"
        >
          <div className="shell grid items-stretch gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div>
              <SectionHeading
                eyebrow="Getting Here"
                title={
                  <>
                    Easy to Reach,{" "}
                    <em className="font-accent font-normal text-primary italic">
                      Easy to Park.
                    </em>
                  </>
                }
                description="We're in the heart of Midtown — whether you drive, ride or walk, getting to your appointment is the easiest part."
              />

              <Reveal className="mt-10" delay={0.1}>
                <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {transport.map(({ icon: Icon, title, description }) => (
                    <li key={title} className="flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-float">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-heading text-[1.05rem] font-bold tracking-tight text-foreground">
                          {title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-10" delay={0.15}>
                <div className="flex flex-col gap-5 rounded-[2rem] bg-pine p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-primary-light">
                      <MapPin className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-heading font-bold tracking-tight">
                        {site.address}
                      </p>
                      <p className="mt-0.5 text-sm text-white/65">
                        {site.city}
                      </p>
                    </div>
                  </div>
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-pine transition-colors duration-300 hover:bg-primary-light"
                  >
                    Get Directions
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            </div>

            {/* live Google Maps, tinted to match the theme */}
            <Reveal delay={0.2} className="h-full">
              <div className="relative h-full min-h-[24rem] overflow-hidden rounded-[2rem] border border-border shadow-card lg:min-h-[32rem]">
                <iframe
                  src={mapEmbedHref}
                  title="Map showing the Docavia clinic location in New York"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 size-full border-0 [filter:grayscale(30%)_saturate(0.85)_contrast(1.02)]"
                />
                {/* brand tint so the map sits in the palette */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-primary/10 mix-blend-multiply"
                />

                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-pine shadow-float backdrop-blur-sm transition-colors duration-200 hover:bg-white"
                >
                  Open in Google Maps
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>

                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-white/92 px-5 py-4 shadow-float backdrop-blur-md">
                  <div className="min-w-0">
                    <p className="font-heading truncate text-sm font-bold text-foreground">
                      {site.address}
                    </p>
                    <p className="text-sm text-muted">{site.city}</p>
                  </div>
                  <a
                    href={site.phoneHref}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-dark"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    Call Us
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Faq />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
