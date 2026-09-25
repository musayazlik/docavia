import type { Metadata } from "next";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Siren,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/sections/contact-form";
import { Faq } from "@/components/sections/faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { site } from "@/lib/constants";

type ContactCard = {
  icon: LucideIcon;
  title: string;
  line1: string;
  line2: string;
  href?: string;
  linkLabel?: string;
  external?: boolean;
};

const directionsHref =
  "https://www.google.com/maps/search/?api=1&query=123+Medical+Avenue+New+York+NY";

// Real Google Maps embed (no API key needed) — pinned to the clinic's
// Midtown coordinates so the frame always renders a sensible map.
const mapEmbedHref =
  "https://maps.google.com/maps?q=40.7440,-73.9860&z=15&output=embed";

const contactCards: ContactCard[] = [
  {
    icon: Phone,
    title: "Call Us",
    line1: site.phone,
    line2: "Mon – Fri, 08:00 – 20:00",
    href: site.phoneHref,
    linkLabel: "Call now",
  },
  {
    icon: Mail,
    title: "Email Us",
    line1: site.email,
    line2: "Replies within one working day",
    href: site.emailHref,
    linkLabel: "Write an email",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    line1: site.address,
    line2: site.city,
    href: directionsHref,
    linkLabel: "Get directions",
    external: true,
  },
  {
    icon: Clock,
    title: "Opening Hours",
    line1: "Mon – Fri · 08:00 – 20:00",
    line2: "Saturday · 09:00 – 14:00",
  },
];

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Docavia — call, email or visit our clinic in New York. Book an appointment or ask our care team anything.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Docavia",
    description: "Contact Docavia — call, email or visit our clinic in New York. Book an appointment or ask our care team anything.",
    url: "/contact",
    images: [{ url: "/images/og.jpg" }],
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          label="Contact"
          eyebrow="Contact Us"
          title={
            <>
              We&apos;re Here{" "}
              <em className="font-accent font-normal text-primary italic">
                When You Need Us.
              </em>
            </>
          }
          description="Questions about a service, your visit or an appointment? Reach out — a real person from our care team will answer."
        />

        {/* Contact channels */}
        <section aria-label="Contact channels" className="py-16 md:py-24">
          <div className="shell">
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {contactCards.map((card) => (
                <StaggerItem key={card.title} className="h-full">
                  <div className="flex h-full flex-col rounded-[1.75rem] border border-border bg-white p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-card">
                    <span className="flex size-13 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <card.icon className="size-6" aria-hidden="true" />
                    </span>
                    <h2 className="font-heading mt-6 text-lg font-bold tracking-tight text-foreground">
                      {card.title}
                    </h2>
                    <p className="mt-2 text-[0.9375rem] font-medium text-foreground/85">
                      {card.line1}
                    </p>
                    <p className="mt-1 text-sm text-muted">{card.line2}</p>
                    {card.href && (
                      <a
                        href={card.href}
                        {...(card.external
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                        className="mt-auto inline-flex pt-5 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
                      >
                        {card.linkLabel}
                      </a>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Form + map */}
        <section
          id="appointment"
          className="scroll-mt-28 bg-secondary/60 py-24 md:py-32"
        >
          <div className="shell grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <SectionHeading
                eyebrow="Send a Message"
                title={
                  <>
                    How Can We{" "}
                    <em className="font-accent font-normal text-primary italic">
                      Help?
                    </em>
                  </>
                }
                description="Fill in the form and our care team will match you with the right specialist — usually within one working day."
              />
              <Reveal className="mt-9" delay={0.1}>
                <ContactForm />
              </Reveal>
            </div>

            <div className="flex flex-col gap-5">
              {/* live Google Maps, tinted to match the theme */}
              <Reveal delay={0.15}>
                <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] border border-border shadow-card">
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
                    <div>
                      <p className="font-heading text-sm font-bold text-foreground">
                        {site.address}
                      </p>
                      <p className="text-sm text-muted">{site.city}</p>
                    </div>
                    <a
                      href={directionsHref}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-dark"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* emergency line */}
              <Reveal delay={0.25}>
                <div className="relative overflow-hidden rounded-[2rem] bg-pine p-7 text-white sm:p-8">
                  <div
                    aria-hidden="true"
                    className="bg-dots-light absolute top-5 right-6 hidden size-24 opacity-50 sm:block"
                  />
                  <div className="relative flex items-start gap-5">
                    <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-primary-light">
                      <Siren className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-heading text-lg font-bold tracking-tight">
                        24/7 Emergency Line
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                        For urgent medical concerns outside opening hours, our
                        on-call team is awake around the clock.
                      </p>
                      <a
                        href={site.phoneHref}
                        className="font-heading mt-4 inline-block text-2xl font-bold tracking-tight text-primary-light transition-colors duration-200 hover:text-white"
                      >
                        {site.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Faq />
      </main>
      <Footer />
    </>
  );
}
