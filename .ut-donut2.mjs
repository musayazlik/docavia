import { chromium } from "playwright-core";

const exe = process.env.HOME + "/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.fill("input[type=email]", "admin@docavia.com");
await page.fill("input[type=password]", "docavia2026");
await page.click("button[type=submit]");
await page.waitForURL("**/admin", { timeout: 20000 });
await page.waitForTimeout(2400);

const stroke = await page.evaluate(() => {
  const svg = [...document.querySelectorAll("svg")].find((s) => s.querySelector('circle[r="72"]'));
  const c = svg?.querySelectorAll("circle")[1];
  return c ? getComputedStyle(c).stroke : "missing";
});
console.log("published arc stroke:", stroke);
await page.screenshot({ path: "/tmp/ut-dash3.png" });
await browser.close();
