/* Site identity, shared by the section renderers, the forms and the legal copy.
   Navigation and footer links are plain markup in each HTML file. */

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
      "Modern, patient-centered healthcare — expert specialists, effortless appointments and care built around you."
  };

  /* Static assets are bundled so static-site/ can be served on its own. */
  D.asset = function (path) {
    return "assets" + path;
  };
})(window.DOCAVIA);
