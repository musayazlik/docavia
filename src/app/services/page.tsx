import type { Metadata } from "next";
import {
  MonitorSmartphone,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Faq } from "@/components/sections/faq";
import { AppointmentCta } from "@/components/sections/appointment-cta";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const assurances = [
  {
    icon: ShieldCheck,
    title: "Insurance Accepted",
    description:
      "We work with all major providers and verify your coverage before the visit — no surprises.",
  },
  {
    icon: ReceiptText,
    title: "Transparent Pricing",
    description:
      "Clear written quotes before every treatment, and an itemized bill you can actually read.",
  },
  {
    icon: MonitorSmartphone,
    title: "Records Online",
    description:
      "Your history, test results and prescriptions live in one secure portal — available anytime.",
  },
];

import { getContent } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Docavia's medical services — general medicine, cardiology, dental care, pediatrics, neurology and physiotherapy under one calm roof.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Docavia",
    description: "Explore Docavia's medical services — general medicine, cardiology, dental care, pediatrics, neurology and physiotherapy under one calm roof.",
    url: "/services",
    images: [{ url: "/images/og.jpg" }],
  },
};

export default async function ServicesPage() {
  const content = await getContent();
  const hero = content.pages.services;

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          label={hero.label}
          eyebrow={hero.eyebrow}
          image={{
            src: "/images/blog-checkup.jpg",
            alt: "Doctor checking a patient's blood pressure",
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

        <Services onServicesPage />

        {/* Assurances */}
        <section aria-label="Patient assurances" className="py-20 md:py-24">
          <div className="shell">
            <Stagger className="grid gap-5 md:grid-cols-3">
              {assurances.map((item) => (
                <StaggerItem key={item.title} className="h-full">
                  <div className="flex h-full gap-5 rounded-[1.75rem] border border-border bg-white p-7">
                    <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <item.icon className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <HowItWorks />

        {/* Referral note */}
        <section>
          <div className="shell">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-pine px-8 py-10 text-white sm:px-12 md:py-12">
                <div
                  aria-hidden="true"
                  className="bg-dots-light absolute top-6 right-8 hidden size-28 opacity-50 md:block"
                />
                <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <h2 className="font-heading text-[1.5rem] leading-snug font-bold tracking-tight text-balance sm:text-[1.75rem]">
                      Not sure which service{" "}
                      <em className="font-accent font-normal text-primary-light italic">
                        fits your need?
                      </em>
                    </h2>
                    <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-white/65">
                      Start with General Medicine — our practitioners will
                      listen first and refer you to the right specialist
                      without extra visits.
                    </p>
                  </div>
                  <a
                    href="/appointment#appointment"
                    className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-[0.9375rem] font-semibold text-pine transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-light"
                  >
                    Book a Consultation
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Faq />
        <AppointmentCta />
      </main>
      <Footer />
    </>
  );
}
