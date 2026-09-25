import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { LegalArticle } from "@/components/ui/legal-article";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Docavia collects, uses and protects your personal and medical data — cookies, your rights and how to contact our privacy team.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — Docavia",
    description:
      "How Docavia collects, uses and protects your personal and medical data.",
    url: "/privacy-policy",
    images: [{ url: "/images/og.jpg" }],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          label="Privacy Policy"
          eyebrow="Legal"
          title={
            <>
              Your Privacy,{" "}
              <em className="font-accent font-normal text-primary italic">
                Protected.
              </em>
            </>
          }
          description="Plain-language answers about what we collect, why we collect it and the control you keep over your data."
        />

        <LegalArticle
          updated="September 26, 2026"
          intro="Docavia is a modern medical clinic, and trust is at the center of everything we do. This policy explains how we handle personal information gathered through this website — including appointment requests, contact forms and blog comments. It applies to docavia.com and does not cover information collected during in-clinic treatment, which is governed by our patient privacy notices."
          sections={[
            {
              id: "overview",
              title: "Overview",
              body: (
                <>
                  <p>
                    We keep the data we collect to a minimum: only what is
                    needed to answer your questions, arrange your appointments
                    and improve the website. We never sell your data, and we
                    never use it for advertising profiles.
                  </p>
                  <p>
                    By using this website you agree to the practices described
                    below. If you disagree with any part of it, please contact
                    us before submitting any personal information.
                  </p>
                </>
              ),
            },
            {
              id: "information-we-collect",
              title: "Information We Collect",
              body: (
                <>
                  <p>
                    The only personal data we hold is what you choose to share
                    with us:
                  </p>
                  <ul>
                    <li>
                      <strong>Appointment requests</strong> — your name, phone
                      number, email, preferred department, doctor, date and
                      time, and any notes you include.
                    </li>
                    <li>
                      <strong>Contact messages</strong> — your name, email,
                      optional phone number and your message.
                    </li>
                    <li>
                      <strong>Blog comments</strong> — the name and comment you
                      post on an article.
                    </li>
                  </ul>
                  <p>
                    Please do not include sensitive medical details in forms or
                    comments on this site; share clinical information during
                    your consultation instead.
                  </p>
                </>
              ),
            },
            {
              id: "how-we-use-it",
              title: "How We Use Your Information",
              body: (
                <ul>
                  <li>To schedule and confirm your appointments.</li>
                  <li>To answer your questions and provide support.</li>
                  <li>
                    To send service-related communications — for example a
                    confirmation call or a reply to your message. We only send
                    marketing emails if you explicitly subscribed.
                  </li>
                  <li>
                    To keep the website secure, understand which articles are
                    helpful and fix problems.
                  </li>
                </ul>
              ),
            },
            {
              id: "cookies",
              title: "Cookies & Analytics",
              body: (
                <>
                  <p>
                    This website uses a small number of cookies and similar
                    technologies:
                  </p>
                  <ul>
                    <li>
                      <strong>Essential cookies</strong> — required for the
                      site to work, such as keeping the booking form
                      functioning. These cannot be switched off.
                    </li>
                    <li>
                      <strong>Analytics cookies</strong> — anonymous statistics
                      that show us which pages are visited, so we can improve
                      them. No personal profiles are built.
                    </li>
                  </ul>
                  <p>
                    You can block or delete cookies at any time in your browser
                    settings; the site will keep working, though some
                    convenience features may be limited.
                  </p>
                </>
              ),
            },
            {
              id: "sharing",
              title: "Sharing Your Information",
              body: (
                <>
                  <p>
                    Your information stays inside {site.name} except where a
                    trusted provider helps us run the website (for example
                    hosting or email delivery), in which case they process data
                    strictly on our instructions.
                  </p>
                  <p>
                    We may also disclose information where required by law or
                    to protect someone&apos;s vital interests — for example a
                    medical emergency reported through our 24/7 line.
                  </p>
                </>
              ),
            },
            {
              id: "retention-security",
              title: "Data Retention & Security",
              body: (
                <>
                  <p>
                    We keep appointment and contact records only as long as
                    needed to serve you and meet our legal obligations, then
                    delete them. Access is limited to the care team members who
                    need it.
                  </p>
                  <p>
                    The site is served over HTTPS, and access to our systems is
                    protected by modern security controls. No method of
                    transmission is 100% secure, but we work hard to stay close
                    to it.
                  </p>
                </>
              ),
            },
            {
              id: "your-rights",
              title: "Your Rights",
              body: (
                <>
                  <p>
                    Depending on where you live, you have the right to access,
                    correct, export or delete the personal data we hold about
                    you, and to object to or restrict certain processing.
                  </p>
                  <p>
                    To exercise any of these rights, email{" "}
                    <a href={site.emailHref}>{site.email}</a> — we respond to
                    every privacy request within 30 days.
                  </p>
                </>
              ),
            },
            {
              id: "childrens-privacy",
              title: "Children's Privacy",
              body: (
                <p>
                  This website is not directed at children under 13, and we do
                  not knowingly collect their data online. Appointments for
                  minors are arranged by a parent or guardian. If you believe a
                  child has submitted information to us, contact us and we will
                  delete it promptly.
                </p>
              ),
            },
            {
              id: "changes",
              title: "Changes to This Policy",
              body: (
                <p>
                  If we update this policy, the revised version will be posted
                  on this page with a new &quot;last updated&quot; date.
                  Significant changes will be highlighted on the homepage for a
                  reasonable period.
                </p>
              ),
            },
            {
              id: "contact",
              title: "Contact Us",
              body: (
                <p>
                  Questions about this policy or your data? Email{" "}
                  <a href={site.emailHref}>{site.email}</a>, call{" "}
                  {site.phone}, or write to us at {site.address},{" "}
                  {site.city}. Our privacy team reads every message.
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
