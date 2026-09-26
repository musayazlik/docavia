import { chromium } from "playwright-core";

const exe =
  process.env.HOME +
  "/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });

let logged = false;
for (let attempt = 0; attempt < 3 && !logged; attempt++) {
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.fill("input[type=email]", "admin@docavia.com");
  await page.fill("input[type=password]", "docavia2026");
  await page.click("button[type=submit]");
  try {
    await page.waitForURL(/\/admin/, { timeout: 10000 });
    logged = true;
  } catch {
    console.log("attempt", attempt + 1, "failed");
  }
}
if (!logged) {
  console.error("could not log in");
  process.exit(1);
}

await page.goto("http://localhost:3000/admin/content/site", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.getByText("Social media", { exact: true }).first().scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/ut-site-settings.png" });
console.log("table shot done");

await page.getByRole("button", { name: /Add social link/i }).click();
await page.waitForSelector("[role=dialog]");
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/ut-site-add.png" });
console.log("dialog shot done");

await browser.close();
