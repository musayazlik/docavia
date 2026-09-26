import lighthouse from "lighthouse";
import { chromium } from "playwright-core";
import http from "node:http";

const exe =
  process.env.HOME +
  "/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const BASE = "http://localhost:3100";

// Launch Chrome with the debugging port Lighthouse needs (headless shell
// supports --remote-debugging-port; regular headless mode is fine here).
const browser = await chromium.launch({
  executablePath: exe,
  args: ["--remote-debugging-port=9222", "--no-first-run", "--no-default-browser-check"],
});
// keep-alive request so Chrome does not idle-close
const keepAlive = http.get("http://127.0.0.1:9222/json/version");

const flags = { port: 9222, output: "json", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] };

const pages = ["/", "/services", "/doctors", "/blog", "/contact", "/appointment"];
let worst = Infinity;
for (const page of pages) {
  const result = await lighthouse(`${BASE}${page}`, flags, undefined);
  const lhr = result.lhr;
  const scores = Object.entries(lhr.categories)
    .map(([key, cat]) => `${key.slice(0, 4)} ${Math.round(cat.score * 100)}`)
    .join("  ");
  const perf = lhr.categories.performance.score * 100;
  if (perf < worst) worst = perf;
  console.log(`${page.padEnd(14)} ${scores}`);
}
console.log("worst performance:", Math.round(worst));

keepAlive.destroy();
await browser.close();
process.exit(0);
