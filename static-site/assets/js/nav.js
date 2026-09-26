/* ===========================================================================
   Docavia — navigation & footer
   Both are rendered from the data files into [data-nav] / [data-footer]
   placeholders, so every page shares one source of truth.
   =========================================================================== */

window.DOCAVIA = window.DOCAVIA || {};

(function (D) {
  "use strict";

  var currentFile = function () {
    var path = window.location.pathname.split("/").pop();
    return !path || path === "" ? "index.html" : path;
  };

  function isCurrent(href) {
    return href.split("#")[0] === currentFile();
  }

  function desktopNav() {
    return (
      '<nav class="nav" aria-label="Primary">' +
      D.navLinks
        .map(function (link) {
          /* Only leaf links get aria-current — "Pages" points at about.html but
             is a dropdown, not the current page. */
          var current = !link.children && isCurrent(link.href) ? ' aria-current="page"' : "";
          if (!link.children) {
            return '<div class="nav__item"><a class="nav__link" href="' + link.href + '"' + current + ">" + D.esc(link.label) + "</a></div>";
          }
          return (
            '<div class="nav__item">' +
            '<a class="nav__link" href="' + link.href + '"' + current + ">" + D.esc(link.label) +
            D.icon("chevron-down", "icon nav__chevron") +
            "</a>" +
            '<div class="dropdown"><ul class="dropdown__panel">' +
            link.children
              .map(function (child) {
                return '<li><a class="dropdown__link" href="' + child.href + '">' + D.esc(child.label) + "</a></li>";
              })
              .join("") +
            "</ul></div></div>"
          );
        })
        .join("") +
      "</nav>"
    );
  }

  function mobileNav() {
    return (
      '<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>' +
      '<div class="mobile-menu__head">' +
      '<a href="index.html"><img class="logo logo--light" src="assets/logo-white.png" alt="Docavia" width="1946" height="476" /></a>' +
      '<button class="mobile-menu__close" type="button" data-menu-close aria-label="Close menu">' + D.icon("x", "icon") + "</button>" +
      "</div>" +
      '<nav class="mobile-menu__nav" aria-label="Mobile">' +
      D.navLinks
        .map(function (link) {
          return '<a class="mobile-menu__link" href="' + link.href + '">' + D.esc(link.label) + "</a>" +
            (link.children ? '<div class="mobile-menu__subnav">' + link.children.map(function (child) {
              return '<a href="' + child.href + '">' + D.esc(child.label) + "</a>";
            }).join("") + "</div>" : "");
        })
        .join("") +
      "</nav>" +
      '<div class="mobile-menu__foot">' +
      '<a class="mobile-menu__phone" href="' + D.site.phoneHref + '">' +
      '<span class="header-phone__badge">' + D.icon("phone", "icon--sm") + "</span>" + D.esc(D.site.phone) +
      "</a>" +
      '<a class="btn btn--light" href="appointment.html">Book Appointment ' + D.icon("arrow-right", "icon--sm") + "</a>" +
      "</div>" +
      "</div>"
    );
  }

  function header() {
    return (
      '<header class="site-header" data-header>' +
      '<div class="shell site-header__inner">' +
      '<a href="index.html" aria-label="Docavia home"><img class="logo" src="assets/logo.png" alt="Docavia" width="1946" height="476" /></a>' +
      desktopNav() +
      '<div class="header-actions">' +
      '<a class="header-phone" href="' + D.site.phoneHref + '">' +
      '<span class="header-phone__badge">' + D.icon("phone", "icon--sm") + "</span>" +
      '<span class="header-phone__number">' + D.esc(D.site.phone) + "</span>" +
      "</a>" +
      '<a class="btn btn--primary btn--sm header-cta" href="appointment.html">Book Appointment ' + D.icon("arrow-right", "icon--sm") + "</a>" +
      '<button class="burger" type="button" data-menu-open aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false">' + D.icon("menu", "icon") + "</button>" +
      "</div></div></header>" + mobileNav()
    );
  }

  function footer() {
    var columns = D.footerColumns
      .map(function (column) {
        return (
          '<div><h2 class="footer-col__title">' + D.esc(column.title) + "</h2>" +
          '<ul class="footer-col__links">' +
          column.links
            .map(function (link) { return '<li><a href="' + link.href + '">' + D.esc(link.label) + "</a></li>"; })
            .join("") +
          "</ul></div>"
        );
      })
      .join("");

    var socials = D.site.socials
      .filter(function (social) { return /^https?:\/\//i.test(social.href || ""); })
      .map(function (social) {
        return (
          '<a class="footer-social" href="' + D.esc(social.href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + D.esc(social.label) + '">' +
          D.iconFilled(social.icon === "x" ? "x-brand" : social.icon, "icon--sm") +
          "</a>"
        );
      })
      .join("");

    return (
      '<footer class="site-footer">' +
      '<div class="shell site-footer__inner">' +
      '<div class="footer-brand">' +
      '<a class="footer-brand__link" href="index.html" aria-label="' + D.esc(D.site.name) + ' home">' +
      '<img class="footer-brand__logo" src="assets/logo-mark-white.png" alt="" width="520" height="476" />' +
      '<span class="footer-brand__name">' + D.esc(D.site.name) + "</span></a>" +
      '<p class="footer-brand__text">' + D.esc(D.site.footerTagline) + "</p>" +
      (socials ? '<div class="footer-socials">' + socials + "</div>" : "") +
      "</div>" +
      columns +
      '<div><h2 class="footer-col__title">Contact</h2>' +
      '<ul class="footer-contact">' +
      '<li class="footer-contact__row"><span>' + D.icon("phone", "icon--sm") + "</span>" +
      '<a href="' + D.site.phoneHref + '">' + D.esc(D.site.phone) + "</a></li>" +
      '<li class="footer-contact__row"><span>' + D.icon("mail", "icon--sm") + "</span>" +
      '<a href="' + D.site.emailHref + '">' + D.esc(D.site.email) + "</a></li>" +
      '<li class="footer-contact__row"><span>' + D.icon("map-pin", "icon--sm") + "</span>" +
      "<span>" + D.esc(D.site.address) + "<br>" + D.esc(D.site.city) + "</span></li>" +
      "</ul></div></div>" +
      '<div class="shell site-footer__bottom">' +
      "<span>" + D.esc(D.site.copyright) + "</span>" +
      '<div class="footer-legal">' +
      D.footerLegal.map(function (link) { return '<a href="' + link.href + '">' + D.esc(link.label) + "</a>"; }).join("") +
      "</div></div></footer>"
    );
  }

  function mount() {
    var navSlot = D.$("[data-nav]");
    if (navSlot) navSlot.outerHTML = header();

    var footerSlot = D.$("[data-footer]");
    if (footerSlot) footerSlot.outerHTML = footer();

    var headerEl = D.$("[data-header]");
    if (headerEl) {
      var onScroll = function () {
        headerEl.classList.toggle("is-scrolled", window.scrollY > 24);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    var openBtn = D.$("[data-menu-open]");
    var menu = D.$("#mobile-menu");
    if (!openBtn || !menu) return;

    function setOpen(open) {
      menu.hidden = !open;
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("is-locked", open);
    }

    D.on(openBtn, "click", function () { setOpen(true); });
    D.on(D.$("[data-menu-close]", menu), "click", function () { setOpen(false); });
    D.on(document, "keydown", function (event) {
      if (event.key === "Escape" && !menu.hidden) setOpen(false);
    });
    D.$$("a", menu).forEach(function (link) {
      D.on(link, "click", function () { setOpen(false); });
    });
  }

  D.nav = { mount: mount };
})(window.DOCAVIA);
