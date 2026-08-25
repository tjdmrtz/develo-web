// End-to-end browser checks for the generated local website.
"use strict";

const assert = require("assert");
const puppeteer = require("puppeteer-core");

const base = process.argv[2];
assert.ok(base, "usage: node browser_check.js <base-url>");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  const failures = [];
  page.on("requestfailed", (request) => {
    if (request.url().startsWith(base)) failures.push(request.url());
  });

  try {
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(base + "/", { waitUntil: "networkidle0", timeout: 60000 });

    assert.ok(await page.$$eval(".floating-plane", (els) => els.length >= 16));
    const motionBefore = await page.$$eval(".floating-plane[data-motion]", (els) =>
      els.map((el) => getComputedStyle(el).transform));
    const redBefore = await page.$$eval(".floating-plane.orange", (els) =>
      els.map((el) => getComputedStyle(el).transform));
    const hero = await page.$("[data-spatial-hero]");
    const heroBox = await hero.boundingBox();
    await page.mouse.move(heroBox.x + heroBox.width * 0.83, heroBox.y + heroBox.height * 0.18);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const motionAfter = await page.$$eval(".floating-plane[data-motion]", (els) =>
      els.map((el) => getComputedStyle(el).transform));
    const redAfter = await page.$$eval(".floating-plane.orange", (els) =>
      els.map((el) => getComputedStyle(el).transform));
    assert.ok(motionAfter.some((value, index) => value !== motionBefore[index]),
      "blue hero planes should react to pointer movement");
    assert.deepStrictEqual(redAfter, redBefore, "red hero planes should stay fixed");

    await page.click("[data-nav-toggle]");
    assert.ok(await page.$eval("[data-nav-menu]", (el) => el.classList.contains("open")));
    assert.strictEqual(await page.$eval("[data-nav-toggle]", (el) => el.getAttribute("aria-expanded")), "true");
    await new Promise((resolve) => setTimeout(resolve, 350));
    const menuLayout = await page.$eval("[data-nav-menu]", (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const links = Array.from(el.querySelectorAll("a")).map((link) => {
        const linkRect = link.getBoundingClientRect();
        return {
          top: linkRect.top,
          bottom: linkRect.bottom,
          color: getComputedStyle(link).color,
        };
      });
      return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        background: style.backgroundColor,
        opacity: style.opacity,
        links,
      };
    });
    assert.ok(menuLayout.top <= 0 && menuLayout.left <= 0);
    assert.ok(menuLayout.right >= 1440 && menuLayout.bottom >= 900,
      `menu must cover the viewport: ${JSON.stringify(menuLayout)}`);
    assert.strictEqual(menuLayout.background, "rgb(5, 5, 5)");
    assert.strictEqual(menuLayout.opacity, "1");
    assert.ok(menuLayout.links.every((link) => link.top >= 0 && link.bottom <= 900),
      "all menu links must remain on the opaque overlay");
    await page.keyboard.press("Escape");
    assert.ok(!(await page.$eval("[data-nav-menu]", (el) => el.classList.contains("open"))));

    await page.goto(base + "/solutions/", { waitUntil: "networkidle0", timeout: 60000 });
    const cardGaps = await page.$$eval(".card", (cards) => cards.slice(0, 8).map((card) => {
      const title = card.querySelector("h3");
      const body = card.querySelector("p");
      if (!title || !body) return 0;
      return body.getBoundingClientRect().top - title.getBoundingClientRect().bottom;
    }));
    assert.ok(cardGaps.every((gap) => gap <= 32),
      `card headings and copy must stay visually grouped: ${cardGaps.join(", ")}`);

    await page.goto(base + "/solutions/d-ialog/", { waitUntil: "networkidle0", timeout: 60000 });
    const breadcrumbColor = await page.$eval(".breadcrumbs [aria-current]", (el) => getComputedStyle(el).color);
    assert.strictEqual(breadcrumbColor, "rgb(216, 64, 14)");

    const flowBefore = await page.$eval("[data-product-showcase]", (showcase) => {
      const nextSection = showcase.closest(".content-block").nextElementSibling;
      return {
        showcaseHeight: showcase.getBoundingClientRect().height,
        nextTop: nextSection.getBoundingClientRect().top + window.scrollY,
      };
    });
    const productBefore = await page.$$eval(".product-shot-visual", (els) => els.map((el) => el.getBoundingClientRect().width));
    const secondShot = await page.$(".product-shot-secondary");
    await page.$eval(".product-shot-secondary", (el) => el.scrollIntoView({ block: "center" }));
    await new Promise((resolve) => setTimeout(resolve, 150));
    await secondShot.hover();
    await new Promise((resolve) => setTimeout(resolve, 750));
    const productAfter = await page.$$eval(".product-shot-visual", (els) => els.map((el) => el.getBoundingClientRect().width));
    const flowAfter = await page.$eval("[data-product-showcase]", (showcase) => {
      const nextSection = showcase.closest(".content-block").nextElementSibling;
      return {
        showcaseHeight: showcase.getBoundingClientRect().height,
        nextTop: nextSection.getBoundingClientRect().top + window.scrollY,
      };
    });
    assert.ok(productAfter[1] > productBefore[1] * 1.2,
      `the second d-ialog screen should expand smoothly: ${productBefore} -> ${productAfter}`);
    assert.ok(productAfter[0] < productBefore[0] * 0.9,
      `the first d-ialog screen should make room: ${productBefore} -> ${productAfter}`);
    assert.ok(await page.$eval(".product-shot-secondary", (el) => el.matches(":hover")),
      "the stationary hover target must remain active while its visual layer moves");
    assert.ok(Math.abs(flowAfter.showcaseHeight - flowBefore.showcaseHeight) < 1,
      `hover must not change showcase height: ${JSON.stringify({ flowBefore, flowAfter })}`);
    assert.ok(Math.abs(flowAfter.nextTop - flowBefore.nextTop) < 1,
      `the section below d-ialog must stay fixed: ${JSON.stringify({ flowBefore, flowAfter })}`);
    const productUrl = page.url();
    await page.click(".product-shot-secondary .product-screen");
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.strictEqual(page.url(), productUrl, "product screenshots must not navigate when clicked");

    await page.goto(base + "/es/solutions/d-ialog/", { waitUntil: "networkidle0", timeout: 60000 });
    await page.click("[data-nav-toggle]");
    const spanishMenu = await page.$eval("[data-nav-menu]", (menu) => ({
      text: menu.textContent,
      internalLinks: Array.from(menu.querySelectorAll('a[href^="/"]:not([hreflang])')).map((a) => a.getAttribute("href")),
    }));
    assert.ok(spanishMenu.text.includes("Soluciones") && spanishMenu.text.includes("Casos de éxito"));
    assert.ok(spanishMenu.internalLinks.every((href) => href.startsWith("/es/")));
    await page.keyboard.press("Escape");

    await page.$eval("[data-reveal]:last-of-type", (el) => el.scrollIntoView());
    await new Promise((resolve) => setTimeout(resolve, 900));
    assert.ok(await page.$eval("[data-reveal]:last-of-type", (el) => el.classList.contains("is-visible")));
    assert.ok(await page.evaluate(() => document.fonts.check('12px "Azeret Mono"')));

    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.goto(base + "/", { waitUntil: "networkidle0", timeout: 60000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));

    await page.goto(base + "/solutions/d-ialog/", { waitUntil: "networkidle0", timeout: 60000 });
    const mobileProduct = await page.$$eval(".product-shot", (els) => els.map((el) => ({
      width: el.getBoundingClientRect().width,
      transform: getComputedStyle(el).transform,
    })));
    assert.ok(Math.abs(mobileProduct[0].width - mobileProduct[1].width) < 2,
      `mobile product screens should use equal, readable rows: ${JSON.stringify(mobileProduct)}`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));

    await page.goto(base + "/contact/", { waitUntil: "networkidle0", timeout: 60000 });
    assert.ok(await page.$("form[data-contact-form]"));
    assert.strictEqual(await page.$eval("form[data-contact-form]", (form) => form.checkValidity()), false);
    assert.deepStrictEqual(failures, [], "all local resources should load");
    console.log("OK: browser interactions, motion, fonts and responsive layout");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
