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

async function run(path, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const result = await lighthouse(`http://localhost:3100${path}`, {
      port: 9222,
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });
    const lhr = result.lhr;
    const perf = lhr.categories.performance.score;
    if (perf !== null && perf > 0) return lhr;
    console.log(`  ${path} attempt ${i + 1} failed: ${lhr.runtimeError?.code}`);
    await sleep(3000);
  }
  return null;
}

for (const path of ["/", "/services", "/doctors", "/blog", "/contact", "/appointment"]) {
  const lhr = await run(path);
  if (!lhr) {
    console.log(`${path.padEnd(13)} FAILED after retries`);
    continue;
  }
  const s = Object.entries(lhr.categories)
    .map(([k, c]) => `${k.slice(0, 4)} ${Math.round(c.score * 100)}`)
    .join("  ");
  console.log(`${path.padEnd(13)} ${s}`);

  // print any audit scoring <0.9 with a real score
  for (const a of Object.values(lhr.audits)) {
    if (a.score !== null && a.score < 0.9) {
      console.log(`    ${a.id} (${a.scoreDisplayMode}) ${a.title?.slice(0, 60)}`);
    }
  }
  await sleep(2000);
}

await browser.close();
process.exit(0);
