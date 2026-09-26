/* ===========================================================================
   Docavia — page context
   Resolves which page we are on and publishes what the page-specific
   renderers need: the active blog post, the active legal document, and the
   comment seed for the current post.
   =========================================================================== */

window.DOCAVIA = window.DOCAVIA || {};

(function (D) {
  "use strict";

  function file() {
    var path = window.location.pathname.split("/").pop();
    return !path || path === "" ? "index.html" : path;
  }

  function slugFromHash() {
    var hash = window.location.hash.replace(/^#/, "");
    return hash ? decodeURIComponent(hash) : "";
  }

  function mount() {
    var name = file();
    D.page = D.page || {};
    D.page.file = name;

    if (name === "post.html") {
      var slug = slugFromHash() || "improve-your-heart-health";
      var post = D.postBySlug(slug) || D.posts[0];
      D.page.currentSlug = post.slug;
      D.page.currentPost = post;
      D.comments = (D.seedComments[post.slug] || []).slice();
    }

    if (name === "privacy-policy.html") {
      D.page.legal = D.legal.privacy;
    }
    if (name === "terms-of-service.html") {
      D.page.legal = D.legal.terms;
    }

    /* The post header is metadata-heavy, so it is bound by path. */
    if (name === "post.html" && D.page.currentPost) {
      var post = D.page.currentPost;
      var description = document.querySelector('meta[name="description"]');
      document.title = post.title + " — Docavia";
      if (description) description.setAttribute("content", post.description);

      D.$$("[data-post-field]").forEach(function (node) {
        var field = node.getAttribute("data-post-field");
        if (field === "category") node.textContent = post.category;
        if (field === "title") node.textContent = post.title;
        if (field === "excerpt") node.textContent = post.description;
        if (field === "image") {
          node.setAttribute("src", post.image);
          node.setAttribute("alt", post.title);
        }
        if (field === "date") {
          node.textContent = post.date;
          node.setAttribute("datetime", post.publishedAt);
        }
        if (field === "readingTime") node.textContent = post.readingTime + " min read";
        if (field === "authorName") node.textContent = post.author.name;
        if (field === "authorRole") node.textContent = post.author.role;
        if (field === "authorAvatar") {
          node.setAttribute("src", post.author.avatar);
          node.setAttribute("alt", "Portrait of " + post.author.name);
        }
        if (field === "authorBio") node.textContent = post.author.bio;
        if (field === "crumb") node.textContent = post.title;
      });
    }
  }

  D.page = { mount: mount };

  /* post.html is one template driven by the hash — swap content in place
     instead of forcing a full reload when the reader follows a related link. */
  function rerender() {
    if (file() !== "post.html") return;
    mount();
    if (D.sections && D.sections.run) D.sections.run(document);
    D.paintIcons(document);
    if (D.forms && D.forms.mountComments) D.forms.mountComments(document);
    D.observeReveals(document);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  window.addEventListener("hashchange", rerender);
})(window.DOCAVIA);
