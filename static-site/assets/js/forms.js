/* ===========================================================================
   Docavia — forms
   Appointment request, appointment lookup, contact, newsletter, comments and
   the demo sign-in. Nothing leaves the browser: appointments are kept in
   localStorage so the lookup step has something real to find.
   =========================================================================== */

window.DOCAVIA = window.DOCAVIA || {};

(function (D) {
  "use strict";

  var STORE_KEY = "docavia.appointments";

  /* ------------------------------ Storage --------------------------------- */

  function readAll() {
    try {
      return JSON.parse(window.localStorage.getItem(STORE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeAll(rows) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(rows));
    } catch {
      /* private mode — the prototype still works, it just forgets */
    }
  }

  function newCode() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var out = "";
    for (var i = 0; i < 6; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return "APT-" + out;
  }

  /* Deterministic pseudo-booked slots so a doctor+date looks partly taken. */
  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function bookedSlots(doctor, dateIso) {
    if (!doctor || !dateIso || doctor === "no-preference") return [];
    var groups = D.slotsForDate(dateIso, []);
    var all = [];
    groups.forEach(function (g) { all = all.concat(g.slots.map(function (s) { return s.value; })); });
    if (all.length < 4) return [];
    var seed = hash(doctor + "::" + dateIso);
    var count = 2 + (seed % 3);
    var out = [];
    for (var i = 0; i < count; i++) out.push(all[(seed + i * 3) % all.length]);
    return out;
  }

  /* --------------------------- Appointment form --------------------------- */

  function departmentOptions() {
    return D.content.services.items
      .map(function (item) { return { value: item.title, label: item.title }; })
      .concat([{ value: "other", label: "Other / Not sure" }]);
  }

  function doctorOptions() {
    return D.content.doctors.items
      .map(function (doc) { return { value: doc.name, label: doc.name + " — " + doc.specialty }; })
      .concat([{ value: "no-preference", label: "No preference — match me" }]);
  }

  function buildSelect(id, label, options, placeholder, full) {
    return (
      '<div class="form-field' + (full ? " form-field--full" : "") + '">' +
      '<span class="form-label" id="' + id + '-label">' + D.esc(label) + "</span>" +
      '<div class="picker picker--select" data-value="">' +
      '<button class="picker__trigger" type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="' + id + '-label">' +
      '<span class="picker__value is-placeholder">' + D.esc(placeholder) + "</span>" +
      '<span class="picker__chevron">' + D.icon("chevron-down", "icon--sm") + "</span></button>" +
      '<ul class="picker__panel picker__list" role="listbox" aria-labelledby="' + id + '-label" hidden>' +
      options
        .map(function (option) {
          return (
            '<li class="picker__option" role="option" data-value="' + D.esc(option.value) + '"' +
            ' data-label="' + D.esc(option.label) + '" aria-selected="false">' +
            "<span>" + D.esc(option.label) + "</span></li>"
          );
        })
        .join("") +
      "</ul></div>" +
      '<p class="form-error" hidden>Please select a ' + D.esc(label.toLowerCase()) + ".</p>" +
      "</div>"
    );
  }

  function appointmentSuccess(code, data) {
    var summary = [
      ["Department", data.department],
      ["Doctor", data.doctor && data.doctor !== "no-preference" ? data.doctor : "No preference — match me"],
      ["Date", data.date ? new Date(data.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : ""],
      ["Time", data.timeSlot || "Any time"],
      ["Visit type", data.visitType === "video" ? "Video consultation" : "In-person visit"]
    ].filter(function (row) { return row[1]; });

    return (
      '<div class="success-panel swap">' +
      '<span class="success-panel__icon">' + D.icon("check-circle-2", "icon--xl") + "</span>" +
      '<h3 class="success-panel__title">Appointment Requested.</h3>' +
      '<p class="success-panel__text">Our care team confirms every request by phone, usually within one working day.</p>' +
      '<div class="success-code"><p class="success-code__label">Your appointment code</p>' +
      '<p class="success-code__value" data-code>' + D.esc(code) + "</p></div>" +
      '<button class="btn btn--outline btn--sm" type="button" data-copy-code>' +
      D.icon("check", "icon--sm") + '<span>Copy code</span></button>' +
      '<p class="form-note">Confirmation email: ' + D.esc(data.email) + "</p>" +
      '<dl class="success-summary">' +
      summary.map(function (row) { return "<div><dt>" + row[0] + "</dt><dd>" + D.esc(row[1]) + "</dd></div>"; }).join("") +
      "</dl>" +
      '<button class="btn btn--primary" type="button" data-book-another>Book Another Appointment</button>' +
      "</div>"
    );
  }

  function mountAppointmentForm(root) {
    var card = D.$("[data-appointment-form]", root);
    if (!card) return;

    card.innerHTML =
      '<form data-appt novalidate>' +
      '<div class="form-grid">' +
      '<label class="form-field"><span class="form-label">Full Name</span>' +
      '<input class="form-input" name="name" type="text" required autocomplete="name" placeholder="Jane Cooper" /></label>' +
      '<label class="form-field"><span class="form-label">Phone</span>' +
      '<input class="form-input" name="phone" type="tel" required autocomplete="tel" placeholder="+1 234 567 890" /></label>' +
      '<label class="form-field form-field--full"><span class="form-label">Email</span>' +
      '<input class="form-input" name="email" type="email" required autocomplete="email" placeholder="jane@example.com" /></label>' +
      buildSelect("appt-department", "Department", departmentOptions(), "Select a department") +
      buildSelect("appt-doctor", "Doctor", doctorOptions(), "Any available doctor") +
      '<div class="form-field"><span class="form-label" id="appt-date-label">Preferred Date</span>' +
      '<div class="picker picker--date">' +
      '<button class="picker__trigger" type="button" aria-haspopup="dialog" aria-labelledby="appt-date-label">' +
      '<span class="picker__value is-placeholder">Select a date</span>' +
      '<span class="picker__chevron">' + D.icon("chevron-down", "icon--sm") + "</span></button>" +
      '<div class="picker__panel picker__panel--tall" role="dialog" aria-label="Choose a date" hidden>' +
      '<div class="cal__head">' +
      '<button class="cal__nav" type="button" data-cal-prev aria-label="Previous month">' + D.icon("chevron-left", "icon--sm") + "</button>" +
      '<span class="cal__label" data-cal-label aria-live="polite"></span>' +
      '<button class="cal__nav" type="button" data-cal-next aria-label="Next month">' + D.icon("chevron-right", "icon--sm") + "</button></div>" +
      '<div class="cal__grid" data-cal-grid role="grid"></div>' +
      '<div class="cal__foot"><button class="cal__today" type="button" data-cal-today>Today</button>' +
      "<span>We confirm every slot by phone.</span></div></div></div></div>" +
      '<div class="form-field"><span class="form-label" id="appt-time-label">Preferred Time</span>' +
      '<div class="picker picker--time">' +
      '<button class="picker__trigger" type="button" aria-haspopup="dialog" aria-labelledby="appt-time-label">' +
      '<span class="picker__value is-placeholder" data-placeholder="No preference">No preference</span>' +
      '<span class="picker__chevron">' + D.icon("chevron-down", "icon--sm") + "</span></button>" +
      '<div class="picker__panel picker__panel--tall" role="dialog" aria-label="Choose a time" hidden>' +
      '<div class="slots__head"><span class="slots__title">Available Times</span>' +
      '<span class="slots__context" data-slots-context></span></div>' +
      '<div data-slots-body></div>' +
      '<div class="cal__foot"><button class="cal__today" type="button" data-slots-clear>No preference</button>' +
      "<span>All slots are 30 minutes.</span></div></div></div></div>" +
      '<fieldset class="form-field form-field--full"><legend class="form-label">Visit Type</legend>' +
      '<div class="radio-cards mt-2">' +
      '<label class="radio-card"><input type="radio" name="visitType" value="in-person" checked />' +
      D.icon("stethoscope", "icon--sm") + "In-Person Visit</label>" +
      '<label class="radio-card"><input type="radio" name="visitType" value="video" />' +
      D.icon("users", "icon--sm") + "Video Consultation</label></div></fieldset>" +
      '<label class="form-field form-field--full"><span class="form-label">Notes <span class="muted">(optional)</span></span>' +
      '<textarea class="form-textarea" name="notes" rows="4" placeholder="Anything we should know before your visit?"></textarea></label>' +
      '<div class="sr-only" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off" /></label></div>' +
      "</div>" +
      '<div class="form-alert" role="alert" hidden></div>' +
      '<div class="form-footer">' +
      '<p class="form-note">Submitting a request is not a confirmed booking. We call you to confirm.</p>' +
      '<button class="btn btn--primary" type="submit">Request Appointment' + D.icon("calendar-check", "icon--sm") + "</button>" +
      "</div></form>";

    D.paintIcons(card);
    D.$$(".picker--select", card).forEach(D.initSelect);
    D.initDatePicker(D.$(".picker--date", card));
    D.initTimePicker(D.$(".picker--time", card));

    var form = D.$("[data-appt]", card);
    var alertBox = D.$(".form-alert", card);
    var departmentSlot = D.$(".picker--select", card);
    var departmentTrigger = D.$(".picker__trigger", departmentSlot);
    var doctorSlot = D.$$(".picker--select", card)[1];
    var dateSlot = D.$(".picker--date", card);
    var timeSlot = D.$(".picker--time", card);

    departmentSlot.addEventListener("picker:change", function () {
      departmentTrigger.removeAttribute("aria-invalid");
      var err = D.$(".form-error", departmentSlot.parentElement);
      if (err) err.hidden = true;
    });

    function refreshSlots() {
      var date = dateSlot.getAttribute("data-value") || "";
      var doctor = doctorSlot ? doctorSlot.getAttribute("data-value") || "" : "";
      if (!date) return;
      timeSlot.setAttribute("data-booked", JSON.stringify(bookedSlots(doctor, date)));
      timeSlot.dispatchEvent(new CustomEvent("picker:date", { detail: { value: date } }));
    }

    dateSlot.addEventListener("picker:change", refreshSlots);
    if (doctorSlot) doctorSlot.addEventListener("picker:change", refreshSlots);

    D.on(form, "submit", function (event) {
      event.preventDefault();
      var fields = form.elements;
      var nameInput = fields.namedItem("name");
      var phoneInput = fields.namedItem("phone");
      var emailInput = fields.namedItem("email");
      var data = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentSlot.getAttribute("data-value") || "",
        doctor: doctorSlot ? doctorSlot.getAttribute("data-value") || "" : "",
        date: dateSlot.getAttribute("data-value") || "",
        timeSlot: timeSlot.getAttribute("data-value") || "",
        visitType: (fields.namedItem("visitType").value || "in-person"),
        notes: fields.namedItem("notes").value.trim()
      };

      if (fields.namedItem("website").value) return; /* honeypot */

      if (!data.department) {
        departmentTrigger.setAttribute("aria-invalid", "true");
        var err = D.$(".form-error", departmentSlot.parentElement);
        if (err) err.hidden = false;
        D.$(".picker__trigger", departmentSlot).focus();
        return;
      }

      if (!nameInput.value || !phoneInput.value || !emailInput.value) {
        form.reportValidity();
        return;
      }

      var code = newCode();
      var rows = readAll();
      rows.unshift({
        code: code,
        name: data.name,
        phone: data.phone,
        email: data.email,
        department: data.department,
        doctor: data.doctor || "no-preference",
        date: data.date,
        timeSlot: data.timeSlot,
        visitType: data.visitType,
        status: "new"
      });
      writeAll(rows);

      alertBox.hidden = true;
      card.innerHTML = appointmentSuccess(code, data);
      D.paintIcons(card);
      wireSuccess();
      D.toast("Appointment request received.");
    });

    function wireSuccess() {
      var copyBtn = D.$("[data-copy-code]", card);
      D.on(copyBtn, "click", function () {
        var value = D.$("[data-code]", card).textContent;
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(value).then(function () {
          copyBtn.innerHTML = D.icon("check", "icon--sm") + "<span>Copied!</span>";
          setTimeout(function () {
            copyBtn.innerHTML = D.icon("check", "icon--sm") + "<span>Copy code</span>";
          }, 2500);
        }, function () { /* clipboard blocked — the code is still visible */ });
      });

      D.on(D.$("[data-book-another]", card), "click", function () {
        mountAppointmentForm(root);
        D.$(".form-input", card).focus();
      });
    }
  }

  /* -------------------------- Appointment lookup -------------------------- */

  function statusPill(status) {
    return '<span class="status status--' + status + '">' + D.esc(status) + "</span>";
  }

  function mountLookup(root) {
    var card = D.$("[data-appointment-lookup]", root);
    if (!card) return;

    card.innerHTML =
      '<div class="lookup" id="my-appointment">' +
      '<h3 class="lookup__title">My Appointment</h3>' +
      '<p class="lookup__text">Enter your appointment code or the email you booked with.</p>' +
      '<form class="lookup__form" data-lookup novalidate>' +
      '<label class="sr-only" for="lookup-query">Appointment code or email</label>' +
      '<input class="form-input" id="lookup-query" name="query" type="text" placeholder="APT-XXXXXX or your email" autocomplete="off" />' +
      '<button class="btn btn--primary" type="submit">Look Up</button></form>' +
      '<div class="lookup__result" data-lookup-result aria-live="polite"></div></div>';

    var form = D.$("[data-lookup]", card);
    var result = D.$("[data-lookup-result]", card);

    function render(rows) {
      if (!rows.length) {
        result.innerHTML =
          '<div class="lookup__empty">' + D.icon("search-x", "icon") +
          "<span>No appointment found for that code or email.</span></div>";
        return;
      }
      result.innerHTML =
        '<ul class="lookup__list">' +
        rows
          .map(function (row) {
            return (
              '<li class="lookup__item' + (row.status === "cancelled" ? " is-cancelled" : "") + '">' +
              '<div class="lookup__top"><span class="lookup__code">' + D.esc(row.code) + "</span>" + statusPill(row.status) + "</div>" +
              '<p class="lookup__dept">' + D.esc(row.department) +
              (row.doctor && row.doctor !== "no-preference" ? " · " + D.esc(row.doctor) : "") + "</p>" +
              '<p class="lookup__meta">' +
              (row.date ? new Date(row.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " · " : "") +
              D.esc(row.timeSlot || "any time") + " · " + (row.visitType === "video" ? "video" : "in-person") + "</p>" +
              (row.status === "new"
                ? '<div class="lookup__cancel" data-cancel-row="' + D.esc(row.code) + '">' +
                  '<button class="btn btn--sm btn--danger" type="button" data-cancel>Cancel appointment</button></div>'
                : "") +
              "</li>"
            );
          })
          .join("") +
        "</ul>";

      D.$$("[data-cancel]", result).forEach(function (button) {
        D.on(button, "click", function () {
          var wrap = button.closest("[data-cancel-row]");
          wrap.innerHTML =
            '<span class="form-note">Cancel this appointment?</span>' +
            '<button class="btn btn--sm btn--danger-solid" type="button" data-cancel-yes>Yes, cancel it</button>' +
            '<button class="btn btn--sm btn--outline" type="button" data-cancel-no>Keep it</button>';
          var code = wrap.getAttribute("data-cancel-row");
          D.on(D.$("[data-cancel-yes]", wrap), "click", function () {
            var rows = readAll().map(function (row) {
              return row.code === code ? Object.assign({}, row, { status: "cancelled" }) : row;
            });
            writeAll(rows);
            D.toast("Appointment cancelled.");
            run();
          });
          D.on(D.$("[data-cancel-no]", wrap), "click", function () { run(); });
        });
      });
    }

    function run() {
      var queryInput = form.elements.namedItem("query");
      var query = queryInput.value.trim();
      if (!query) { queryInput.focus(); return; }
      var needle = query.toLowerCase();
      render(
        readAll().filter(function (row) {
          return row.code.toLowerCase() === needle || (row.email || "").toLowerCase() === needle;
        })
      );
    }

    D.on(form, "submit", function (event) {
      event.preventDefault();
      run();
    });
  }

  /* ----------------------------- Contact form ----------------------------- */

  function mountContactForm(root) {
    var card = D.$("[data-contact-form]", root);
    if (!card) return;

    card.innerHTML =
      '<form data-contact novalidate>' +
      '<div class="form-grid">' +
      '<label class="form-field"><span class="form-label">Full Name</span>' +
      '<input class="form-input" name="name" type="text" required autocomplete="name" placeholder="Jane Cooper" /></label>' +
      '<label class="form-field"><span class="form-label">Email</span>' +
      '<input class="form-input" name="email" type="email" required autocomplete="email" placeholder="jane@example.com" /></label>' +
      '<label class="form-field form-field--full"><span class="form-label">Phone <span class="muted">(optional)</span></span>' +
      '<input class="form-input" name="phone" type="tel" autocomplete="tel" placeholder="+1 234 567 890" /></label>' +
      buildSelect("contact-department", "Department", departmentOptions(), "Select a department", true) +
      '<label class="form-field form-field--full"><span class="form-label">Message</span>' +
      '<textarea class="form-textarea" name="message" rows="5" required placeholder="How can we help?"></textarea></label>' +
      "</div>" +
      '<div class="form-alert" role="alert" hidden></div>' +
      '<div class="form-footer">' +
      '<p class="form-note">By sending a message you agree to our privacy policy.</p>' +
      '<button class="btn btn--primary" type="submit">Send Message' + D.icon("send", "icon--sm") + "</button>" +
      "</div></form>";

    D.paintIcons(card);
    var slot = D.$(".picker--select", card);
    var slotTrigger = D.$(".picker__trigger", slot);
    D.initSelect(slot);
    slot.addEventListener("picker:change", function () {
      slotTrigger.removeAttribute("aria-invalid");
      var err = D.$(".form-error", slot.parentElement);
      if (err) err.hidden = true;
    });

    var form = D.$("[data-contact]", card);

    D.on(form, "submit", function (event) {
      event.preventDefault();
      if (!slot.getAttribute("data-value")) {
        slotTrigger.setAttribute("aria-invalid", "true");
        var err = D.$(".form-error", slot.parentElement);
        if (err) err.hidden = false;
        D.$(".picker__trigger", slot).focus();
        return;
      }
      var fields = form.elements;
      if (!fields.namedItem("name").value || !fields.namedItem("email").value || !fields.namedItem("message").value) {
        form.reportValidity();
        return;
      }
      var button = D.$("button[type=submit]", form);
      button.disabled = true;
      button.textContent = "Sending…";
      setTimeout(function () {
        card.innerHTML =
          '<div class="success-panel swap">' +
          '<span class="success-panel__icon">' + D.icon("check-circle-2", "icon--xl") + "</span>" +
          '<h3 class="success-panel__title">Message Received.</h3>' +
          '<p class="success-panel__text">A member of our care team replies within one working day. For anything urgent, call ' +
          D.esc(D.site.phone) + ".</p>" +
          '<button class="btn btn--outline" type="button" data-send-another>Send Another Message</button></div>';
        D.paintIcons(card);
        D.toast("Message sent.");
        D.on(D.$("[data-send-another]", card), "click", function () { mountContactForm(root); });
      }, 900);
    });
  }

  /* ------------------------------ Newsletter ------------------------------ */

  function mountNewsletter(root) {
    D.$$("[data-newsletter]", root).forEach(function (form) {
      D.on(form, "submit", function (event) {
        event.preventDefault();
        var input = D.$("input[type=email]", form);
        if (!input.value || !input.checkValidity()) { input.reportValidity(); return; }
        var host = form.parentNode;
        form.outerHTML =
          '<div class="newsletter__done swap">' + D.icon("check-circle-2", "icon") +
          "<span>You're on the list — see you in your inbox.</span></div>";
        D.toast("Subscribed to the health journal.");
        return host;
      });
    });
  }

  /* -------------------------------- Comments ------------------------------ */

  function mountComments(root) {
    var slot = D.$("[data-comments]", root);
    if (!slot) return;
    D.sections.map.comments(slot);

    var form = D.$("[data-comment-form]", slot);
    var nameInput = D.$("#comment-name", slot);
    var textInput = D.$("#comment-text", slot);

    D.on(form, "submit", function (event) {
      event.preventDefault();
      if (!nameInput.value.trim() || !textInput.value.trim()) { form.reportValidity(); return; }
      var item = {
        id: "c-" + Date.now(),
        author: nameInput.value.trim(),
        avatar: "",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        text: textInput.value.trim(),
        replies: []
      };
      D.comments.unshift(item);
      D.sections.map.comments(slot);
      D.paintIcons(slot);
      wire();
      D.toast("Comment posted.");
    });

    function wire() {
      D.$$("[data-reply]", slot).forEach(function (button) {
        D.on(button, "click", function () {
          var target = D.$('[data-reply-slot="' + button.getAttribute("data-reply") + '"]', slot);
          if (!target || target.firstChild) return;
          target.innerHTML =
            '<form class="comment-form" data-reply-form>' +
            '<label class="sr-only" for="reply-text-' + D.esc(button.getAttribute("data-reply")) + '">Reply</label>' +
            '<textarea class="form-textarea" id="reply-text-' + D.esc(button.getAttribute("data-reply")) +
            '" rows="3" required placeholder="Replying as ' + D.esc(nameInput.value.trim() || "guest") + ' — write your reply"></textarea>' +
            '<div class="comment-form__actions">' +
            '<button class="btn btn--sm btn--primary" type="submit">Post Reply</button>' +
            '<button class="btn btn--sm btn--outline" type="button" data-reply-cancel>Cancel</button></div></form>';

          D.on(D.$("[data-reply-cancel]", target), "click", function () { target.innerHTML = ""; });
          D.on(D.$("[data-reply-form]", target), "submit", function (event) {
            event.preventDefault();
            var text = D.$("textarea", target).value.trim();
            if (!text) return;
            var author = nameInput.value.trim() || "Guest";
            D.comments.forEach(function (item) {
              if (item.id === button.getAttribute("data-reply")) {
                item.replies.push({
                  id: "r-" + Date.now(),
                  author: author,
                  avatar: "",
                  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  text: text,
                  replies: []
                });
              }
            });
            D.sections.map.comments(slot);
            D.paintIcons(slot);
            wire();
            D.toast("Reply posted.");
          });
        });
      });
    }

    wire();
  }

  /* --------------------------------- Login -------------------------------- */

  var DEMO = { email: "demo@docavia.com", password: "demo2026" };

  function mountLogin(root) {
    var form = D.$("[data-login]", root);
    if (!form) return;

    var emailInput = form.elements.namedItem("email");
    var passwordInput = form.elements.namedItem("password");
    var toggle = D.$("[data-password-toggle]", root);
    if (toggle && passwordInput) {
      D.on(toggle, "click", function () {
        var showing = passwordInput.type === "text";
        passwordInput.type = showing ? "password" : "text";
        toggle.setAttribute("aria-label", showing ? "Show password" : "Hide password");
        toggle.innerHTML = D.icon(showing ? "eye" : "eye-off", "icon--sm");
        passwordInput.focus();
      });
    }

    D.on(D.$("[data-demo-fill]", root), "click", function () {
      emailInput.value = DEMO.email;
      passwordInput.value = DEMO.password;
      emailInput.dispatchEvent(new Event("input"));
      passwordInput.dispatchEvent(new Event("input"));
      D.toast("Demo credentials filled.");
    });

    D.on(form, "submit", function (event) {
      event.preventDefault();
      var error = D.$("[data-login-error]", root);
      var email = emailInput.value.trim();
      var password = passwordInput.value;

      if (!email) { setError(error, "Please enter your email address."); emailInput.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(error, "That email address doesn't look right."); emailInput.focus(); return; }
      if (!password) { setError(error, "Please enter your password."); passwordInput.focus(); return; }
      if (password !== DEMO.password) { setError(error, "Email or password is incorrect."); passwordInput.focus(); return; }

      setError(error, "");
      var button = D.$("button[type=submit]", form);
      button.disabled = true;
      button.innerHTML = D.icon("loader", "icon--sm") + "<span>Just a moment…</span>";

      setTimeout(function () {
        var host = form.closest("[data-login-shell]") || form.parentNode;
        host.innerHTML =
          '<div class="panel swap" role="status">' +
          '<div class="text-center">' +
          '<span class="well well--xl mx-auto">' + D.icon("layout-dashboard", "icon icon--lg") + "</span>" +
          '<h1 class="auth__title mt-5">Welcome back.</h1>' +
          '<p class="auth__text">You’re signed in as <b>' + D.esc(email) + "</b>. " +
          "This prototype has no admin panel — the Next.js app lives at <code>/admin</code>.</p>" +
          '<a class="btn btn--primary mt-7" href="index.html">Back to the site' +
          D.icon("arrow-right", "icon--sm") + "</a></div></div>";
        D.paintIcons(host);
      }, 700);
    });
  }

  function setError(node, message) {
    if (!node) return;
    if (!message) { node.hidden = true; node.innerHTML = ""; return; }
    node.hidden = false;
    node.innerHTML = D.icon("circle-alert", "icon--sm") + "<span></span>";
    node.lastChild.textContent = message;
  }

  /* -------------------------------- Mount --------------------------------- */

  D.comments = [];

  D.forms = {
    mountComments: mountComments,
    mount: function () {
      mountAppointmentForm(document);
      mountLookup(document);
      mountContactForm(document);
      mountNewsletter(document);
      mountComments(document);
      mountLogin(document);
    }
  };
})(window.DOCAVIA);
