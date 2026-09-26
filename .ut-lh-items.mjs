import lighthouse from "lighthouse";
import { chromium } from "playwright-core";

const exe =
  process.env.HOME +
  "/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const browser = await chromium.launch({
  executablePath: exe,
  args: ["--remote-debugging-port=9222", "--no-first-run"],
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const AUDITS_OF_INTEREST = [
  "target-size",
  "errors-in-console",
  "image-aspect-ratio",
  "image-size-responsive",
  "label-content-name-mismatch",
];

for (const path of ["/doctors", "/blog"]) {
  const result = await lighthouse(`http://localhost:3100${path}`, {
    port: 9222,
    output: "json",
    onlyCategories: ["accessibility", "best-practices"],
  });
  const lhr = result.lhr;
  console.log(`\n=== ${path} ===`);
  for (const id of AUDITS_OF_INTEREST) {
    const a = lhr.audits[id];
    if (!a || a.score === null || a.score >= 1) continue;
    console.log(`  [${id}]`);
    for (const item of (a.details?.items ?? []).slice(0, 6)) {
      const node = item.node;
      const label = node?.snippet ?? JSON.stringify(item).slice(0, 120);
      console.log(`    ${label.slice(0, 160)}`);
    }
  }
  await sleep(1500);
}

await browser.close();
process.exit(0);
