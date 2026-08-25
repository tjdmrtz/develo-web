// E2E: page scroll must work with the pointer over the visualization canvas.
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
  const base = process.argv[2];
  if (!base) {
    console.error("usage: node e2e_scroll.js <baseUrl>");
    process.exit(2);
  }
  const executablePath = findChrome();
  if (!executablePath) {
    console.error("SKIP: no Chrome");
    process.exit(0);
  }
  const browser = await puppeteer.launch({
    executablePath,
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
    const section = await page.waitForSelector("[data-llm-viz]", { timeout: 10000 });
    await section.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForSelector("[data-llm-canvas]", { timeout: 10000 });
    const canvasBox = await page.$eval("[data-llm-canvas]", (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.move(canvasBox.x, canvasBox.y);
    await page.mouse.wheel({ deltaY: 400 });
    await new Promise((r) => setTimeout(r, 300));
    const after = await page.evaluate(() => window.scrollY);
    if (!(after > before)) {
      throw new Error(`scroll over canvas failed: ${before} -> ${after}`);
    }
    const defaultPrevented = await page.evaluate(() => {
      let prevented = false;
      const canvas = document.querySelector("[data-llm-canvas]");
      const ev = new WheelEvent("wheel", { deltaY: 80, bubbles: true, cancelable: true });
      canvas.dispatchEvent(ev);
      prevented = ev.defaultPrevented;
      return prevented;
    });
    if (defaultPrevented) {
      throw new Error("wheel defaultPrevented on canvas");
    }
    if (errors.length) {
      throw new Error("page errors: " + errors.join(" | "));
    }
    console.log("OK: scroll over canvas", before, "->", after);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
