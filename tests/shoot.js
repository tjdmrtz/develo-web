// Deterministic screenshots: usage: node shoot.js <url> <width> <height> <out.png>
// Uses the system Chrome via puppeteer-core with an explicit 1:1 viewport,
// so the captured viewport matches the requested CSS pixel size exactly.
"use strict";

const puppeteer = require("puppeteer-core");
const { execSync } = require("child_process");

function findChrome() {
  for (const name of ["google-chrome", "chromium", "chromium-browser"]) {
    try {
      return execSync(`which ${name}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    } catch {
      /* keep looking */
    }
  }
  return null;
}

(async () => {
  const [url, w, h, out] = process.argv.slice(2);
  if (!url || !out) {
    console.error("usage: node shoot.js <url> <width> <height> <out.png>");
    process.exit(2);
  }
  const executablePath = findChrome();
  if (!executablePath) {
    console.error("no system Chrome/Chromium found");
    process.exit(1);
  }
  const browser = await puppeteer.launch({
    executablePath,
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: Number(w || 1440), height: Number(h || 900), deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.screenshot({ path: out });
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
