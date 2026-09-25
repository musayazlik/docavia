import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { LegalArticle } from "@/components/ui/legal-article";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of docavia.com — appointment requests, medical disclaimer, acceptable use and liability.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Terms of Service — Docavia",
    description:
      "The terms that govern your use of docavia.com — appointments, disclaimers and liability.",
    url: "/terms-of-service",
    images: [{ url: "/images/og.jpg" }],
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          label="Terms of Service"
          eyebrow="Legal"
          title={
            <>
              Clear Terms,{" "}
              <em className="font-accent font-normal text-primary italic">
                No Surprises.
              </em>
            </>
          }
          description="What you can expect from this website, what we expect from you, and where our responsibility begins and ends."
        />

        <LegalArticle
          updated="September 26, 2026"
          intro="These terms govern your use of docavia.com, operated by Docavia. By browsing the site, requesting an appointment or posting a comment, you accept these terms. If you do not accept them, please do not use the website."
          sections={[
            {
              id: "acceptance",
              title: "Acceptance of Terms",
              body: (
                <p>
                  We may update these terms from time to time. The version
                  published on this page applies at the moment you use the
                  site, so please review it occasionally. Continued use after a
                  change means you accept the revised terms.
                </p>
              ),
            },
            {
              id: "medical-disclaimer",
              title: "Medical Disclaimer",
              body: (
                <>
                  <p>
                    <strong>
                      Content on this website is for general information only
                      and is not medical advice.
                    </strong>{" "}
                    Articles, service descriptions and FAQs cannot replace a
                    personal consultation with a qualified doctor.
                  </p>
                  <p>
                    Never delay seeking medical care because of something you
                    read on this site. If you are experiencing a medical
                    emergency, call your local emergency number or our 24/7
                    line at {site.phone} immediately.
                  </p>
                </>
              ),
            },
            {
              id: "appointments",
              title: "Appointments & Cancellations",
              body: (
                <>
                  <p>
                    Submitting the appointment form is a{" "}
                    <strong>request</strong>, not a confirmed booking. A visit
                    is only confirmed once our care team contacts you by phone
                    or email, usually within one working day.
                  </p>
                  <ul>
                    <li>
                      Please arrive 10 minutes early and bring your ID and
                      insurance card.
                    </li>
                    <li>
                      Need to reschedule? Let us know at least 24 hours in
                      advance so we can offer the slot to another patient.
                    </li>
                    <li>
                      We will always confirm changes with you before they take
                      effect.
                    </li>
                  </ul>
                </>
              ),
            },
            {
              id: "acceptable-use",
              title: "Acceptable Use & Comments",
              body: (
                <>
                  <p>
                    You agree to use the website lawfully and not to attempt to
                    disrupt it, access data that isn&apos;t yours, or use it to
                    distribute spam or harmful content.
                  </p>
                  <p>
                    Comments on our blog are moderated. We may remove comments
                    that contain medical misinformation, personal data,
                    offensive language or advertising, without prior notice.
                  </p>
                </>
              ),
            },
            {
              id: "intellectual-property",
              title: "Intellectual Property",
              body: (
                <p>
                  All content on this website — text, imagery, logos and design
                  — belongs to {site.name} or its licensors and may not be
                  reproduced without written permission. Short quotes with a
                  link back to the source are welcome.
                </p>
              ),
            },
            {
              id: "liability",
              title: "Limitation of Liability",
              body: (
                <p>
                  We work hard to keep the site accurate, available and secure,
                  but it is provided &quot;as is&quot;. To the extent permitted
                  by law, {site.name} is not liable for indirect or
                  consequential losses arising from use of the website, or from
                  decisions made based on its general content rather than a
                  personal medical consultation.
                </p>
              ),
            },
            {
              id: "third-party-links",
              title: "Third-Party Links",
              body: (
                <p>
                  The site includes embedded content such as maps and links to
                  external resources. We do not control third-party sites and
                  are not responsible for their content or privacy practices —
                  please read their own terms before using them.
                </p>
              ),
            },
            {
              id: "governing-law",
              title: "Governing Law",
              body: (
                <p>
                  These terms are governed by the laws of the State of New
                  York, without regard to conflict-of-law rules. Any dispute
                  will be resolved in the courts of that jurisdiction.
                </p>
              ),
            },
            {
              id: "contact",
              title: "Contact Us",
              body: (
                <p>
                  Questions about these terms? Email{" "}
                  <a href={site.emailHref}>{site.email}</a> or call{" "}
                  {site.phone} — our team is happy to clarify anything before
                  your visit.
                </p>
              ),
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
