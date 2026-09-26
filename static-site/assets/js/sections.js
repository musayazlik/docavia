/* ===========================================================================
   Docavia — sections
   Declarative bindings: [data-bind="path.to.value"] fills textContent from the
   data files, [data-render="name"] renders a shared list or block.
   =========================================================================== */

window.DOCAVIA = window.DOCAVIA || {};

(function (D) {
  "use strict";

  var c = function () { return D.content; };
  var inline = function () { return D.inline; };

  var ICON_FALLBACKS = {
    infoBar: ["heart-pulse", "stethoscope", "calendar-check"],
    benefits: ["users", "shield-check", "brain", "calendar-check"],
    services: ["stethoscope", "heart-pulse", "smile", "baby", "brain", "dumbbell"]
  };

  function iconFor(kind, item, index) {
    return (item && item.icon) || ICON_FALLBACKS[kind][index % ICON_FALLBACKS[kind].length];
  }

  function stars(count) {
    var out = "";
    for (var i = 0; i < count; i++) out += D.iconFilled("star", "icon--sm");
    return '<span class="hero__stars">' + out + "</span>";
  }

  function btn(href, label, variant, cls) {
    var v = " btn--" + (variant || "primary");
    return (
      '<a class="btn' + v + (cls ? " " + cls : "") + '" href="' + href + '">' +
      D.esc(label) + D.icon("arrow-right", "icon--sm") + "</a>"
    );
  }

  function arrowLink(href, label) {
    return (
      '<a class="link-arrow" href="' + href + '">' + D.esc(label) +
      D.icon("arrow-right", "icon--sm") + "</a>"
    );
  }

  function avatar(src, name, cls) {
    var base = "avatar" + (cls ? " avatar--" + cls : "");
    if (src) {
      return '<img class="' + base + '" src="' + src + '" alt="' + D.esc(name) + '" loading="lazy" width="48" height="48" />';
    }
    var initial = (name || "?").trim().charAt(0).toUpperCase();
    return '<span class="' + base + ' avatar--initials" aria-hidden="true">' + initial + "</span>";
  }

  function sectionHeading(group, opts) {
    opts = opts || {};
    return (
      '<div class="section-heading' + (opts.center ? " section-heading--center" : "") +
      (opts.inverted ? " section-heading--inverted" : "") + '">' +
      (group.eyebrow ? '<p class="eyebrow' + (opts.inverted ? " eyebrow--inverted" : "") + '">' + D.esc(group.eyebrow) + "</p>" : "") +
      '<h2 class="heading">' + D.esc(group.title) + ' <em class="accent' + (opts.inverted ? " accent--inverted" : "") + '">' +
      D.esc(group.titleAccent) + "</em></h2>" +
      (group.description ? '<p class="lede">' + D.esc(group.description) + "</p>" : "") +
      "</div>"
    );
  }

  /* ----------------------------- Data binding ----------------------------- */

  D.bind = function (root) {
    D.$$("[data-bind]", root || document).forEach(function (node) {
      var value = D.get(node.getAttribute("data-bind"));
      if (value === undefined || value === null) return;
      if (node.getAttribute("data-bind-attr")) {
        node.setAttribute(node.getAttribute("data-bind-attr"), value);
      } else {
        node.textContent = value;
      }
    });
  };

  /* ------------------------------- Renderers ------------------------------ */

  var R = {};

  R.infoBar = function (slot) {
    var items = c().infoBar.items;
    slot.innerHTML =
      '<ul class="info-bar__list">' +
      items
        .map(function (item, i) {
          return (
            '<li class="info-bar__item">' +
            D.well(iconFor("infoBar", item, i), null, "lg") +
            "<div><p class=\"info-bar__title\">" + D.esc(item.title) + "</p>" +
            item.lines
              .map(function (line) { return '<span class="info-bar__line">' + D.esc(line) + "</span>"; })
              .join("") +
            (item.actionLabel
              ? '<p class="mt-2">' + arrowLink(item.actionHref, item.actionLabel) + "</p>"
              : "") +
            "</div></li>"
          );
        })
        .join("") +
      "</ul>";
  };

  R.heroProof = function (slot) {
    var h = c().hero;
    var avatars = [h.patientAvatar1, h.patientAvatar2, h.patientAvatar3]
      .filter(function (src) { return typeof src === "string" && src.trim(); });
    slot.innerHTML =
      (avatars.length ? '<div class="hero__avatars" aria-hidden="true">' +
        avatars.map(function (src) {
          return '<img src="' + D.esc(src) + '" alt="" width="44" height="44" />';
        }).join("") + "</div>" : "") +
      '<div><div class="flex gap-2 items-center">' + stars(5) +
      '<span class="hero__rating">' + D.esc(h.ratingValue) + "</span></div>" +
      '<p class="text-sm muted mt-1">' + D.esc(h.ratingLabel) + "</p></div>";
  };

  R.heroVisual = function (slot) {
    var hv = inline().heroVisual;
    slot.innerHTML =
      '<div class="hero-visual__deco" aria-hidden="true"></div>' +
      '<div class="hero-visual__dots bg-dots masked" aria-hidden="true"></div>' +
      '<img class="hero-visual__img" src="' + c().hero.image + '" alt="Docavia clinician in the clinic" width="500" height="583" fetchpriority="high" decoding="async" />' +
      '<div class="hero-visual__card hero-visual__card--tl floating-card float-y">' +
      D.well("users") +
      "<div><p class=\"hero-visual__value\">" + D.esc(hv.card1.value) + "</p>" +
      '<p class="hero-visual__label">' + D.esc(hv.card1.label) + "</p></div></div>" +
      '<div class="hero-visual__card hero-visual__card--br floating-card float-y">' +
      D.well("heart-pulse") +
      "<div><p class=\"hero-visual__value\">" + D.esc(hv.card2.value) + "</p>" +
      '<p class="hero-visual__label">' + D.esc(hv.card2.label) + "</p></div></div>" +
      '<div class="hero-visual__pill">' +
      '<span class="header-phone__badge">' + D.icon("calendar-clock", "icon--sm") + "</span>" +
      D.esc(hv.pill) + '<span class="hero-visual__dot" aria-hidden="true"></span>' +
      "</div>";
  };

  R.aboutMedia = function (slot) {
    var a = c().about;
    slot.innerHTML =
      '<div class="about__dots bg-dots masked" aria-hidden="true"></div>' +
      '<img class="about__img" src="assets/images/about-large.jpg" alt="The Docavia clinic reception" loading="lazy" width="880" height="605" />' +
      '<img class="about__img-small" src="assets/images/about-small.jpg" alt="A Docavia specialist at work" loading="lazy" width="208" height="277" />' +
      '<div class="about__badge"><p class="about__badge-value">' +
      D.esc(a.badgeValue).replace(/([+%]$)/, '<span class="accent accent--inverted">$1</span>') +
      '</p><p class="about__badge-label">' + D.esc(a.badgeLabel) + "</p></div>";
  };

  R.benefits = function (slot) {
    slot.innerHTML = c().about.benefits
      .map(function (item) {
        return (
          '<div class="reveal-stagger-item">' +
          '<div class="flex gap-3">' + D.icon("check-circle-2", "icon benefit__icon") +
          "<div><h3 class=\"benefit__title\">" + D.esc(item.title) + "</h3>" +
          '<p class="benefit__text">' + D.esc(item.description) + "</p></div></div></div>"
        );
      })
      .join("");
  };

  R.services = function (slot) {
    var HIGHLIGHTS = ["", "dark", "", "tint", "", ""];
    var onServicesPage = D.page && D.page.file === "services.html";
    slot.innerHTML = c().services.items
      .map(function (item, i) {
        var variant = HIGHLIGHTS[i] || "";
        var wellVariant = variant === "dark" ? "on-dark" : "";
        return (
          '<article id="service-' + (i + 1) + '" class="service-card' + (variant ? " service-card--" + variant : "") + '">' +
          '<div class="service-card__top"><span class="well well--lg well--swap' + (wellVariant ? " well--" + wellVariant : "") + '">' +
          D.icon(iconFor("services", item, i), "icon icon--lg") + "</span>" +
          '<span class="service-card__index">' + D.pad2(i + 1) + "</span></div>" +
          '<h3 class="service-card__title">' + D.esc(item.title) + "</h3>" +
          '<p class="service-card__text">' + D.esc(item.description) + "</p>" +
          '<p class="mt-6">' + arrowLink(onServicesPage ? "appointment.html" : "services.html#service-" + (i + 1), onServicesPage ? "Book appointment" : "Learn more") + "</p>" +
          "</article>"
        );
      })
      .join("");
  };

  R.whyUsList = function (slot) {
    slot.innerHTML = c().whyUs.features
      .map(function (item, i) {
        return (
          '<li class="feature-row">' +
          '<span class="feature-row__index">' + D.pad2(i + 1) + "</span>" +
          "<div><h3 class=\"feature-row__title\">" + D.esc(item.title) + "</h3>" +
          '<p class="feature-row__text">' + D.esc(item.description) + "</p></div></li>"
        );
      })
      .join("");
  };

  R.stats = function (slot) {
    slot.innerHTML =
      '<dl class="stats">' +
      c().stats.items
        .map(function (item) {
          return (
            '<div class="stat"><dd class="stat__value" data-count="' + item.value +
            '" data-suffix="' + D.esc(item.suffix) + '">0</dd>' +
            '<dt class="stat__label">' + D.esc(item.label) + "</dt></div>"
          );
        })
        .join("") +
      "</dl>";
  };

  R.doctors = function (slot) {
    var showAll = slot.getAttribute("data-view-all") !== "false";
    slot.innerHTML =
      c().doctors.items
        .map(function (doctor) {
          return (
            '<article class="doctor-card group">' +
            '<div class="doctor-card__media">' +
            '<img class="doctor-card__img" src="' + doctor.image + '" alt="' + D.esc(doctor.name) + '" loading="lazy" width="400" height="500" />' +
            '<span class="doctor-card__scrim" aria-hidden="true"></span>' +
            '<span class="doctor-card__go" aria-hidden="true">' + D.icon("arrow-up-right", "icon--sm") + "</span>" +
            "</div>" +
            '<div class="doctor-card__body">' +
            '<h3 class="doctor-card__name">' + D.esc(doctor.name) + "</h3>" +
            '<p class="doctor-card__role">' + D.esc(doctor.specialty) + "</p>" +
            '<p class="doctor-card__bio">' + D.esc(doctor.bio) + "</p></div></article>"
          );
        })
        .join("") +
      (showAll
        ? '<div class="mt-12 text-center sm:hidden"><a class="btn btn--outline" href="doctors.html">' +
          D.esc(c().doctors.viewAllLabel) + D.icon("arrow-right", "icon--sm") + "</a></div>"
        : "");
  };

  R.appointmentCta = function (slot) {
    var a = c().appointmentCta;
    var appointmentHref = D.page && D.page.file === "appointment.html" ? "#appointment" : "appointment.html";
    slot.innerHTML =
      '<div class="bg-dots-light masked" aria-hidden="true"></div>' +
      '<span class="cross cross--light" aria-hidden="true">' + D.crossSvg() + "</span>" +
      '<div class="band-dark__ring" aria-hidden="true"></div>' +
      '<div class="cta-band__inner">' +
      '<div class="cta-band__text">' +
      '<p class="eyebrow eyebrow--inverted">' + D.esc(a.eyebrow) + "</p>" +
      '<h2 class="cta-band__title">' + D.esc(a.title) + ' <em class="accent accent--inverted">' + D.esc(a.titleAccent) + "</em></h2>" +
      "<p>" + D.esc(a.description) + "</p>" +
      '<div class="cta-band__actions">' + btn(appointmentHref, a.buttonLabel, "light") +
      '<a class="cta-band__call" href="' + D.esc(D.site.phoneHref) + '">' + D.icon("phone", "icon--sm") + "or call " + D.esc(D.site.phone) + "</a>" +
      "</div></div>" +
      '<div class="cta-band__media">' +
      '<div class="cta-band__shadow" aria-hidden="true"></div>' +
      '<img class="cta-band__img" src="assets/images/cta-doctor.jpg" alt="A Docavia doctor" loading="lazy" width="400" height="440" />' +
      "</div></div>";
  };

  R.howItWorks = function (slot) {
    slot.innerHTML =
      '<span class="steps-connector draw-line" aria-hidden="true"></span><ol class="steps">' +
      c().howItWorks.steps
        .map(function (step, i) {
          return (
            '<li class="reveal"><span class="step">' + (i + 1) + "</span>" +
            '<h3 class="step__title">' + D.esc(step.title) + "</h3>" +
            '<p class="step__text">' + D.esc(step.description) + "</p></li>"
          );
        })
        .join("") +
      "</ol>";
  };

  R.testimonials = function (slot) {
    var t = c().testimonials;
    slot.innerHTML =
      sectionHeading(t) +
      '<div class="testimonials__head"><div></div>' +
      '<div class="carousel-nav">' +
      '<button class="carousel-btn" type="button" data-carousel-prev aria-label="Previous testimonial">' + D.icon("chevron-left", "icon--sm") + "</button>" +
      '<button class="carousel-btn" type="button" data-carousel-next aria-label="Next testimonial">' + D.icon("chevron-right", "icon--sm") + "</button>" +
      "</div></div>" +
      '<div class="carousel"><div class="carousel__track">' +
      t.items
        .map(function (item) {
          return (
            '<div class="carousel__slide" data-slide aria-hidden="true">' +
            '<figure class="testimonial"><blockquote>' +
            stars(5) +
            '<p class="testimonial__quote">“' + D.esc(item.quote) + "”</p>" +
            '</blockquote><figcaption class="testimonial__foot">' + avatar(item.avatar, item.name) +
            "<div><p class=\"testimonial__name\">" + D.esc(item.name) + "</p>" +
            '<p class="testimonial__role">' + D.esc(item.role) + "</p></div></figcaption>" +
            "</figure></div>"
          );
        })
        .join("") +
      "</div></div>" +
      '<div class="carousel__dots">' +
      t.items.map(function (_, i) { return '<button class="carousel__dot" type="button" aria-label="Testimonial ' + (i + 1) + '"></button>'; }).join("") +
      "</div>";
  };

  R.articles = function (slot) {
    slot.innerHTML = D.posts.map(articleCard).join("");
  };

  function articleCard(post) {
    return (
      '<article class="group"><a class="article-card" href="post.html#' + post.slug + '">' +
      '<div class="article-card__media">' +
      '<img class="article-card__img" src="' + post.image + '" alt="' + D.esc(post.title) + '" loading="lazy" width="600" height="400" />' +
      '<span class="pill pill--glass article-card__cat">' + D.esc(post.category) + "</span></div>" +
      '<p class="article-card__meta">' + D.esc(post.date) + " · " + post.readingTime + " min read</p>" +
      '<h3 class="article-card__title">' + D.esc(post.title) + "</h3>" +
      '<p class="article-card__text">' + D.esc(post.description) + "</p>" +
      '<span class="link-arrow">Read Article' + D.icon("arrow-right", "icon--sm") + "</span>" +
      "</a></article>"
    );
  }

  R.postGrid = function (slot) {
    var posts = D.posts;
    slot.innerHTML = posts.length
      ? posts.map(articleCard).join("")
      : '<div class="empty-state"><p class="empty-state__title">No articles yet</p>' +
        '<p class="empty-state__text">Published posts from the admin panel will appear here.</p></div>';
  };

  R.featuredPost = function (slot) {
    var post = D.posts[0];
    if (!post) {
      slot.innerHTML =
        '<div class="empty-state"><p class="empty-state__title">No articles yet</p>' +
        '<p class="empty-state__text">Published posts from the admin panel will appear here.</p></div>';
      return;
    }
    slot.innerHTML =
      '<a class="featured group" href="post.html#' + post.slug + '">' +
      '<div class="featured__media">' +
      '<img class="featured__img" src="' + post.image + '" alt="' + D.esc(post.title) + '" width="800" height="600" />' +
      '<span class="pill pill--glass featured__cat">' + D.esc(post.category) + "</span></div>" +
      '<div class="featured__body">' +
      '<p class="article-card__meta">' + D.esc(post.date) + " · " + post.readingTime + " min read</p>" +
      '<h2 class="featured__title">' + D.esc(post.title) + "</h2>" +
      '<p class="featured__text">' + D.esc(post.description) + "</p>" +
      '<span class="btn btn--outline">Read Article' + D.icon("arrow-right", "icon--sm") + "</span>" +
      "</div></a>";
  };

  R.relatedPosts = function (slot) {
    var slug = D.page && D.page.currentSlug ? D.page.currentSlug : "";
    var posts = D.posts.filter(function (p) { return p.slug !== slug; }).slice(0, 2);
    slot.innerHTML = posts.length ? posts.map(articleCard).join("") : "";
  };

  R.faq = function (slot) {
    var f = c().faq;
    slot.innerHTML =
      '<div class="faq-grid__intro reveal">' +
      sectionHeading(f) +
      '<div class="faq-call">' + D.well("phone", null, "lg") +
      "<div><p class=\"faq-call__label\">" + D.esc(f.callLabel) + "</p>" +
      '<a class="faq-call__number" href="' + D.site.phoneHref + '">' + D.esc(D.site.phone) + "</a></div></div>" +
      btn("contact.html", "Contact Us") + "</div>" +
      '<div class="faq-grid__answers reveal" data-accordion>' +
      '<div class="accordion">' +
      f.items
        .map(function (item, i) {
          return (
            '<div class="accordion__item"><h3>' +
            '<button class="accordion__trigger" type="button" aria-expanded="' + (i === 0 ? "true" : "false") +
            '" aria-controls="faq-panel-' + i + '" id="faq-button-' + i + '">' +
            "<span>" + D.esc(item.question) + "</span>" +
            '<span class="accordion__toggle">' + D.icon(i === 0 ? "minus" : "plus", "icon--sm") + "</span>" +
            "</button></h3>" +
            '<div class="accordion__panel" id="faq-panel-' + i + '" role="region" aria-labelledby="faq-button-' + i + '"' +
            (i === 0 ? "" : " hidden") + ">" +
            '<p class="accordion__answer">' + D.esc(item.answer) + "</p></div></div>"
          );
        })
        .join("") +
      "</div></div>";
  };

  R.finalCta = function (slot) {
    var f = c().finalCta;
    var contactHref = D.page && D.page.file === "contact.html" ? "#appointment" : "contact.html";
    slot.innerHTML =
      '<div class="bg-dots masked" aria-hidden="true"></div>' +
      '<div class="bg-dots masked" aria-hidden="true"></div>' +
      '<div class="blob" aria-hidden="true"></div>' +
      '<span class="cross hidden md:block" aria-hidden="true">' + D.crossSvg() + "</span>" +
      '<div class="newsletter__inner">' +
      '<h2 class="heading">' + D.esc(f.title) + ' <em class="accent">' + D.esc(f.titleAccent) + "</em></h2>" +
      '<p class="lede">' + D.esc(f.description) + "</p>" +
      '<div class="mt-10 flex flex-wrap justify-center gap-4">' +
      btn("appointment.html", f.primaryCta) +
      btn(contactHref, f.secondaryCta, "outline") +
      "</div></div>";
  };

  R.newsletter = function (slot) {
    slot.innerHTML =
      '<div class="bg-dots masked" aria-hidden="true"></div>' +
      '<div class="blob" aria-hidden="true"></div>' +
      '<div class="newsletter__inner">' +
      '<span class="well well--lg well--white mx-auto">' + D.icon("mail-open", "icon icon--lg") + "</span>" +
      '<h2 class="newsletter__title">Health Tips Worth <em class="accent">Opening.</em></h2>' +
      '<p class="newsletter__text">One short email a month: what our specialists are seeing, and the small habits that make a measurable difference.</p>' +
      '<form class="newsletter__form" data-newsletter novalidate>' +
      '<label class="sr-only" for="newsletter-email">Email address</label>' +
      '<input class="form-input" id="newsletter-email" type="email" name="email" required placeholder="you@example.com" autocomplete="email" />' +
      '<button class="btn btn--primary" type="submit">Subscribe</button>' +
      "</form></div>";
  };

  R.assurances = function (slot) {
    slot.innerHTML = inline().assurances.items
      .map(function (item) {
        return (
          '<div class="assurance">' + D.well(item.icon, null, "lg") +
          "<div><h3 class=\"assurance__title\">" + D.esc(item.title) + "</h3>" +
          '<p class="assurance__text">' + D.esc(item.description) + "</p></div></div>"
        );
      })
      .join("");
  };

  R.serviceLinks = function (slot) {
    slot.innerHTML = c().services.items
      .map(function (item, i) {
        return (
          '<a class="field-link" href="services.html">' + D.well(iconFor("services", item, i), "sm") +
          "<span>" + D.esc(item.title) + "</span>" +
          '<span class="field-link__go">' + D.icon("arrow-up-right", "icon--sm") + "</span></a>"
        );
      })
      .join("");
  };

  R.nextSteps = function (slot) {
    var ns = inline().nextSteps;
    slot.innerHTML =
      '<h2 class="font-heading text-lg font-bold">' + D.esc(ns.title) + "</h2>" +
      '<ol class="next-steps">' +
      ns.steps
        .map(function (step, i) {
          return (
            '<li class="next-step"><span class="next-step__num">' + (i + 1) + "</span>" +
            "<div><p class=\"next-step__title\">" + D.esc(step.title) + "</p>" +
            '<p class="next-step__text">' + D.esc(step.description) + "</p></div></li>"
          );
        })
        .join("") +
      "</ol>" +
      '<p class="next-steps__foot">' + D.esc(ns.footnote) + " " +
      '<a href="' + D.site.phoneHref + '">' + D.esc(D.site.phone) + "</a></p>";
  };

  R.transport = function (slot) {
    slot.innerHTML = inline().gettingHere.transport
      .map(function (item) {
        return (
          '<li class="flex gap-4">' + D.well(item.icon, "white circle") +
          "<div><p class=\"transport__title\">" + D.esc(item.title) + "</p>" +
          '<p class="transport__text">' + D.esc(item.description) + "</p></div></li>"
        );
      })
      .join("");
  };

  R.contactChannels = function (slot) {
    slot.innerHTML = inline().contactChannels.items
      .map(function (item) {
        return (
          '<article class="card card--hover channel">' + D.well(item.icon, null, "lg") +
          '<h2 class="channel__title">' + D.esc(item.title) + "</h2>" +
          '<p class="channel__line1">' + D.esc(item.line1) + "</p>" +
          '<p class="channel__line2">' + D.esc(item.line2) + "</p>" +
          (item.actionLabel
            ? '<p class="channel__action"><a class="link-arrow" href="' + item.actionHref + '"' +
              (item.external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + D.esc(item.actionLabel) +
              D.icon("arrow-right", "icon--sm") + "</a></p>"
            : '<p class="channel__action"></p>') +
          "</article>"
        );
      })
      .join("");
  };

  /* --------------------------- Legal article ------------------------------ */

  R.legal = function (slot) {
    var doc = D.page && D.page.legal ? D.page.legal : D.legal.privacy;
    slot.innerHTML =
      '<p class="legal__updated">Last updated · ' + D.esc(doc.updated) + "</p>" +
      '<div class="legal__grid">' +
      '<nav class="legal__toc" aria-label="On this page"><p class="footer-col__title">On this page</p><ol>' +
      doc.sections
        .map(function (section, i) {
          return (
            '<li><a href="#' + section.id + '"><span class="legal__toc-index">' + D.pad2(i + 1) +
            "</span>" + D.esc(section.title) + "</a></li>"
          );
        })
        .join("") +
      "</ol></nav>" +
      '<article class="legal__article"><p class="legal__intro">' + D.esc(doc.intro) + "</p>" +
      '<div class="legal__sections">' +
      doc.sections
        .map(function (section, i) {
          return (
            '<section class="legal__section" id="' + section.id + '" aria-labelledby="' + section.id + '-title">' +
            '<h2 id="' + section.id + '-title"><span class="legal__section-index">' + D.pad2(i + 1) + "</span>" +
            D.esc(section.title) + "</h2>" +
            '<div class="legal__body">' +
            section.body
              .map(function (block) {
                if (block.type === "ul") {
                  return "<ul>" + block.items.map(function (item) { return "<li>" + D.rich(item) + "</li>"; }).join("") + "</ul>";
                }
                return "<p>" + D.rich(block.text) + "</p>";
              })
              .join("") +
            "</div></section>"
          );
        })
        .join("") +
      "</div></article></div>";
  };

  /* ------------------------------ Post detail ----------------------------- */

  R.postBody = function (slot) {
    var post = D.page && D.page.currentPost ? D.page.currentPost : null;
    if (!post) { slot.innerHTML = ""; return; }
    slot.innerHTML = post.content
      .map(function (block) {
        if (block.type === "heading") return "<h2>" + D.esc(block.text) + "</h2>";
        if (block.type === "list") return "<ul>" + block.items.map(function (i) { return "<li>" + D.esc(i) + "</li>"; }).join("") + "</ul>";
        if (block.type === "quote") {
          return (
            '<blockquote><p>“' + D.esc(block.text) + "”</p>" +
            (block.cite ? '<p class="quote-cite">— ' + D.esc(block.cite) + "</p>" : "") +
            "</blockquote>"
          );
        }
        return "<p>" + D.esc(block.text) + "</p>";
      })
      .join("");
  };

  R.comments = function (slot) {
    var post = D.page && D.page.currentPost ? D.page.currentPost : null;
    var slug = post ? post.slug : "";
    var comments = (D.seedComments[slug] || []).slice();
    var count = comments.length;
    comments.forEach(function (c) { count += (c.replies || []).length; });

    function commentHtml(item, isReply) {
      return (
        '<li class="comment">' + avatar(item.avatar, item.author) +
        "<div><p class=\"comment__author\"><span class=\"comment__name\">" + D.esc(item.author) + "</span>" +
        '<span class="comment__date">' + D.esc(item.date) + "</span></p>" +
        '<p class="comment__text">' + D.esc(item.text) + "</p>" +
        (isReply
          ? ""
          : '<button class="comment__reply-btn" type="button" data-reply="' + D.esc(item.id) + '">' +
            D.icon("corner-down-right", "icon--xs") + "Reply</button>") +
        '<div data-reply-slot="' + D.esc(item.id) + '"></div>' +
        (item.replies && item.replies.length
          ? '<ul class="comment__replies">' + item.replies.map(function (r) { return commentHtml(r, true); }).join("") + "</ul>"
          : "") +
        "</div></li>"
      );
    }

    slot.innerHTML =
      '<div class="comments__head"><h2 class="comments__title">Comments</h2>' +
      '<span class="comments__count">' + count + "</span></div>" +
      '<ul class="mt-2" data-comment-list>' +
      (comments.length ? comments.map(function (item) { return commentHtml(item, false); }).join("")
        : '<li class="muted text-sm py-6">No comments yet — be the first.</li>') +
      "</ul>" +
      '<div class="comment-new"><h3 class="comment-new__title">Leave a comment</h3>' +
      '<p class="comment-new__text">Comments are moderated. Keep it kind and skip medical details.</p>' +
      '<form data-comment-form><label class="sr-only" for="comment-name">Name</label>' +
      '<input class="form-input" id="comment-name" name="name" required placeholder="Your name" autocomplete="name" />' +
      '<label class="sr-only" for="comment-text">Comment</label>' +
      '<textarea class="form-textarea" id="comment-text" name="text" rows="4" required placeholder="Share your experience"></textarea>' +
      '<div><button class="btn btn--primary" type="submit">Post Comment</button></div></form></div>';
  };

  /* ------------------------------- Dispatch ------------------------------- */

  D.sections = {
    map: R,
    run: function (root) {
      D.$$("[data-render]", root || document).forEach(function (slot) {
        var name = slot.getAttribute("data-render");
        if (R[name]) R[name](slot);
      });
    }
  };
})(window.DOCAVIA);
