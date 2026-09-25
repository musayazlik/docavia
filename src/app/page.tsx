import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { InfoBar } from "@/components/sections/info-bar";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { WhyUs } from "@/components/sections/why-us";
import { Stats } from "@/components/sections/stats";
import { Doctors } from "@/components/sections/doctors";
import { AppointmentCta } from "@/components/sections/appointment-cta";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { Articles } from "@/components/sections/articles";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { getContent } from "@/lib/content/store";

export default async function Home() {
  const site = (await getContent()).site;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://docavia.com/#website",
        url: "https://docavia.com",
        name: site.name,
        description:
          "Modern, patient-centered healthcare with expert specialists and effortless appointment booking.",
      },
      {
        "@type": "MedicalClinic",
        "@id": "https://docavia.com/#clinic",
        name: site.name,
        url: "https://docavia.com",
        description:
          "Modern, patient-centered healthcare with expert specialists and effortless appointment booking.",
        telephone: site.phone,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address,
          addressLocality: site.city,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "20:00",
        },
        medicalSpecialty: [
          "Cardiovascular",
          "Neurologic",
          "Pediatric",
          "Dentistry",
          "PhysicalTherapy",
        ],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <InfoBar />
        <About />
        <Services />
        <WhyUs />
        <Stats />
        <Doctors />
        <AppointmentCta />
        <HowItWorks />
        <Testimonials />
        <Articles />
        <Faq />
        <FinalCta />
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
