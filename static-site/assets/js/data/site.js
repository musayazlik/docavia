/* Site identity, navigation and footer links.
   Hrefs are rewritten from the Next.js route shape to the static .html map:
   "/" -> index.html, "/about" -> about.html, "/about#x" -> about.html#x */

window.DOCAVIA = window.DOCAVIA || {};

(function (D) {
  D.site = {
    name: "Docavia",
    tagline: "Modern Healthcare",
    phone: "+1 234 567 890",
    phoneHref: "tel:+1234567890",
    email: "hello@docavia.com",
    emailHref: "mailto:hello@docavia.com",
    supportEmail: "support@docavia.com",
    address: "123 Medical Avenue",
    city: "New York, NY",
    copyright: "© 2026 Docavia. All rights reserved.",
    footerTagline:
      "Modern, patient-centered healthcare — expert specialists, effortless appointments and care built around you.",
    socials: [
      { icon: "facebook", label: "Facebook", href: "#" },
      { icon: "instagram", label: "Instagram", href: "#" },
      { icon: "x", label: "X", href: "#" },
      { icon: "linkedin", label: "LinkedIn", href: "#" }
    ]
  };

  D.navLinks = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Services", href: "services.html" },
    { label: "Doctors", href: "doctors.html" },
    {
      label: "Pages",
      href: "about.html",
      children: [
        { label: "Book an Appointment", href: "appointment.html" },
        { label: "Why Docavia", href: "index.html#why-us" },
        { label: "How It Works", href: "services.html#how-it-works" },
        { label: "Testimonials", href: "doctors.html#testimonials" },
        { label: "FAQ", href: "contact.html#faq" }
      ]
    },
    { label: "Blog", href: "blog.html" },
    { label: "Contact", href: "contact.html" }
  ];

  D.footerColumns = [
    {
      title: "Company",
      links: [
        { label: "About", href: "about.html" },
        { label: "Doctors", href: "doctors.html" },
        { label: "Services", href: "services.html" },
        { label: "Appointment", href: "appointment.html" },
        { label: "Blog", href: "blog.html" },
        { label: "Contact", href: "contact.html" }
      ]
    },
    {
      title: "Services",
      links: [
        { label: "Cardiology", href: "services.html" },
        { label: "General Medicine", href: "services.html" },
        { label: "Dental Care", href: "services.html" },
        { label: "Pediatrics", href: "services.html" },
        { label: "Neurology", href: "services.html" }
      ]
    }
  ];

  D.footerLegal = [
    { label: "Privacy Policy", href: "privacy-policy.html" },
    { label: "Terms", href: "terms-of-service.html" },
    { label: "Cookies", href: "privacy-policy.html#cookies" }
  ];

  /* Static assets are bundled so static-site/ can be served on its own. */
  D.asset = function (path) {
    return "assets" + path;
  };
})(window.DOCAVIA);
