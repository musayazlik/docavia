/* TEMP: full-page screenshots of the static prototype (reveals pre-triggered). */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4321";
const OUT = "/tmp/docavia-shots";
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["index", "static-site/index.html"],
  ["about", "static-site/about.html"],
  ["services", "static-site/services.html"],
  ["doctors", "static-site/doctors.html"],
  ["blog", "static-site/blog.html"],
  ["post", "static-site/post.html#improve-your-heart-health"],
  ["appointment", "static-site/appointment.html"],
  ["contact", "static-site/contact.html"],
  ["login", "static-site/login.html"],
  ["privacy", "static-site/privacy-policy.html"],
  ["terms", "static-site/terms-of-service.html"]
];

const browser = await chromium.launch({ channel: "chrome" });

for (const [name, path] of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/${path}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    const step = 600;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log("shot", name);
  await page.close();
}

for (const [name, path] of [["m-index", "static-site/index.html"], ["m-appointment", "static-site/appointment.html"]]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/${path}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    const step = 500;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log("shot", name);
  await page.close();
}

await browser.close();
