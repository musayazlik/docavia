import { chromium } from "playwright-core";

const exe = process.env.HOME + "/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage();
let logged = false;
for (let attempt = 0; attempt < 3 && !logged; attempt++) {
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.fill("input[type=email]", "admin@docavia.com");
  await page.fill("input[type=password]", "docavia2026");
  await page.click("button[type=submit]");
  try {
    await page.waitForURL(/\/admin/, { timeout: 10000 });
    logged = page.url().includes("/admin");
  } catch {}
}
if (!logged) { console.error("no login"); process.exit(1); }
const cookies = await page.context().cookies("http://localhost:3000");
await browser.close();
console.log(cookies.map((c) => `${c.name}=${c.value}`).join("; "));
