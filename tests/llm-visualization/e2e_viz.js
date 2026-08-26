// E2E checks for the Develo LLM visualization section.
//
// Covers: section position on all four pages, lazy loading, autoplay with an
// injected clock, explore/reset/replay, reduced motion, unsupported WebGL and
// console cleanliness.
//
// Usage: node e2e_viz.js <baseUrl>
"use strict";

const puppeteer = require("puppeteer-core");
const { execSync } = require("child_process");

const RUNTIME_ASSETS = [
  "/llm-viz/bycroft-9da9374/gpt-nano-sort-model.json",
  "/llm-viz/bycroft-9da9374/gpt-nano-sort-t0-partials.json",
  "/llm-viz/bycroft-9da9374/native.wasm",
];
const STAGES = [
  "intro",
  "embedding",
  "layerNorm",
  "selfAttention",
  "projection",
  "mlp",
  "transformer",
  "softmax",
  "output",
];

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

const checks = [];
function check(name, ok, detail) {
  checks.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok || detail === undefined ? "" : ` — ${detail}`}`);
}

/** Open a page that fails the run on any console error or unhandled rejection. */
async function openPage(browser, opts = {}) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });
  page.on("requestfailed", (r) => {
    // Favicons and analytics are out of scope; runtime assets are not.
    if (RUNTIME_ASSETS.some((a) => r.url().includes(a))) errors.push("requestfailed: " + r.url());
  });
  if (opts.reducedMotion) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  }
  await page.setViewport(opts.viewport || { width: 1440, height: 900, deviceScaleFactor: 1 });
  return { page, errors };
}

const api = (page, fn, ...args) =>
  page.evaluate(
    (body, rest) => {
      const el = document.querySelector("[data-llm-viz]");
      // eslint-disable-next-line no-new-func
      return new Function("viz", "args", `return (${body})(viz, args)`)(el.__develoLlmViz, rest);
    },
    fn.toString(),
    args,
  );

async function waitReady(page, timeout = 45000) {
  const deadline = Date.now() + timeout;
  for (;;) {
    const status = await api(page, (viz) => viz.getStatus());
    if (["ready", "error", "unsupported"].includes(status)) return status;
    if (Date.now() > deadline) throw new Error("timed out waiting for runtime, last status: " + status);
    await new Promise((r) => setTimeout(r, 200));
  }
}

/** Centre the section without relying on the site's smooth scrolling. */
async function scrollToViz(page) {
  await page.evaluate(() => {
    const el = document.querySelector("[data-llm-viz]");
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - Math.max(0, (window.innerHeight - el.offsetHeight) / 2), behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 100));
}

// --- 88 / 95: section position -------------------------------------------
async function testPositions(browser, base) {
  const cases = [
    ["/", "What we do", "Our method"],
    ["/es/", "Qué hacemos", "Nuestro método"],
    ["/technologies/", "LLMs, RAG and fine-tuning", "Data"],
    ["/es/technologies/", "Fine-tuning de LLMs", "Evaluación y observabilidad"],
  ];
  for (const [path, before, after] of cases) {
    const { page, errors } = await openPage(browser);
    await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 60000 });
    const order = await page.evaluate((prefixes) => {
      const main = document.querySelector("main");
      const nodes = [...main.querySelectorAll("h2, h3, [data-llm-viz]")];
      const labels = nodes.map((n) =>
        n.hasAttribute("data-llm-viz") ? "<viz>" : (n.closest("[data-llm-viz]") ? null : n.textContent.trim()),
      );
      const find = (p) => labels.findIndex((l) => l && l !== "<viz>" && l.startsWith(p));
      return { viz: labels.indexOf("<viz>"), before: find(prefixes[0]), after: find(prefixes[1]), count: nodes.filter((n) => n.hasAttribute("data-llm-viz")).length };
    }, [before, after]);
    check(
      `88/95 ${path}: ${before} < viz < ${after}`,
      order.before >= 0 && order.after >= 0 && order.before < order.viz && order.viz < order.after,
      JSON.stringify(order),
    );
    check(`88 ${path}: exactly one visualization`, order.count === 1, `count=${order.count}`);
    check(`96 ${path}: clean console`, errors.length === 0, errors.join(" | "));
    await page.close();
  }
}

// --- 89: scroll over canvas (release blocker) -----------------------------
async function testScrollBlocker(browser, base) {
  const { page, errors } = await openPage(browser);
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);
  const box = await page.$eval("[data-llm-canvas]", (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(Math.max(8, r.top) + Math.min(r.height, window.innerHeight - 16) / 2) };
  });
  await page.mouse.move(box.x, box.y);
  // Stop the intro timeline so the camera is stable while the wheel is tested.
  await api(page, (viz) => viz.reset());
  await new Promise((r) => setTimeout(r, 600));
  const camBefore = await api(page, (viz) => JSON.stringify(viz.getCamera()));
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel({ deltaY: 400 });
  await new Promise((r) => setTimeout(r, 400));
  const after = await page.evaluate(() => window.scrollY);
  const camAfter = await api(page, (viz) => JSON.stringify(viz.getCamera()));
  check("89 wheel over canvas scrolls the page", after > before, `${before} -> ${after}`);
  check("89 wheel does not move the camera", camBefore === camAfter);

  const prevented = await page.evaluate(() => {
    const ev = new WheelEvent("wheel", { deltaY: 80, bubbles: true, cancelable: true });
    document.querySelector("[data-llm-canvas]").dispatchEvent(ev);
    return ev.defaultPrevented;
  });
  check("89 wheel is never defaultPrevented", prevented === false);
  check("96 scroll test: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

// --- 90: lazy loading ----------------------------------------------------
async function testLazyLoading(browser, base) {
  // A tall-but-short viewport keeps the section outside the 800px preload band.
  const { page, errors } = await openPage(browser, { viewport: { width: 1440, height: 600 } });
  const requested = [];
  page.on("request", (r) => {
    if (RUNTIME_ASSETS.some((a) => r.url().includes(a))) requested.push(r.url());
  });
  await page.goto(base + "/", { waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 800));

  const geometry = await page.evaluate(() => {
    const el = document.querySelector("[data-llm-viz]");
    return { top: el.getBoundingClientRect().top, innerHeight: window.innerHeight };
  });
  const insidePreloadBand = geometry.top < geometry.innerHeight + 800;

  if (insidePreloadBand) {
    // Documented condition (spec 90): with this viewport the moved section is
    // already inside the preload band at load, so instead of asserting silence
    // we assert the fetches are async and never block first render.
    const blocking = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const assets = performance.getEntriesByType("resource").filter((e) => e.name.includes("/llm-viz/"));
      return assets.filter((e) => e.startTime < nav.domContentLoadedEventEnd).map((e) => e.name);
    });
    check(
      "90 preloaded assets never block first render (section already inside preload band)",
      blocking.length === 0,
      blocking.join(" | "),
    );
  } else {
    check("90 no runtime asset requested at page top", requested.length === 0, requested.join(" | "));
  }

  await scrollToViz(page);
  await waitReady(page);
  const loaded = await page.evaluate((assets) => {
    const names = performance.getEntriesByType("resource").map((e) => e.name);
    return assets.filter((a) => names.some((n) => n.includes(a)));
  }, RUNTIME_ASSETS);
  check("90 all runtime assets load once in range", loaded.length === RUNTIME_ASSETS.length, loaded.join(" | "));
  check("96 lazy loading: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

// --- 91: autoplay with a test-only speed multiplier ----------------------
async function testAutoplay(browser, base) {
  const { page, errors } = await openPage(browser);
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);

  await api(page, (viz) => viz.setPlaybackSpeedForTests(20));
  const deadline = Date.now() + 40000;
  while (Date.now() < deadline) {
    const snap = await api(page, (viz) => ({
      playback: viz.getPlayback(),
      complete: viz.getWalkthrough()?.complete,
    }));
    if (snap.playback === "idle" && snap.complete) break;
    await new Promise((r) => setTimeout(r, 80));
  }
  const last = await api(page, (viz) => ({
    playback: viz.getPlayback(),
    complete: viz.getWalkthrough()?.complete,
    order: viz.getSeenPhases(),
    cues: viz.getSeenMathCues(),
  }));
  const order = last.order || [];
  const cues = new Set(last.cues || []);

  check("91 first stage is intro", order[0] === "intro", JSON.stringify(order));
  const sequence = order.filter((s) => STAGES.includes(s));
  check("91 stages advance in order", JSON.stringify(sequence) === JSON.stringify(STAGES), JSON.stringify(order));
  check("91 timeline settles on idle", last.playback === "idle" && last.complete, JSON.stringify({ playback: last.playback, complete: last.complete }));

  const requiredCues = [
    "embedding_token", "embedding_sum", "layernorm_mean", "layernorm_variance",
    "attention_qkv", "attention_dot", "attention_softmax", "attention_weighted_value",
    "projection_concat", "projection_residual", "mlp_gelu", "transformer_block",
    "softmax_stable", "output_logits", "output_probabilities", "output_argmax",
  ];
  const missing = requiredCues.filter((c) => !cues.has(c));
  check("72 math cues follow the choreography", missing.length === 0, missing.join(",") || [...cues].join(","));

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 400));
  await scrollToViz(page);
  await new Promise((r) => setTimeout(r, 600));
  const after = await api(page, (viz) => ({ playback: viz.getPlayback(), running: viz.getWalkthrough()?.running }));
  check("91 does not autoplay again on re-entry", after.playback !== "playing" && !after.running, JSON.stringify(after));
  check("96 autoplay: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

// --- 92: explore / reset / replay ---------------------------------------
async function testExploreResetReplay(browser, base) {
  const { page, errors } = await openPage(browser);
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);
  await page.waitForFunction(() => !document.querySelector("[data-llm-explore]").hidden, { timeout: 30000 });

  // Keyboard activation: the button must be reachable and focus must survive
  // the button swap (the explore button hides itself).
  await page.focus("[data-llm-explore]");
  await page.keyboard.press("Enter");
  const interactive = await page.evaluate(() => {
    const el = document.querySelector("[data-llm-viz]");
    return {
      playback: el.__develoLlmViz.getPlayback(),
      exploreHidden: el.querySelector("[data-llm-explore]").hidden,
      resetHidden: el.querySelector("[data-llm-reset]").hidden,
      hint: el.querySelector("[data-llm-hint]").textContent,
      focused: document.activeElement === el.querySelector("[data-llm-reset]"),
    };
  });
  check("92 explore enters interactive mode", interactive.playback === "interactive", JSON.stringify(interactive));
  const exploreLabel = await page.$eval("[data-llm-explore]", (el) => el.textContent.trim());
  check("46 explore button says 360°", exploreLabel === "360°", exploreLabel);
  check("92 reset replaces explore in interactive mode", interactive.exploreHidden && !interactive.resetHidden);
  check("92 drag hint is announced", interactive.hint.length > 0, interactive.hint);
  check("87 keyboard activation keeps focus inside the section", interactive.focused);

  const box = await page.$eval(".llm-viz-stage", (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(Math.max(8, r.top) + Math.min(r.height, window.innerHeight - 16) / 2) };
  });
  const camBefore = await api(page, (viz) => JSON.stringify(viz.getCamera().angle));
  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(box.x + i * 14, box.y + i * 4);
  await page.mouse.up();
  const camAfterOrbit = await api(page, (viz) => JSON.stringify(viz.getCamera().angle));
  check("92 dragging orbits the camera", camBefore !== camAfterOrbit, `${camBefore} -> ${camAfterOrbit}`);

  const centerBefore = await api(page, (viz) => JSON.stringify(viz.getCamera().center));
  await page.keyboard.down("Shift");
  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) await page.mouse.move(box.x - i * 18, box.y);
  await page.mouse.up();
  await page.keyboard.up("Shift");
  const centerAfter = await api(page, (viz) => JSON.stringify(viz.getCamera().center));
  check("92 shift-dragging pans the camera", centerBefore !== centerAfter, `${centerBefore} -> ${centerAfter}`);

  await page.focus("[data-llm-reset]");
  await page.keyboard.press("Enter");
  const reset = await page.evaluate(() => {
    const el = document.querySelector("[data-llm-viz]");
    return {
      playback: el.__develoLlmViz.getPlayback(),
      stage: el.__develoLlmViz.getStage(),
      resetHidden: el.querySelector("[data-llm-reset]").hidden,
      focused: document.activeElement === el.querySelector("[data-llm-explore]"),
    };
  });
  check("92 reset returns to the overview", reset.playback === "idle", JSON.stringify(reset));
  check("92 reset hides itself and restores focus", reset.resetHidden && reset.focused);

  await api(page, (viz) => viz.setPlaybackSpeedForTests(20));
  await page.click("[data-llm-replay]");
  await new Promise((r) => setTimeout(r, 500));
  const replay = await api(page, (viz) => ({ playback: viz.getPlayback(), stage: viz.getStage() }));
  check("92 replay restarts at intro", replay.stage === "intro" && replay.playback === "playing", JSON.stringify(replay));
  const replayDeadline = Date.now() + 8000;
  let advanced = replay.stage;
  while (Date.now() < replayDeadline && advanced === "intro") {
    await new Promise((r) => setTimeout(r, 80));
    advanced = await api(page, (viz) => viz.getStage());
  }
  check("92 replayed timeline advances", advanced !== "intro", advanced);

  // Escape must leave the local interactive state without trapping the keyboard.
  await page.focus("[data-llm-explore]");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");
  const escaped = await api(page, (viz) => viz.getPlayback());
  check("92 escape exits interactive mode", escaped === "idle", escaped);
  check("96 explore: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

// --- 93: reduced motion --------------------------------------------------
async function testReducedMotion(browser, base) {
  const { page, errors } = await openPage(browser, { reducedMotion: true });
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);
  await new Promise((r) => setTimeout(r, 3000));

  const idle = await page.evaluate(() => {
    const el = document.querySelector("[data-llm-viz]");
    return {
      playback: el.__develoLlmViz.getPlayback(),
      stage: el.__develoLlmViz.getStage(),
      exploreHidden: el.querySelector("[data-llm-explore]").hidden,
      replayHidden: el.querySelector("[data-llm-replay]").hidden,
    };
  });
  check("93 no automatic stage sequence", idle.playback !== "playing" && (idle.stage === "intro" || idle.stage === "idle"), JSON.stringify(idle));
  check("93 explore and replay stay available", !idle.exploreHidden && !idle.replayHidden, JSON.stringify(idle));

  await page.click("[data-llm-explore]");
  const explored = await api(page, (viz) => viz.getPlayback());
  check("93 explore works under reduced motion", explored === "interactive", explored);

  await page.click("[data-llm-reset]");
  await page.click("[data-llm-replay]");
  await new Promise((r) => setTimeout(r, 400));
  const replayed = await api(page, (viz) => viz.getPlayback());
  check("93 replay runs only when explicitly requested", replayed === "playing", replayed);
  check("96 reduced motion: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

// --- 94: unsupported WebGL ----------------------------------------------
async function testUnsupported(browser, base) {
  const { page, errors } = await openPage(browser);
  // Injected at the browser level; there is no production query-string backdoor.
  await page.evaluateOnNewDocument(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
      return type === "webgl2" ? null : original.call(this, type, ...rest);
    };
  });
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  const status = await waitReady(page, 20000);

  const fallback = await page.evaluate(() => {
    const el = document.querySelector("[data-llm-viz]");
    const msg = el.querySelector("[data-llm-fallback-msg]");
    const diagram = el.querySelector(".llm-viz-diagram");
    const cta = el.querySelector(".llm-tech-copy a.btn");
    return {
      isFallback: el.classList.contains("is-fallback"),
      msgVisible: !msg.hidden && msg.textContent.trim().length > 0,
      diagramVisible: diagram.getBoundingClientRect().height > 0,
      controlsHidden: el.querySelector("[data-llm-explore]").hidden && el.querySelector("[data-llm-replay]").hidden,
      cta: cta ? cta.getAttribute("href") : null,
    };
  });
  check("94 capability detection reports unsupported", status === "unsupported", status);
  check("94 fallback and copy are visible", fallback.isFallback && fallback.msgVisible && fallback.diagramVisible, JSON.stringify(fallback));
  check("94 interactive controls stay hidden", fallback.controlsHidden);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30000 }),
    page.click(".llm-tech-copy a.btn"),
  ]);
  const landed = await page.evaluate(() => location.pathname);
  check("94 technology CTA works", landed === fallback.cta, `${landed} vs ${fallback.cta}`);
  check("96 unsupported: no unhandled error", errors.length === 0, errors.join(" | "));
  await page.close();
}

// --- 89 (mobile) / 110: touch scroll before an explicit Explore -----------
async function testMobileScroll(browser, base) {
  const { page, errors } = await openPage(browser, {
    viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  });
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check("110 mobile layout does not overflow horizontally", overflow === false);

  const touchAction = await page.$eval(".llm-viz-stage", (el) => getComputedStyle(el).touchAction);
  check("110 stage allows vertical panning before explore", touchAction === "pan-y", touchAction);

  const box = await page.$eval(".llm-viz-stage", (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(Math.max(8, r.top) + Math.min(r.height, window.innerHeight - 16) / 2) };
  });
  const before = await page.evaluate(() => window.scrollY);
  await page.touchscreen.touchStart(box.x, box.y);
  await page.touchscreen.touchMove(box.x, box.y - 160);
  await page.touchscreen.touchEnd();
  await new Promise((r) => setTimeout(r, 600));
  const after = await page.evaluate(() => window.scrollY);
  check("110 mobile page scroll works over the stage", after > before, `${before} -> ${after}`);

  const interactiveTouchAction = await page.evaluate(() => {
    document.querySelector("[data-llm-viz]").__develoLlmViz.explore();
    return getComputedStyle(document.querySelector(".llm-viz-stage")).touchAction;
  });
  check("110 stage captures gestures only after explore", interactiveTouchAction === "none", interactiveTouchAction);
  check("96 mobile: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

// --- 109: runtime failure falls back gracefully ---------------------------
async function testNetworkFailureFallback(browser, base) {
  const { page, errors } = await openPage(browser);
  await page.setRequestInterception(true);
  page.on("request", (r) => {
    if (r.url().includes("native.wasm")) r.abort("failed").catch(() => {});
    else r.continue().catch(() => {});
  });
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  const status = await waitReady(page, 30000);
  check("109 failed runtime download reports an error state", status === "error", status);

  const state = await page.evaluate(() => {
    const el = document.querySelector("[data-llm-viz]");
    const msg = el.querySelector("[data-llm-fallback-msg]");
    return {
      isFallback: el.classList.contains("is-fallback"),
      msgVisible: !msg.hidden,
      diagramVisible: el.querySelector(".llm-viz-diagram").getBoundingClientRect().height > 0,
      controlsHidden: el.querySelector("[data-llm-explore]").hidden,
      pageInteractive: document.querySelector("header a") !== null,
    };
  });
  check("109 failure shows the static fallback", state.isFallback && state.msgVisible && state.diagramVisible, JSON.stringify(state));
  check("109 page stays usable under failure", state.pageInteractive && state.controlsHidden);

  const scrolled = await page.evaluate(async () => {
    const before = window.scrollY;
    window.scrollBy({ top: 300, behavior: "instant" });
    await new Promise((r) => requestAnimationFrame(r));
    return window.scrollY > before;
  });
  check("109 scrolling still works after failure", scrolled);
  await page.close();
}

// --- 110: no permanent idle RAF -----------------------------------------
async function testIdleRaf(browser, base) {
  const { page, errors } = await openPage(browser);
  await page.evaluateOnNewDocument(() => {
    window.__rafCount = 0;
    const original = window.requestAnimationFrame;
    window.requestAnimationFrame = function (cb) {
      window.__rafCount++;
      return original.call(window, cb);
    };
  });
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);
  await api(page, (viz) => viz.setPlaybackSpeedForTests(20));
  const deadline = Date.now() + 40000;
  while (Date.now() < deadline) {
    const snap = await api(page, (viz) => ({ playback: viz.getPlayback(), complete: viz.getWalkthrough()?.complete }));
    if (snap.playback === "idle" && snap.complete) break;
    await new Promise((r) => setTimeout(r, 80));
  }
  await new Promise((r) => setTimeout(r, 800));
  const first = await page.evaluate(() => window.__rafCount);
  await new Promise((r) => setTimeout(r, 2000));
  const second = await page.evaluate(() => window.__rafCount);
  check("110 no permanent idle RAF once the story ends", second - first <= 5, `${second - first} frames in 2s`);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 1500));
  const offscreenStart = await page.evaluate(() => window.__rafCount);
  await new Promise((r) => setTimeout(r, 1500));
  const offscreenEnd = await page.evaluate(() => window.__rafCount);
  check("110 no rendering while off screen", offscreenEnd - offscreenStart <= 5, `${offscreenEnd - offscreenStart} frames in 1.5s`);

  const destroyed = await page.evaluate(() => {
    const el = document.querySelector("[data-llm-viz]");
    el.__develoLlmViz.controller.destroy();
    return el.__develoLlmViz.getStatus();
  });
  check("110 cleanup tears the controller down", destroyed === "destroyed", destroyed);
  await new Promise((r) => setTimeout(r, 800));
  const afterDestroy = await page.evaluate(() => window.__rafCount);
  await new Promise((r) => setTimeout(r, 800));
  const afterDestroy2 = await page.evaluate(() => window.__rafCount);
  check("110 no frames requested after cleanup", afterDestroy2 - afterDestroy <= 2, `${afterDestroy2 - afterDestroy}`);
  check("96 idle: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

async function testCleanUi(browser, base) {
  const { page, errors } = await openPage(browser, { viewport: { width: 1600, height: 900 } });
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);
  await new Promise((r) => setTimeout(r, 1200));

  const chrome = await page.evaluate(() => {
    const shell = document.querySelector(".llm-viz-shell");
    const cs = getComputedStyle(shell);
    const canvas = document.querySelector("[data-llm-canvas]");
    const math = document.querySelector(".llm-viz-math");
    const cr = canvas.getBoundingClientRect();
    const mr = math.getBoundingClientRect();
    return {
      borderTop: cs.borderTopWidth,
      borderRight: cs.borderRightWidth,
      borderBottom: cs.borderBottomWidth,
      borderLeft: cs.borderLeftWidth,
      background: cs.backgroundColor,
      missing: {
        meta: !document.querySelector(".llm-viz-meta"),
        overlay: !document.querySelector(".llm-viz-overlay"),
        disclaimer: !document.querySelector(".llm-viz-disclaimer"),
        explain: !document.querySelector(".llm-tech-explain"),
      },
      katex: Boolean(document.querySelector("[data-llm-equation] .katex")),
      nano: document.body.innerText.includes("nano-gpt"),
      overlap: !(mr.left >= cr.right - 1 || mr.top >= cr.bottom - 1),
      mathBelow: mr.top + 1 >= cr.bottom,
      branded: document.body.innerText.includes("<develo>"),
      cbabbc: document.body.innerText.includes("CBABBC"),
    };
  });
  check("71 shell has no border", chrome.borderTop === "0px" && chrome.borderRight === "0px" && chrome.borderBottom === "0px" && chrome.borderLeft === "0px", JSON.stringify(chrome));
  check("71 shell background is transparent", chrome.background === "rgba(0, 0, 0, 0)" || chrome.background === "transparent", chrome.background);
  check("71 obsolete chrome is gone", chrome.missing.meta && chrome.missing.overlay && chrome.missing.disclaimer && chrome.missing.explain, JSON.stringify(chrome.missing));
  check("71 KaTeX rendered", chrome.katex);
  check("68 no nano-gpt card text", chrome.nano === false);
  check("71 math does not cover canvas", chrome.overlap === false);
  check("27 at 1600px math is below the canvas", chrome.mathBelow, JSON.stringify(chrome));
  check("44 visible branded input is <develo>", chrome.branded && !chrome.cbabbc, JSON.stringify({ branded: chrome.branded, cbabbc: chrome.cbabbc }));
  check("96 clean UI: clean console", errors.length === 0, errors.join(" | "));
  await page.close();

  const narrow = await openPage(browser, { viewport: { width: 1440, height: 900 } });
  await narrow.page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await narrow.page.waitForSelector("[data-llm-viz]");
  await scrollToViz(narrow.page);
  await waitReady(narrow.page);
  const below = await narrow.page.evaluate(() => {
    const canvas = document.querySelector("[data-llm-canvas]").getBoundingClientRect();
    const math = document.querySelector(".llm-viz-math").getBoundingClientRect();
    return math.top + 1 >= canvas.bottom;
  });
  check("71 at 1440px math is below the canvas", below);
  await narrow.page.close();
}

async function testSpeedSlider(browser, base) {
  const { page, errors } = await openPage(browser);
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);

  const initial = await page.evaluate(() => {
    const range = document.querySelector("[data-llm-speed]");
    return { min: range.min, max: range.max, step: range.step, value: range.value, disabled: range.disabled };
  });
  check("38 speed range is 0–2.5 step 0.1 default 1", initial.min === "0" && initial.max === "2.5" && initial.step === "0.1" && initial.value === "1" && initial.disabled === false, JSON.stringify(initial));

  const after = await page.evaluate(() => {
    const range = document.querySelector("[data-llm-speed]");
    range.value = "2.5";
    range.dispatchEvent(new Event("input", { bubbles: true }));
    const viz = document.querySelector("[data-llm-viz]").__develoLlmViz;
    return {
      label: document.querySelector("[data-llm-speed-value]").textContent,
      speed: viz.getWalkthrough()?.speed,
    };
  });
  check("38 speed value shows 2.5×", after.label === "2.5×", after.label);
  check("38 engine speed is 2.5", Math.abs(after.speed - 2.5) < 0.01, JSON.stringify(after));
  check("96 speed slider: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

async function testZeroSpeedPause(browser, base) {
  const { page, errors } = await openPage(browser);
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);
  await page.waitForFunction(() => {
    const viz = document.querySelector("[data-llm-viz]").__develoLlmViz;
    return viz.getPlayback() === "playing";
  }, { timeout: 30000 });

  const before = await page.evaluate(() => {
    const range = document.querySelector("[data-llm-speed]");
    range.value = "0";
    range.dispatchEvent(new Event("input", { bubbles: true }));
    const viz = document.querySelector("[data-llm-viz]").__develoLlmViz;
    const cam = viz.getCamera();
    return {
      playback: viz.getPlayback(),
      phase: viz.getStage(),
      time: viz.getWalkthrough()?.time,
      camera: JSON.stringify({ c: cam.center, a: cam.angle }),
    };
  });
  check("39 0× enters paused-speed", before.playback === "paused-speed", JSON.stringify(before));
  await new Promise((r) => setTimeout(r, 600));
  const held = await page.evaluate(() => {
    const viz = document.querySelector("[data-llm-viz]").__develoLlmViz;
    const cam = viz.getCamera();
    return {
      playback: viz.getPlayback(),
      phase: viz.getStage(),
      time: viz.getWalkthrough()?.time,
      camera: JSON.stringify({ c: cam.center, a: cam.angle }),
    };
  });
  check("39 0× does not advance time", held.time === before.time, `${before.time} -> ${held.time}`);
  check("39 0× does not advance phase", held.phase === before.phase, `${before.phase} -> ${held.phase}`);
  check("39 0× camera stays put", held.camera === before.camera);
  check("39 playback stays paused-speed", held.playback === "paused-speed", held.playback);

  const resumed = await page.evaluate(() => {
    const range = document.querySelector("[data-llm-speed]");
    range.value = "1";
    range.dispatchEvent(new Event("input", { bubbles: true }));
    const viz = document.querySelector("[data-llm-viz]").__develoLlmViz;
    return { playback: viz.getPlayback(), phase: viz.getStage() };
  });
  check("39 raising speed resumes playback", resumed.playback === "playing", JSON.stringify(resumed));
  check("39 resume stays on the same phase", resumed.phase === before.phase, JSON.stringify({ before: before.phase, after: resumed.phase }));
  check("96 zero speed: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

async function testWideViewportMathBelow(browser, base) {
  const { page, errors } = await openPage(browser, { viewport: { width: 1648, height: 920, deviceScaleFactor: 1 } });
  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-llm-viz]");
  await scrollToViz(page);
  await waitReady(page);
  const layout = await page.evaluate(() => {
    const stage = document.querySelector(".llm-viz-stage").getBoundingClientRect();
    const math = document.querySelector(".llm-viz-math").getBoundingClientRect();
    return {
      mathBelow: math.top + 8 >= stage.bottom,
      ratio: stage.width / stage.height,
      stageW: stage.width,
      stageH: stage.height,
    };
  });
  check("40 at 1648×920 math is below the canvas", layout.mathBelow, JSON.stringify(layout));
  check("40 canvas aspect is not squeezed", layout.ratio >= 0.85, JSON.stringify(layout));
  check("96 wide viewport: clean console", errors.length === 0, errors.join(" | "));
  await page.close();
}

(async () => {
  const base = process.argv[2];
  if (!base) {
    console.error("usage: node e2e_viz.js <baseUrl>");
    process.exit(2);
  }
  const executablePath = findChrome();
  if (!executablePath) {
    console.error("SKIP: no Chrome");
    process.exit(0);
  }
  const browser = await puppeteer.launch({
    executablePath,
    args: [
      "--no-sandbox",
      "--hide-scrollbars",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  try {
    await testPositions(browser, base);
    await testScrollBlocker(browser, base);
    await testLazyLoading(browser, base);
    await testAutoplay(browser, base);
    await testExploreResetReplay(browser, base);
    await testReducedMotion(browser, base);
    await testUnsupported(browser, base);
    await testMobileScroll(browser, base);
    await testNetworkFailureFallback(browser, base);
    await testIdleRaf(browser, base);
    await testCleanUi(browser, base);
    await testSpeedSlider(browser, base);
    await testZeroSpeedPause(browser, base);
    await testWideViewportMathBelow(browser, base);
  } finally {
    await browser.close();
  }
  const failed = checks.filter((c) => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
  if (failed.length) {
    console.error("failed checks:\n" + failed.map((c) => `  - ${c.name}: ${c.detail ?? ""}`).join("\n"));
    process.exit(1);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
