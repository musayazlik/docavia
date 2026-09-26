/* Headless smoke test for the static Docavia prototype.
   Serve the REPO ROOT (the pages live in static-site/),
   then: node scripts/check-static.mjs [pages...]
   Loads each page in Chrome, collects console errors and failed requests, and
   reports the rendered height so an empty page is obvious. */

import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://127.0.0.1:4321";
const ROOT = "static-site/";
const ALL = [
  "index.html",
  "about.html",
  "services.html",
  "doctors.html",
  "blog.html",
  "post.html#improve-your-heart-health",
  "appointment.html",
  "contact.html",
  "login.html",
  "privacy-policy.html",
  "terms-of-service.html"
];

const pages = process.argv.slice(2).length ? process.argv.slice(2) : ALL;

/* login.html is a full-viewport auth shell: no site navbar, no site footer. */
const STANDALONE = new Set(["login.html"]);

const browser = await chromium.launch({ channel: "chrome" });
let failures = 0;

for (const target of pages) {
  const page = await browser.newPage();
  const problems = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push("console: " + msg.text());
  });
  page.on("pageerror", (err) => problems.push("pageerror: " + err.message));
  page.on("requestfailed", (req) => problems.push("request: " + req.url()));
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push("http " + res.status() + ": " + res.url());
  });

  await page.goto(`${BASE}/${ROOT}${target}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  const info = await page.evaluate(() => ({
    height: document.body.scrollHeight,
    nav: !!document.querySelector(".site-header"),
    footer: !!document.querySelector(".site-footer"),
    unfilled: Array.from(document.querySelectorAll("[data-bind]"))
      .filter((n) => !n.textContent.trim())
      .map((n) => n.getAttribute("data-bind")),
    emptySlots: Array.from(document.querySelectorAll("[data-render]"))
      .filter((n) => !n.children.length)
      .map((n) => n.getAttribute("data-render"))
  }));

  const bare = STANDALONE.has(target.split("#")[0]);
  const bad = [];
  if (!bare && info.height < 1500) bad.push(`suspiciously short (${info.height}px)`);
  if (bare && info.height < 500) bad.push(`suspiciously short (${info.height}px)`);
  if (!info.nav && !bare) bad.push("no header");
  if (!info.footer && !bare) bad.push("no footer");
  if (info.unfilled.length) bad.push("unbound: " + info.unfilled.join(", "));
  if (info.emptySlots.length) bad.push("empty slot: " + info.emptySlots.join(", "));

  if (bad.length || problems.length) failures++;
  console.log(
    `${bad.length || problems.length ? "FAIL" : "ok  "}  ${target.padEnd(38)} ${String(info.height).padStart(6)}px` +
      (bad.length ? "\n        " + bad.join("\n        ") : "") +
      (problems.length ? "\n        " + problems.slice(0, 6).join("\n        ") : "")
  );

  await page.close();
}

await browser.close();
process.exit(failures ? 1 : 0);
