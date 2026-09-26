/* ===========================================================================
   Docavia — core
   Namespace, DOM helpers, icon set, scroll reveal, toast, shared form widgets.
   Loaded first; every other module attaches to window.DOCAVIA.
   =========================================================================== */

window.DOCAVIA = window.DOCAVIA || {};

(function (D) {
  "use strict";

  /* ------------------------------- Helpers -------------------------------- */

  D.$ = function (sel, root) {
    return (root || document).querySelector(sel);
  };

  D.$$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  D.on = function (el, type, handler, opts) {
    if (el) el.addEventListener(type, handler, opts);
  };

  D.el = function (tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "class") node.className = value;
        else if (key === "html") node.innerHTML = value;
        else if (key === "text") node.textContent = value;
        else if (key.indexOf("on") === 0 && typeof value === "function") {
          node.addEventListener(key.slice(2).toLowerCase(), value);
        } else node.setAttribute(key, value === true ? "" : value);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  };

  D.clear = function (node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
    return node;
  };

  D.pad2 = function (n) {
    return (n < 10 ? "0" : "") + n;
  };

  D.get = function (path, source) {
    var parts = path.split(".");
    var node = source || D;
    for (var i = 0; i < parts.length; i++) {
      if (node === null || node === undefined) return undefined;
      node = node[parts[i]];
    }
    return node;
  };

  /* Escapes a string for safe innerHTML interpolation. */
  D.esc = function (value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  /* Mini inline markup used by the legal copy: **bold** and [label](href). */
  D.rich = function (text) {
    return D.esc(text)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  };

  /* -------------------------------- Icons --------------------------------- */

  /* Local Lucide icon bodies, generated from @iconify-json/lucide. */
  var PATHS = {
    "arrow-left": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m12 19l-7-7l7-7m7 7H5\"/>",
    "arrow-right": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12h14m-7-7l7 7l-7 7\"/>",
    "arrow-up-right": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M7 7h10v10M7 17L17 7\"/>",
    "baby": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5m1-4h.01\"/><path d=\"M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6a9 9 0 0 1-17.6 0a2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1m-3 5h.01\"/></g>",
    "bike": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"18.5\" cy=\"17.5\" r=\"3.5\"/><circle cx=\"5.5\" cy=\"17.5\" r=\"3.5\"/><circle cx=\"15\" cy=\"5\" r=\"1\"/><path d=\"M12 17.5V14l-3-3l4-3l2 3h2\"/></g>",
    "brain": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M12 18V5m3 8a4.17 4.17 0 0 1-3-4a4.17 4.17 0 0 1-3 4m8.598-6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5\"/><path d=\"M17.997 5.125a4 4 0 0 1 2.526 5.77\"/><path d=\"M18 18a4 4 0 0 0 2-7.464\"/><path d=\"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517\"/><path d=\"M6 18a4 4 0 0 1-2-7.464\"/><path d=\"M6.003 5.125a4 4 0 0 0-2.526 5.77\"/></g>",
    "bus": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M8 6v6m7-6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2s-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/><path d=\"M9 18h5\"/><circle cx=\"16\" cy=\"18\" r=\"2\"/></g>",
    "calendar-check": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M8 2v3m8-3v3\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M3 9h18M9 15l2 2l4-4\"/></g>",
    "calendar-clock": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M16 14v2.2l1.6 1M16 2v3m5 2.338V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2.338M3 9h5.859M8 2v3\"/><circle cx=\"16\" cy=\"16\" r=\"6\"/></g>",
    "calendar-days": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M8 2v3m8-3v3\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M3 9h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01\"/></g>",
    "calendar-x": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M8 2v3m8-3v3\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M3 9h18m-7 4l-4 4m0-4l4 4\"/></g>",
    "car": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2\"/><circle cx=\"7\" cy=\"17\" r=\"2\"/><path d=\"M9 17h6\"/><circle cx=\"17\" cy=\"17\" r=\"2\"/></g>",
    "check": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M20 6L9 17l-5-5\"/>",
    "check-circle-2": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m16 9l-5.5 5.5L8 12\"/></g>",
    "circle-alert": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 8v4m0 4h.01\"/></g>",
    "clock": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/></g>",
    "corner-down-right": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"m15 10l5 5l-5 5\"/><path d=\"M4 4v7a4 4 0 0 0 4 4h12\"/></g>",
    "dumbbell": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829zM2.5 21.5l1.4-1.4M20.1 3.9l1.4-1.4M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829zM9.6 14.4l4.8-4.8\"/>",
    "eye": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></g>",
    "eye-off": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242\"/><path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20\"/></g>",
    "facebook": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\"/>",
    "heart-pulse": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676a.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"/><path d=\"M3.22 13H9.5l.5-1l2 4.5l2-7l1.5 3.5h5.27\"/></g>",
    "instagram": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><rect width=\"20\" height=\"20\" x=\"2\" y=\"2\" rx=\"5\" ry=\"5\"/><path d=\"M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37m1.5-4.87h.01\"/></g>",
    "layout-dashboard": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\"/><rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\"/></g>",
    "linkedin": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z\"/><circle cx=\"4\" cy=\"4\" r=\"2\"/></g>",
    "lock": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/></g>",
    "loader": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 2v4m4.2 1.8l2.9-2.9M18 12h4m-5.8 4.2l2.9 2.9M12 18v4m-7.1-2.9l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9\"/>",
    "mail-open": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0z\"/><path d=\"m22 10l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10\"/></g>",
    "mail": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7\"/><rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/></g>",
    "map-pin": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/></g>",
    "menu": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 5h16M4 12h16M4 19h16\"/>",
    "minus": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12h14\"/>",
    "monitor-smartphone": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8m-2 4v-3.96v3.15M7 19h5\"/><rect width=\"6\" height=\"10\" x=\"16\" y=\"12\" rx=\"2\"/></g>",
    "phone": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233a14 14 0 0 0 6.392 6.384\"/>",
    "plus": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12h14m-7-7v14\"/>",
    "receipt-text": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13 16H8m6-8H8m8 4H8M4 3a1 1 0 0 1 1-1a1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1a1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2a1 1 0 0 1-1-1z\"/>",
    "search-x": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"m13.5 8.5l-5 5m0-5l5 5\"/><circle cx=\"11\" cy=\"11\" r=\"8\"/><path d=\"m21 21l-4.3-4.3\"/></g>",
    "send": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11zm7.318-19.539l-10.94 10.939\"/>",
    "shield-check": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12l2 2l4-4\"/></g>",
    "smile": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 14s1.5 2 4 2s4-2 4-2M9 9h.01M15 9h.01\"/></g>",
    "star": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z\"/>",
    "stethoscope": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M11 2v2M5 2v2m0-1H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1\"/><path d=\"M8 15a6 6 0 0 0 12 0v-3\"/><circle cx=\"20\" cy=\"10\" r=\"2\"/></g>",
    "train-front": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M8 3.1V7a4 4 0 0 0 8 0V3.1M9 15l-1-1m7 1l1-1\"/><path d=\"M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Zm-1 0l-2 3m10-3l2 3\"/></g>",
    "user-round": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"8\" r=\"5\"/><path d=\"M20 21a8 8 0 0 0-16 0\"/></g>",
    "users": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/></g>",
    "x": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M18 6L6 18M6 6l12 12\"/>",
    "x-brand": "<path d=\"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z\"/>",
    "chevron-down": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m6 9l6 6l6-6\"/>",
    "chevron-left": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m15 18l-6-6l6-6\"/>",
    "chevron-right": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m9 18l6-6l-6-6\"/>"
  };

  var CROSS_PATH = "M18 4h12v14h14v12H30v14H18V30H4V18h14V4Z";

  D.iconPaths = PATHS;

  /* Returns SVG markup for a named icon. `cls` adds utility classes. */
  D.icon = function (name, cls) {
    var body = PATHS[name] || PATHS["circle-alert"];
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (cls ? ' class="' + cls + '"' : "") +
      ">" + body + "</svg>"
    );
  };

  D.iconFilled = function (name, cls) {
    if (name !== "star" && name !== "x-brand") return D.icon(name, cls);
    var body = name === "star"
      ? PATHS.star.replace('fill="none"', 'fill="currentColor"')
      : PATHS["x-brand"];
    return (
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"' +
      (cls ? ' class="' + cls + '"' : "") +
      ">" + body + "</svg>"
    );
  };

  D.crossSvg = function (cls) {
    return (
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linejoin="round" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") +
      "><path d=\"" + CROSS_PATH + "\"/></svg>"
    );
  };

  /* Builds an icon-well span. */
  D.well = function (name, variant, size) {
    var cls = ["well"];
    if (variant) cls.push("well--" + variant);
    if (size) cls.push("well--" + size);
    return '<span class="' + cls.join(" ") + '">' + D.icon(name, "icon") + "</span>";
  };

  /* Fills [data-icon] elements, resolving CMS icon names with an index fallback. */
  D.paintIcons = function (root) {
    D.$$("[data-icon]", root).forEach(function (node) {
      var name = node.getAttribute("data-icon");
      if (node.getAttribute("data-icon-filled") === "true") {
        node.innerHTML = D.iconFilled(name, node.getAttribute("data-icon-class") || "");
      } else {
        node.innerHTML = D.icon(name, node.getAttribute("data-icon-class") || "");
      }
    });
  };

  /* ---------------------------- Scroll reveal ----------------------------- */

  D.reducedMotion = function () {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  var revealObserver = null;

  D.observeReveals = function (root) {
    var nodes = D.$$(".reveal, .reveal-stagger, .draw-line", root || document);
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window) || D.reducedMotion()) {
      nodes.forEach(function (node) { node.classList.add("is-in"); });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "-64px 0px -64px 0px", threshold: 0.01 }
      );
    }

    nodes.forEach(function (node) { revealObserver.observe(node); });
  };

  /* Animate a number from 0 to its target when it scrolls into view. */
  D.countUp = function (node) {
    var target = parseFloat(node.getAttribute("data-count"));
    var suffix = node.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;
    if (D.reducedMotion() || !("IntersectionObserver" in window)) {
      node.textContent = target + suffix;
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        var start = null;
        var duration = 1800;
        function frame(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          node.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      },
      { rootMargin: "-64px 0px" }
    );
    obs.observe(node);
  };

  /* -------------------------------- Toast --------------------------------- */

  var toastNode = null;
  var toastTimer = null;

  D.toast = function (message) {
    if (!toastNode) {
      toastNode = D.el("div", { class: "toast", role: "status" });
      document.body.appendChild(toastNode);
    }
    toastNode.innerHTML = D.icon("check-circle-2", "icon") + "<span></span>";
    toastNode.lastChild.textContent = message;
    toastNode.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastNode.classList.remove("is-visible");
    }, 3200);
  };

  /* ------------------------------ Accordion ------------------------------- */

  D.initAccordion = function (root) {
    if (root.dataset.accordionReady === "true") return;
    var triggers = D.$$(".accordion__trigger", root);
    if (!triggers.length) return;
    root.dataset.accordionReady = "true";

    function setOpen(trigger, open) {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if ((trigger.getAttribute("aria-expanded") === "true") === open) return;
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      if (!panel) return;
      panel.getAnimations().forEach(function (animation) { animation.cancel(); });
      if (open) {
        panel.hidden = false;
        var height = panel.scrollHeight;
        panel.animate(
          [{ height: "0px", opacity: 0 }, { height: height + "px", opacity: 1 }],
          { duration: D.reducedMotion() ? 0 : 400, easing: "cubic-bezier(.22,1,.36,1)" }
        );
      } else {
        var current = panel.scrollHeight;
        var anim = panel.animate(
          [{ height: current + "px", opacity: 1 }, { height: "0px", opacity: 0 }],
          { duration: D.reducedMotion() ? 0 : 300, easing: "cubic-bezier(.22,1,.36,1)" }
        );
        anim.onfinish = function () {
          if (trigger.getAttribute("aria-expanded") === "false") panel.hidden = true;
        };
      }
      var toggle = D.$(".accordion__toggle", trigger);
      if (toggle) toggle.innerHTML = D.icon(open ? "minus" : "plus", "icon--sm");
    }

    triggers.forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (panel) panel.hidden = trigger.getAttribute("aria-expanded") !== "true";
      D.on(trigger, "click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";
        triggers.forEach(function (other) {
          if (other !== trigger && other.getAttribute("aria-expanded") === "true") setOpen(other, false);
        });
        setOpen(trigger, !isOpen);
      });
    });
  };

  /* ------------------------------- Carousel ------------------------------- */

  D.initCarousel = function (root) {
    var viewport = D.$(".carousel", root);
    var track = D.$(".carousel__track", root);
    if (!viewport || !track) return;

    var slides = D.$$(".carousel__slide", track);
    var dots = D.$$(".carousel__dot", root);
    var prev = D.$("[data-carousel-prev]", root);
    var next = D.$("[data-carousel-next]", root);
    var index = 0;
    var step = 0;
    var maxShift = 0;

    function measure() {
      if (!slides.length) return;
      step = slides[0].offsetWidth;
      maxShift = Math.max(0, track.scrollWidth - viewport.clientWidth);
    }

    function apply() {
      var shift = Math.min(index * step, maxShift);
      track.style.transform = "translateX(" + -shift + "px)";
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      dots.forEach(function (dot, i) {
        dot.setAttribute("aria-current", i === index ? "true" : "false");
      });
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= slides.length - 1;
    }

    function go(nextIndex) {
      index = Math.max(0, Math.min(slides.length - 1, nextIndex));
      apply();
    }

    D.on(prev, "click", function () { go(index - 1); });
    D.on(next, "click", function () { go(index + 1); });
    dots.forEach(function (dot, i) {
      D.on(dot, "click", function () { go(i); });
    });

    window.addEventListener("resize", function () { measure(); apply(); });
    measure();
    apply();
  };

  /* --------------------------- Opening hours ------------------------------ */

  function parseHours(value) {
    var match = /^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/.exec(value.trim());
    if (!match) return null;
    return {
      open: parseInt(match[1], 10) * 60 + parseInt(match[2], 10),
      close: parseInt(match[3], 10) * 60 + parseInt(match[4], 10)
    };
  }
  D.parseHours = parseHours;

  D.initOpeningHours = function (root) {
    var list = D.$("[data-hours-list]", root);
    if (!list) return;
    var items = D.get("content.openingHours.items");
    var statusEl = D.$("[data-hours-status]", root);
    var now = new Date();
    var todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
    var minutes = now.getHours() * 60 + now.getMinutes();

    list.innerHTML = items
      .map(function (item, i) {
        var isToday = i === todayIndex;
        var range = parseHours(item.hours);
        var closed = !range;
        return (
          '<li class="hours__row' + (isToday ? " is-today" : "") + '">' +
          "<span>" + D.esc(item.day) + "</span>" +
          '<span class="flex gap-2 items-center">' +
          (isToday ? '<span class="hours__chip">Today</span>' : "") +
          '<span class="' + (closed ? "muted" : "") + '">' + D.esc(item.hours) + "</span>" +
          "</span></li>"
        );
      })
      .join("");

    var today = items[todayIndex];
    var todayRange = today ? parseHours(today.hours) : null;
    var open = todayRange ? minutes >= todayRange.open && minutes < todayRange.close : false;

    if (statusEl) {
      statusEl.className = "hours__status " + (open ? "hours__status--open" : "hours__status--closed");
      statusEl.textContent = open ? "Open now" : "Closed now";
    }
  };

  /* ------------------------------- Pickers -------------------------------- */

  function closeOnOutside(panel, trigger, onClose) {
    function handler(event) {
      if (panel.contains(event.target) || trigger.contains(event.target)) return;
      document.removeEventListener("pointerdown", handler);
      onClose();
    }
    document.addEventListener("pointerdown", handler);
    return handler;
  }

  /* Accessible listbox used for Department / Doctor / Visit type. */
  D.initSelect = function (root) {
    var trigger = D.$(".picker__trigger", root);
    var list = D.$$(".picker__option", root);
    if (!trigger || !list.length) return;

    var valueEl = D.$(".picker__value", trigger);
    var panel = D.$(".picker__panel", root);
    var selected = root.getAttribute("data-value") || "";
    var active = 0;

    list.forEach(function (option, i) {
      if (option.getAttribute("data-value") === selected) active = i;
    });

    function open() {
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      closeOnOutside(panel, trigger, close);
    }

    function close() {
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    function highlight(next) {
      active = (next + list.length) % list.length;
      list.forEach(function (option, i) { option.classList.toggle("is-active", i === active); });
      list[active].scrollIntoView({ block: "nearest" });
    }

    function choose(option) {
      selected = option.getAttribute("data-value");
      root.setAttribute("data-value", selected);
      valueEl.textContent = option.getAttribute("data-label") || option.textContent.trim();
      valueEl.classList.remove("is-placeholder");
      list.forEach(function (other) {
        other.setAttribute("aria-selected", other === option ? "true" : "false");
      });
      trigger.classList.add("is-set");
      close();
      root.dispatchEvent(new CustomEvent("picker:change", { bubbles: true, detail: { value: selected } }));
    }

    D.on(trigger, "click", function () {
      if (panel.hidden) { open(); highlight(active); } else close();
    });

    D.on(trigger, "keydown", function (event) {
      if (event.key === "Escape") { close(); return; }
      if (["ArrowDown", "ArrowUp", "Enter", " "].indexOf(event.key) === -1) return;
      event.preventDefault();
      if (panel.hidden) { open(); highlight(active); return; }
      if (event.key === "ArrowDown") highlight(active + 1);
      else if (event.key === "ArrowUp") highlight(active - 1);
      else choose(list[active]);
    });

    list.forEach(function (option, i) {
      D.on(option, "click", function () { choose(option); });
      D.on(option, "pointerenter", function () { highlight(i); });
    });

    close();
  };

  /* Calendar popover — Monday-first grid with full arrow-key support. */
  D.initDatePicker = function (root) {
    var trigger = D.$(".picker__trigger", root);
    if (!trigger) return;
    var valueEl = D.$(".picker__value", trigger);
    var panel = D.$(".picker__panel", root);
    var today = new Date();
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selected = "";

    function iso(date) {
      return date.getFullYear() + "-" + D.pad2(date.getMonth() + 1) + "-" + D.pad2(date.getDate());
    }

    function label(date) {
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    }

    function open() {
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      closeOnOutside(panel, trigger, close);
    }

    function close() {
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    function render() {
      var head = D.$("[data-cal-label]", panel);
      if (head) head.textContent = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });

      var grid = D.$("[data-cal-grid]", panel);
      var cells = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
        .map(function (d) { return '<div class="cal__dow">' + d + "</div>"; })
        .join("");

      var first = new Date(view.getFullYear(), view.getMonth(), 1);
      var offset = (first.getDay() + 6) % 7;
      var daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

      for (var i = 0; i < offset; i++) cells += "<div></div>";

      for (var day = 1; day <= daysInMonth; day++) {
        var date = new Date(view.getFullYear(), view.getMonth(), day);
        var past = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        var isToday = iso(date) === iso(today);
        var isSelected = iso(date) === selected;
        cells +=
          '<button type="button" class="cal__day' + (isToday ? " is-today" : "") + '"' +
          (past ? " disabled" : "") +
          ' data-iso="' + iso(date) + '"' +
          ' aria-selected="' + (isSelected ? "true" : "false") + '">' + day + "</button>";
      }

      if (grid) grid.innerHTML = cells;

      var prevBtn = D.$("[data-cal-prev]", panel);
      if (prevBtn) {
        prevBtn.disabled =
          view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
      }

      D.$$(".cal__day", grid).forEach(function (cell) {
        D.on(cell, "click", function () {
          selected = cell.getAttribute("data-iso");
          root.setAttribute("data-value", selected);
          valueEl.textContent = label(new Date(selected + "T00:00:00"));
          valueEl.classList.remove("is-placeholder");
          trigger.classList.add("is-set");
          close();
          trigger.focus();
          root.dispatchEvent(new CustomEvent("picker:change", { bubbles: true, detail: { value: selected } }));
        });
      });
    }

    function moveTo(date) {
      view = new Date(date.getFullYear(), date.getMonth(), 1);
      render();
    }

    D.on(D.$("[data-cal-prev]", panel), "click", function () {
      moveTo(new Date(view.getFullYear(), view.getMonth() - 1, 1));
    });
    D.on(D.$("[data-cal-next]", panel), "click", function () {
      moveTo(new Date(view.getFullYear(), view.getMonth() + 1, 1));
    });
    D.on(D.$("[data-cal-today]", panel), "click", function () {
      view = new Date(today.getFullYear(), today.getMonth(), 1);
      render();
    });
    D.on(trigger, "click", function () {
      if (panel.hidden) { open(); render(); } else close();
    });

    D.on(trigger, "keydown", function (event) {
      if (event.key === "Escape") { close(); return; }
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        if (panel.hidden) { event.preventDefault(); open(); render(); }
      }
    });

    close();
  };

  /* Time-slot popover. Slots come from clinic opening hours, 30-minute steps. */
  D.SLOT_PERIODS = [
    { label: "Morning", from: 8 * 60, to: 12 * 60 },
    { label: "Afternoon", from: 12 * 60, to: 17 * 60 },
    { label: "Evening", from: 17 * 60, to: 20 * 60 }
  ];

  D.slotsForDate = function (dateIso, booked) {
    if (!dateIso) {
      return D.SLOT_PERIODS.map(function (period) {
        return { label: period.label, slots: [] };
      }).filter(function (group) { return group.slots.length; });
    }
    var date = new Date(dateIso + "T00:00:00");
    var day = date.getDay();
    var range = null;
    if (day >= 1 && day <= 5) range = [8 * 60, 20 * 60];
    else if (day === 6) range = [9 * 60, 14 * 60];

    if (!range) return [];

    var groups = [];
    D.SLOT_PERIODS.forEach(function (period) {
      var slots = [];
      for (var m = Math.max(period.from, range[0]); m < Math.min(period.to, range[1]); m += 30) {
        var label = D.pad2(Math.floor(m / 60)) + ":" + D.pad2(m % 60);
        slots.push({ value: label, booked: !!(booked && booked.indexOf(label) !== -1) });
      }
      if (slots.length) groups.push({ label: period.label, slots: slots });
    });
    return groups;
  };

  D.initTimePicker = function (root) {
    var trigger = D.$(".picker__trigger", root);
    if (!trigger) return;
    var valueEl = D.$(".picker__value", trigger);
    var panel = D.$(".picker__panel", root);
    var contextEl = D.$("[data-slots-context]", panel);
    var bodyEl = D.$("[data-slots-body]", panel);
    var selected = "";
    var dateIso = "";

    function open() {
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      closeOnOutside(panel, trigger, close);
    }

    function close() {
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    function booked() {
      try {
        return JSON.parse(root.getAttribute("data-booked") || "[]");
      } catch {
        return [];
      }
    }

    function render() {
      var groups = D.slotsForDate(dateIso, booked());
      if (contextEl) {
        contextEl.textContent = dateIso
          ? new Date(dateIso + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
          : "Mon – Fri hours";
      }

      if (!groups.length) {
        var closed = dateIso && new Date(dateIso + "T00:00:00").getDay() === 0;
        bodyEl.innerHTML =
          '<div class="slots__empty">' +
          '<span class="well well--circle">' + D.icon("calendar-x", "icon") + "</span>" +
          "<p><b>" + (closed ? "We're closed on Sundays." : "No slots left for this day.") + "</b></p>" +
          "</div>";
        return;
      }

      bodyEl.innerHTML = groups
        .map(function (group) {
          return (
            '<div class="slots__group"><p class="slots__label">' + D.esc(group.label) + "</p>" +
            '<div class="slots__grid" role="listbox">' +
            group.slots
              .map(function (slot) {
                return (
                  '<button type="button" class="slot" role="option"' +
                  ' aria-selected="' + (slot.value === selected ? "true" : "false") + '"' +
                  (slot.booked ? " disabled" : "") +
                  ">" + slot.value + "</button>"
                );
              })
              .join("") +
            "</div></div>"
          );
        })
        .join("");

      D.$$(".slot", bodyEl).forEach(function (slot) {
        D.on(slot, "click", function () {
          selected = slot.textContent;
          root.setAttribute("data-value", selected);
          valueEl.textContent = selected;
          valueEl.classList.remove("is-placeholder");
          trigger.classList.add("is-set");
          D.$$(".slot", bodyEl).forEach(function (other) {
            other.setAttribute("aria-selected", other === slot ? "true" : "false");
          });
          close();
          trigger.focus();
          root.dispatchEvent(new CustomEvent("picker:change", { bubbles: true, detail: { value: selected } }));
        });
      });
    }

    D.on(trigger, "click", function () {
      if (panel.hidden) { open(); render(); } else close();
    });

    D.on(trigger, "keydown", function (event) {
      if (event.key === "Escape") { close(); return; }
      if (panel.hidden && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        open();
        render();
      }
    });

    D.on(root, "picker:date", function (event) {
      dateIso = event.detail.value;
      if (selected && D.slotsForDate(dateIso, booked()).every(function (g) {
        return g.slots.every(function (s) { return s.value !== selected || s.booked; });
      })) {
        selected = "";
        root.setAttribute("data-value", "");
        valueEl.textContent = valueEl.getAttribute("data-placeholder") || "No preference";
        valueEl.classList.add("is-placeholder");
        trigger.classList.remove("is-set");
      }
      if (!panel.hidden) render();
    });

    D.on(D.$("[data-slots-clear]", panel), "click", function () {
      selected = "";
      root.setAttribute("data-value", "");
      valueEl.textContent = valueEl.getAttribute("data-placeholder") || "No preference";
      valueEl.classList.add("is-placeholder");
      trigger.classList.remove("is-set");
      D.$$(".slot", bodyEl).forEach(function (slot) { slot.setAttribute("aria-selected", "false"); });
      close();
      root.dispatchEvent(new CustomEvent("picker:change", { bubbles: true, detail: { value: "" } }));
    });

    close();
  };

  /* ------------------------------ Bootstrap ------------------------------- */

  D.init = function () {
    /* 1. Page context first — post and legal renderers read from it. */
    if (D.page && D.page.mount) D.page.mount();

    /* 2. Chrome, then copy binding and data-driven blocks. */
    if (D.nav && D.nav.mount) D.nav.mount();
    if (D.bind) D.bind(document);
    if (D.sections && D.sections.run) D.sections.run(document);
    D.paintIcons(document);

    /* 3. Widgets that only exist after rendering. */
    D.$$("[data-carousel]").forEach(D.initCarousel);
    D.$$("[data-opening-hours]").forEach(D.initOpeningHours);
    D.$$("[data-count]").forEach(D.countUp);

    /* 4. Forms build their own pickers. */
    if (D.forms && D.forms.mount) D.forms.mount();

    /* 5. Anything added by the forms re-enters the pipeline. */
    D.$$("[data-accordion]").forEach(D.initAccordion);
    D.observeReveals(document);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", D.init);
  } else {
    D.init();
  }
})(window.DOCAVIA);
