/* Legal page copy. Bodies are arrays of blocks so the same renderer can build
   the sticky table of contents and the article body from one source.
   Inline markup: **bold** and [label](href). */

window.DOCAVIA = window.DOCAVIA || {};

(function (D) {
  D.legal = {
    privacy: {
      label: "Privacy Policy",
      eyebrow: "Legal",
      title: "Your Privacy,",
      titleAccent: "Protected.",
      description:
        "Plain-language answers about what we collect, why we collect it and the control you keep over your data.",
      updated: "September 26, 2026",
      intro:
        "Docavia is a modern medical clinic, and trust is at the center of everything we do. This policy explains how we handle personal information gathered through this website — including appointment requests, contact forms and blog comments. It applies to docavia.com and does not cover information collected during in-clinic treatment, which is governed by our patient privacy notices.",
      sections: [
        {
          id: "overview",
          title: "Overview",
          body: [
            { type: "p", text: "We keep the data we collect to a minimum: only what is needed to answer your questions, arrange your appointments and improve the website. We never sell your data, and we never use it for advertising profiles." },
            { type: "p", text: "By using this website you agree to the practices described below. If you disagree with any part of it, please contact us before submitting any personal information." }
          ]
        },
        {
          id: "information-we-collect",
          title: "Information We Collect",
          body: [
            { type: "p", text: "The only personal data we hold is what you choose to share with us:" },
            { type: "ul", items: [
              "**Appointment requests** — your name, phone number, email, preferred department, doctor, date and time, and any notes you include.",
              "**Contact messages** — your name, email, optional phone number and your message.",
              "**Blog comments** — the name and comment you post on an article."
            ] },
            { type: "p", text: "Please do not include sensitive medical details in forms or comments on this site; share clinical information during your consultation instead." }
          ]
        },
        {
          id: "how-we-use-it",
          title: "How We Use Your Information",
          body: [
            { type: "ul", items: [
              "To schedule and confirm your appointments.",
              "To answer your questions and provide support.",
              "To send service-related communications — for example a confirmation call or a reply to your message. We only send marketing emails if you explicitly subscribed.",
              "To keep the website secure, understand which articles are helpful and fix problems."
            ] }
          ]
        },
        {
          id: "cookies",
          title: "Cookies & Analytics",
          body: [
            { type: "p", text: "This website uses a small number of cookies and similar technologies:" },
            { type: "ul", items: [
              "**Essential cookies** — required for the site to work, such as keeping the booking form functioning. These cannot be switched off.",
              "**Analytics cookies** — anonymous statistics that show us which pages are visited, so we can improve them. No personal profiles are built."
            ] },
            { type: "p", text: "You can block or delete cookies at any time in your browser settings; the site will keep working, though some convenience features may be limited." }
          ]
        },
        {
          id: "sharing",
          title: "Sharing Your Information",
          body: [
            { type: "p", text: "Your information stays inside Docavia except where a trusted provider helps us run the website (for example hosting or email delivery), in which case they process data strictly on our instructions." },
            { type: "p", text: "We may also disclose information where required by law or to protect someone's vital interests — for example a medical emergency reported through our 24/7 line." }
          ]
        },
        {
          id: "retention-security",
          title: "Data Retention & Security",
          body: [
            { type: "p", text: "We keep appointment and contact records only as long as needed to serve you and meet our legal obligations, then delete them. Access is limited to the care team members who need it." },
            { type: "p", text: "The site is served over HTTPS, and access to our systems is protected by modern security controls. No method of transmission is 100% secure, but we work hard to stay close to it." }
          ]
        },
        {
          id: "your-rights",
          title: "Your Rights",
          body: [
            { type: "p", text: "Depending on where you live, you have the right to access, correct, export or delete the personal data we hold about you, and to object to or restrict certain processing." },
            { type: "p", text: "To exercise any of these rights, email [hello@docavia.com](mailto:hello@docavia.com) — we respond to every privacy request within 30 days." }
          ]
        },
        {
          id: "childrens-privacy",
          title: "Children's Privacy",
          body: [
            { type: "p", text: "This website is not directed at children under 13, and we do not knowingly collect their data online. Appointments for minors are arranged by a parent or guardian. If you believe a child has submitted information to us, contact us and we will delete it promptly." }
          ]
        },
        {
          id: "changes",
          title: "Changes to This Policy",
          body: [
            { type: "p", text: "If we update this policy, the revised version will be posted on this page with a new \"last updated\" date. Significant changes will be highlighted on the homepage for a reasonable period." }
          ]
        },
        {
          id: "contact",
          title: "Contact Us",
          body: [
            { type: "p", text: "Questions about this policy or your data? Email [hello@docavia.com](mailto:hello@docavia.com), call +1 234 567 890, or write to us at 123 Medical Avenue, New York, NY. Our privacy team reads every message." }
          ]
        }
      ]
    },

    terms: {
      label: "Terms of Service",
      eyebrow: "Legal",
      title: "Clear Terms,",
      titleAccent: "No Surprises.",
      description:
        "What you can expect from this website, what we expect from you, and where our responsibility begins and ends.",
      updated: "September 26, 2026",
      intro:
        "These terms govern your use of docavia.com, operated by Docavia. By browsing the site, requesting an appointment or posting a comment, you accept these terms. If you do not accept them, please do not use the website.",
      sections: [
        {
          id: "acceptance",
          title: "Acceptance of Terms",
          body: [
            { type: "p", text: "We may update these terms from time to time. The version published on this page applies at the moment you use the site, so please review it occasionally. Continued use after a change means you accept the revised terms." }
          ]
        },
        {
          id: "medical-disclaimer",
          title: "Medical Disclaimer",
          body: [
            { type: "p", text: "**Content on this website is for general information only and is not medical advice.** Articles, service descriptions and FAQs cannot replace a personal consultation with a qualified doctor." },
            { type: "p", text: "Never delay seeking medical care because of something you read on this site. If you are experiencing a medical emergency, call your local emergency number or our 24/7 line at +1 234 567 890 immediately." }
          ]
        },
        {
          id: "appointments",
          title: "Appointments & Cancellations",
          body: [
            { type: "p", text: "Submitting the appointment form is a **request**, not a confirmed booking. A visit is only confirmed once our care team contacts you by phone or email, usually within one working day." },
            { type: "ul", items: [
              "Please arrive 10 minutes early and bring your ID and insurance card.",
              "Need to reschedule? Let us know at least 24 hours in advance so we can offer the slot to another patient.",
              "We will always confirm changes with you before they take effect."
            ] }
          ]
        },
        {
          id: "acceptable-use",
          title: "Acceptable Use & Comments",
          body: [
            { type: "p", text: "You agree to use the website lawfully and not to attempt to disrupt it, access data that isn't yours, or use it to distribute spam or harmful content." },
            { type: "p", text: "Comments on our blog are moderated. We may remove comments that contain medical misinformation, personal data, offensive language or advertising, without prior notice." }
          ]
        },
        {
          id: "intellectual-property",
          title: "Intellectual Property",
          body: [
            { type: "p", text: "All content on this website — text, imagery, logos and design — belongs to Docavia or its licensors and may not be reproduced without written permission. Short quotes with a link back to the source are welcome." }
          ]
        },
        {
          id: "liability",
          title: "Limitation of Liability",
          body: [
            { type: "p", text: "We work hard to keep the site accurate, available and secure, but it is provided \"as is\". To the extent permitted by law, Docavia is not liable for indirect or consequential losses arising from use of the website, or from decisions made based on its general content rather than a personal medical consultation." }
          ]
        },
        {
          id: "third-party-links",
          title: "Third-Party Links",
          body: [
            { type: "p", text: "The site includes embedded content such as maps and links to external resources. We do not control third-party sites and are not responsible for their content or privacy practices — please read their own terms before using them." }
          ]
        },
        {
          id: "governing-law",
          title: "Governing Law",
          body: [
            { type: "p", text: "These terms are governed by the laws of the State of New York, without regard to conflict-of-law rules. Any dispute will be resolved in the courts of that jurisdiction." }
          ]
        },
        {
          id: "contact",
          title: "Contact Us",
          body: [
            { type: "p", text: "Questions about these terms? Email [hello@docavia.com](mailto:hello@docavia.com) or call +1 234 567 890 — our team is happy to clarify anything before your visit." }
          ]
        }
      ]
    }
  };
})(window.DOCAVIA);
