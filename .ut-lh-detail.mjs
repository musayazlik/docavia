import lighthouse from "lighthouse";
import { chromium } from "playwright-core";
import http from "node:http";

const exe =
  process.env.HOME +
  "/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const browser = await chromium.launch({
  executablePath: exe,
  args: ["--remote-debugging-port=9223", "--no-first-run"],
});
const keepAlive = http.get("http://127.0.0.1:9223/json/version");

for (const path of ["/", "/doctors"]) {
  const result = await lighthouse(`http://localhost:3100${path}`, {
    port: 9223,
    output: "json",
    onlyCategories: ["performance", "accessibility"],
  });
  const lhr = result.lhr;
  console.log(`\n=== ${path} perf ${Math.round(lhr.categories.performance.score * 100)} a11y ${Math.round(lhr.categories.accessibility.score * 100)} ===`);
  const failed = Object.values(lhr.audits).filter(
    (a) => a.score !== null && a.score < 0.9 && !["accessibility"].includes(a.id),
  );
  for (const a of failed) {
    console.log(`  [${a.scoreDisplayMode}] ${a.id}: ${a.score} — ${a.title?.slice(0, 70)}`);
    if (a.details?.items?.length) {
      for (const item of a.details.items.slice(0, 4)) {
        const url = item.url || item.source || "";
        const wasted = item.wastedBytes ? ` ${(item.wastedBytes / 1024).toFixed(0)}KB` : "";
        const ms = item.wastedMs ? ` ${item.wastedMs.toFixed(0)}ms` : "";
        console.log(`      ${String(url).slice(0, 110)}${wasted}${ms}`);
      }
    }
  }
  // a11y failures on home
  if (path === "/") {
    const a11y = Object.values(lhr.audits).filter(
      (a) => a.score !== null && a.score < 1 && lhr.categories.accessibility.auditRefs?.some((r) => r.id === a.id),
    );
    for (const a of a11y) {
      console.log(`  A11Y ${a.id}: ${a.score} — ${a.title?.slice(0, 60)}`);
    }
  }
}

keepAlive.destroy();
await browser.close();
process.exit(0);
