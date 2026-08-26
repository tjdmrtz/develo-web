import { LLM_VIZ_ASSET_BASE, fetchJsonAsset } from "./assets.js";
import { detectLlmVizCapabilities, isLlmVizSupported } from "./capabilities.js";
import { getLlmVizDpr } from "./dpr.js";
import { WALKTHROUGH_PHASES } from "./timeline.js";
import { COPY } from "./i18n.js";
import { createBrowserClock } from "./clock.js";
import { homeCamera } from "./cameraHome.js";
import { getCurrentTokenProbabilities } from "./probabilities.js";
import { MATH_CUES } from "./mathCues.js";
import { renderLlmMath } from "./mathRenderer.js";

/**
 * True when a button activation came from the keyboard: synthetic clicks from
 * Enter/Space report `detail === 0`, and browsers only focus buttons on click
 * on some platforms. Mouse users must not have focus moved for them.
 */
function wasKeyboardActivation(ev, button) {
  if (!ev) return false;
  return ev.detail === 0 || document.activeElement === button;
}

export class DeveloLlmVizController {
  constructor(root, options = {}) {
    this.root = root;
    this.lang = options.lang || root.getAttribute("data-lang") || "en";
    this.variant = options.variant || root.getAttribute("data-variant") || "home";
    this.copy = COPY[this.lang] || COPY.en;
    this.clock = options.clock || createBrowserClock();
    this.detectCapabilities = options.detectCapabilities || detectLlmVizCapabilities;
    this.engineLoader = options.engineLoader || (() => import("./engine.js"));

    this.status = "static";
    this.playback = "stopped";
    this.destroyed = false;
    this.visible = false;
    this.intersectionRatio = 0;
    this.inPreload = false;
    this.loadStarted = false;
    this.autoplayDone = false;
    this.userInteracted = false;
    this.timelinePlaying = false;
    this.pointerInteracting = false;
    this.dirty = true;
    this.rafId = null;
    this.wasPlayingBeforeHidden = false;
    this.completeAt = null;
    this.returningHome = false;
    this.homeLerp = null;
    this.lastMathCue = null;
    this.lastProbabilitySignature = null;
    this.mathRenderSeq = 0;
    this.seenPhases = [];
    this.seenMathCues = [];
    this.abort = null;
    this.engine = null;
    this.progState = null;
    this.canvas = root.querySelector("[data-llm-canvas]");
    this.hintEl = root.querySelector("[data-llm-hint]");
    this.equationEl = root.querySelector("[data-llm-equation]");
    this.mathValuesEl = root.querySelector("[data-llm-math-values]");
    this.shell = root.querySelector(".llm-viz-stage");
    this.exploreBtn = root.querySelector("[data-llm-explore]");
    this.resetBtn = root.querySelector("[data-llm-reset]");
    this.replayBtn = root.querySelector("[data-llm-replay]");
    this.progressItems = [...root.querySelectorAll("[data-llm-progress-item]")];
    this.reducedMotion = false;
    this.resizeObserver = null;
    this.intersectionObserver = null;
    this.mediaQuery = null;
    this.lastBacking = { w: 0, h: 0 };
    this.activePointerId = null;
    this.dragMode = null;
    this.lastPointer = null;
    this.pinchStart = null;

    this.onVisibility = this.onVisibility.bind(this);
    this.onMotionChange = this.onMotionChange.bind(this);
    this.loop = this.loop.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.bindUi();
    this.bindLifecycle();
    this.exposeTestApi();
  }

  bindUi() {
    this.exploreBtn?.addEventListener("click", (ev) => this.explore(ev));
    this.resetBtn?.addEventListener("click", (ev) => this.reset(ev));
    this.replayBtn?.addEventListener("click", () => this.replay());
    this.shell?.addEventListener("pointerdown", this.onPointerDown);
    // Scoped to the section: the feature must not add document-global key listeners.
    this.root.addEventListener("keydown", this.onKeyDown);
    this.setControls("passive");
  }

  bindLifecycle() {
    if (typeof window !== "undefined" && window.matchMedia) {
      this.mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.reducedMotion = this.mediaQuery.matches;
      if (this.mediaQuery.addEventListener) this.mediaQuery.addEventListener("change", this.onMotionChange);
      else if (this.mediaQuery.addListener) this.mediaQuery.addListener(this.onMotionChange);
    }
    document.addEventListener("visibilitychange", this.onVisibility);

    this.intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      this.intersectionRatio = entry.intersectionRatio;
      // rootMargin already expands the trigger area by the 800px preload band.
      if (entry.isIntersecting && !this.loadStarted) this.beginLoad();
      if (entry.intersectionRatio >= 0.3) {
        this.visible = true;
        if (this.progState) this.progState.visible = true;
        this.maybeAutoplay();
        if (this.playback === "paused-viewport") this.resumePlayback();
        this.markDirty();
      } else if (entry.intersectionRatio < 0.1) {
        this.visible = false;
        if (this.progState) this.progState.visible = false;
        if (this.playback === "playing") this.pausePlayback("paused-viewport");
      }
    }, { root: null, rootMargin: "800px 0px", threshold: [0, 0.1, 0.3, 0.75] });

    this.intersectionObserver.observe(this.root);

    if (typeof ResizeObserver !== "undefined" && this.canvas) {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.shell || this.canvas);
    }
  }

  onMotionChange() {
    this.reducedMotion = Boolean(this.mediaQuery && this.mediaQuery.matches);
    if (this.progState) this.progState.reducedMotion = this.reducedMotion;
    if (this.reducedMotion && this.playback === "playing") {
      this.pausePlayback("idle");
      if (this.engine && this.progState) this.engine.pauseDeveloWalkthrough(this.progState);
    }
  }

  onVisibility() {
    if (document.visibilityState !== "visible") {
      this.wasPlayingBeforeHidden = this.playback === "playing";
      if (this.playback === "playing") this.pausePlayback("paused-page-hidden");
      return;
    }
    if (this.wasPlayingBeforeHidden && this.intersectionRatio >= 0.3 && this.playback !== "interactive") {
      this.resumePlayback();
    }
  }

  async beginLoad() {
    if (this.loadStarted || this.destroyed) return;
    this.loadStarted = true;
    this.status = "preloading";
    this.abort = new AbortController();
    try {
      const caps = this.detectCapabilities();
      if (!isLlmVizSupported(caps)) {
        this.showFallback("unsupported");
        return;
      }
      this.status = "initializing";
      const engine = await this.engineLoader();
      if (this.destroyed) return;
      this.engine = engine;

      const [modelJson, partialsJson, fontAtlasData, native] = await Promise.all([
        fetchJsonAsset(`${LLM_VIZ_ASSET_BASE}/gpt-nano-sort-model.json`, this.abort.signal),
        fetchJsonAsset(`${LLM_VIZ_ASSET_BASE}/gpt-nano-sort-t0-partials.json`, this.abort.signal),
        engine.fetchFontAtlasData(this.abort.signal),
        engine.loadNativeBindings(this.abort.signal),
      ]);
      if (this.destroyed) return;

      const TensorF32 = engine.TensorF32;
      function toTensorSet(raw) {
        const set = { config: raw.config };
        for (const k of Object.keys(raw)) {
          if (raw[k] && raw[k].shape) set[k] = TensorF32.fromJson(raw[k]);
          else set[k] = raw[k];
        }
        return set;
      }
      const model = toTensorSet(modelJson);
      const data = toTensorSet(partialsJson);

      this.progState = engine.initProgramState(this.canvas, fontAtlasData);
      if (!this.progState.render) {
        this.showFallback("unsupported");
        return;
      }
      this.progState.markDirty = () => this.markDirty();
      this.progState.reducedMotion = this.reducedMotion;
      this.progState.native = native;
      this.progState.wasmGptModel = engine.constructModel(model, model.config, native);
      this.progState.jsGptModel = engine.createGpuModelForWasm(this.progState.render.gl, model.config);
      this.progState.gptGpuModel = engine.initModel(this.progState.render, { data, model, native }, 1);

      this.resize();
      this.applyHomeCamera(true);
      engine.runProgram({ time: this.clock.now(), dt: 16, markDirty: () => this.markDirty() }, this.progState);
      this.root.classList.add("is-ready");
      this.status = "ready";
      this.updateWalkthroughUi({ phase: null, mathCue: "idle", complete: false, running: false });
      this.setControls("passive");
      this.maybeAutoplay();
      this.markDirty();
    } catch (error) {
      console.error("[llm-viz] initialization failed", error);
      this.showFallback("error");
    }
  }

  showFallback(kind) {
    this.status = kind === "unsupported" ? "unsupported" : "error";
    this.root.classList.add("is-fallback");
    this.root.classList.remove("is-ready");
    const note = this.root.querySelector("[data-llm-fallback-msg]");
    if (note) note.hidden = false;
  }

  maybeAutoplay() {
    if (this.status !== "ready") return;
    if (this.reducedMotion) return;
    if (this.autoplayDone) return;
    if (this.userInteracted) return;
    if (this.intersectionRatio < 0.3) return;
    this.startWalkthrough();
    this.autoplayDone = true;
  }

  startWalkthrough() {
    if (!this.engine || !this.progState) return;
    this.completeAt = null;
    this.returningHome = false;
    this.homeLerp = null;
    this.timelinePlaying = true;
    this.playback = "playing";
    this.progState.interactive = false;
    this.engine.startDeveloWalkthrough(this.progState);
    this.setControls("playing");
    this.markDirty();
  }

  pausePlayback(next) {
    this.timelinePlaying = false;
    this.playback = next;
    if (this.engine && this.progState) this.engine.pauseDeveloWalkthrough(this.progState);
    this.markDirty();
  }

  resumePlayback() {
    if (!this.engine || !this.progState) return;
    const snap = this.engine.getDeveloWalkthroughSnapshot(this.progState);
    if (snap.complete) return;
    this.engine.startDeveloWalkthrough(this.progState);
    this.timelinePlaying = true;
    this.playback = "playing";
    this.markDirty();
  }

  explore(ev) {
    const fromKeyboard = wasKeyboardActivation(ev, this.exploreBtn);
    this.userInteracted = true;
    this.timelinePlaying = false;
    this.playback = "interactive";
    if (this.engine && this.progState) this.engine.pauseDeveloWalkthrough(this.progState);
    if (this.progState) this.progState.interactive = true;
    this.setControls("interactive");
    this.shell?.classList.add("is-interactive");
    if (fromKeyboard) this.resetBtn?.focus();
    this.markDirty();
  }

  reset(ev) {
    const fromKeyboard = wasKeyboardActivation(ev, this.resetBtn);
    this.cancelPointer();
    this.userInteracted = true;
    this.timelinePlaying = false;
    this.playback = "idle";
    this.completeAt = null;
    this.returningHome = false;
    this.homeLerp = null;
    this.shell?.classList.remove("is-interactive");
    if (this.engine && this.progState) this.engine.pauseDeveloWalkthrough(this.progState);
    if (this.progState) {
      this.progState.interactive = false;
      this.progState.display.hoverTarget = null;
    }
    this.applyHomeCamera();
    this.updateWalkthroughUi({ phase: null, mathCue: "idle", complete: true, running: false });
    this.setControls("passive");
    if (fromKeyboard) this.exploreBtn?.focus();
    this.markDirty();
  }

  replay() {
    this.cancelPointer();
    this.shell?.classList.remove("is-interactive");
    this.userInteracted = false;
    this.autoplayDone = true;
    if (this.engine && this.progState) {
      this.progState.interactive = false;
      this.progState.generatedLength = 0;
      if (this.progState.wasmGptModel && this.progState.jsGptModel) {
        this.engine.resetWasmModelInput(this.progState.wasmGptModel, this.progState.jsGptModel);
      } else if (this.progState.jsGptModel) {
        this.progState.jsGptModel.inputLen = 6;
      }
      this.engine.resetDeveloWalkthrough(this.progState);
    }
    this.lastMathCue = null;
    this.lastProbabilitySignature = null;
    this.seenPhases = [];
    this.seenMathCues = [];
    this.startWalkthrough();
  }

  applyHomeCamera(immediate) {
    if (!this.engine || !this.progState) return;
    const cam = homeCamera(this.engine.Vec3);
    if (immediate) {
      this.progState.camera.center = cam.center;
      this.progState.camera.angle = cam.angle;
      this.progState.camera.desiredCamera = undefined;
      this.progState.camera.desiredCameraTransition = undefined;
    } else {
      this.progState.camera.desiredCamera = cam;
    }
  }

  finishWalkthroughIfNeeded(snapshot) {
    if (!snapshot || !snapshot.complete || this.playback !== "playing") return;
    if (this.completeAt == null) this.completeAt = this.clock.now();
    this.timelinePlaying = false;
    this.autoplayDone = true;
    if (this.clock.now() - this.completeAt < 1000) return;
    if (this.returningHome) return;
    this.returningHome = true;
    const cam = this.progState.camera;
    this.homeLerp = {
      start: this.clock.now(),
      fromCenter: { x: cam.center.x, y: cam.center.y, z: cam.center.z },
      fromAngle: { x: cam.angle.x, y: cam.angle.y, z: cam.angle.z },
    };
  }

  tickHomeReturn() {
    if (!this.returningHome || !this.homeLerp || !this.engine || !this.progState) return;
    const dest = homeCamera(this.engine.Vec3);
    const t = Math.min(1, (this.clock.now() - this.homeLerp.start) / 600);
    const lerp = (a, b) => a + (b - a) * t;
    const srcC = this.homeLerp.fromCenter;
    const srcA = this.homeLerp.fromAngle;
    this.progState.camera.center = new this.engine.Vec3(
      lerp(srcC.x, dest.center.x), lerp(srcC.y, dest.center.y), lerp(srcC.z, dest.center.z),
    );
    this.progState.camera.angle = new this.engine.Vec3(
      lerp(srcA.x, dest.angle.x), lerp(srcA.y, dest.angle.y), lerp(srcA.z, dest.angle.z),
    );
    if (t >= 1) {
      this.returningHome = false;
      this.homeLerp = null;
      this.completeAt = null;
      this.playback = "idle";
      this.setControls("passive");
      this.updateWalkthroughUi({ phase: null, mathCue: "idle", complete: true, running: false });
    }
  }

  setControls(mode) {
    const interactive = mode === "interactive";
    const initialized = this.status === "ready" || mode === "playing" || interactive;
    if (this.exploreBtn) this.exploreBtn.hidden = interactive || !initialized;
    if (this.resetBtn) this.resetBtn.hidden = !interactive;
    if (this.replayBtn) this.replayBtn.hidden = !initialized;
    if (this.hintEl) {
      this.hintEl.textContent = interactive ? this.copy.dragHint : "";
      this.hintEl.hidden = !interactive;
    }
    if (this.shell) this.shell.style.touchAction = interactive ? "none" : "pan-y";
  }

  updateWalkthroughUi(snapshot) {
    const phase = snapshot && snapshot.phase;
    if (phase && this.seenPhases[this.seenPhases.length - 1] !== phase) {
      this.seenPhases.push(phase);
    }
    this.progressItems.forEach((el, i) => {
      el.classList.toggle("is-active", WALKTHROUGH_PHASES[i] === phase);
    });
    const cue = (snapshot && snapshot.mathCue) || "idle";
    if (cue && this.seenMathCues[this.seenMathCues.length - 1] !== cue) {
      this.seenMathCues.push(cue);
    }
    this.renderMathCue(cue);
    this.renderProbabilityMath(cue);
  }

  async renderMathCue(cue) {
    if (!this.equationEl) return;
    if (cue === this.lastMathCue) return;
    const latex = MATH_CUES[cue] || MATH_CUES.idle;
    const seq = ++this.mathRenderSeq;
    this.lastMathCue = cue;
    try {
      await renderLlmMath(this.equationEl, latex);
      if (seq !== this.mathRenderSeq) return;
    } catch {
      if (seq !== this.mathRenderSeq) return;
      this.equationEl.textContent = "";
    }
  }

  async renderProbabilityMath(cue) {
    if (!this.mathValuesEl || !this.progState || !this.progState.jsGptModel) return;
    const show = cue === "output_probabilities" || cue === "output_argmax";
    if (!show) {
      this.mathValuesEl.hidden = true;
      this.mathValuesEl.textContent = "";
      this.lastProbabilitySignature = null;
      return;
    }
    const pos = Math.max(0, (this.progState.jsGptModel.inputLen || 6) - 1);
    const probs = getCurrentTokenProbabilities(this.progState.jsGptModel, pos);
    if (!probs.length) return;
    const byToken = { A: 0, B: 0, C: 0 };
    for (const p of probs) byToken[p.token] = p.probability;
    const fmt = (v) => `${(v * 100).toFixed(1)}\\%`;
    const signature = `${byToken.A.toFixed(6)}|${byToken.B.toFixed(6)}|${byToken.C.toFixed(6)}`;
    if (signature === this.lastProbabilitySignature) return;
    this.lastProbabilitySignature = signature;
    const latex = String.raw`p_t
=
\begin{bmatrix}
P(A) & P(B) & P(C)
\end{bmatrix}
=
\begin{bmatrix}
${fmt(byToken.A)} & ${fmt(byToken.B)} & ${fmt(byToken.C)}
\end{bmatrix}`;
    const seq = this.mathRenderSeq;
    try {
      await renderLlmMath(this.mathValuesEl, latex);
      if (seq !== this.mathRenderSeq) return;
      this.mathValuesEl.hidden = false;
    } catch {
      this.mathValuesEl.hidden = true;
    }
  }

  resize() {
    if (!this.canvas || !this.progState || !this.progState.render) return;
    const wrap = this.shell || this.canvas.parentElement;
    const cssW = wrap.clientWidth;
    const cssH = wrap.clientHeight;
    const dpr = getLlmVizDpr();
    const bw = Math.round(cssW * dpr);
    const bh = Math.round(cssH * dpr);
    if (bw === this.lastBacking.w && bh === this.lastBacking.h) return;
    this.lastBacking = { w: bw, h: bh };
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.width = bw;
    this.canvas.height = bh;
    this.progState.render.size.x = bw;
    this.progState.render.size.y = bh;
    this.progState.render.gl.viewport(0, 0, bw, bh);
    this.markDirty();
  }

  markDirty() {
    this.dirty = true;
    this.schedule();
  }

  schedule() {
    if (this.destroyed || this.rafId != null) return;
    if (!this.visible && this.playback !== "playing") return;
    this.rafId = this.clock.requestFrame(this.loop);
  }

  loop(time) {
    this.rafId = null;
    if (this.destroyed) return;
    const needsFrame = this.visible && (
      this.dirty || this.timelinePlaying || this.pointerInteracting ||
      this.returningHome || this.completeAt != null ||
      (this.progState && this.progState.render && this.progState.render.syncObjects && this.progState.render.syncObjects.length)
    );
    if (!needsFrame) {
      this.dirty = false;
      return;
    }

    if (this.engine && this.progState) {
      const dt = 16;
      this.engine.runProgram({ time: this.clock.now(), dt, markDirty: () => this.markDirty() }, this.progState);
      const snapshot = this.engine.getDeveloWalkthroughSnapshot(this.progState);
      this.updateWalkthroughUi(snapshot);
      this.finishWalkthroughIfNeeded(snapshot);
      this.tickHomeReturn();
    }
    this.dirty = false;
    if (this.timelinePlaying || this.pointerInteracting || this.returningHome || this.completeAt != null) this.schedule();
  }

  onPointerDown(ev) {
    if (this.playback !== "interactive") return;
    if (ev.button != null && ev.button !== 0) return;
    this.pointerInteracting = true;
    this.activePointerId = ev.pointerId;
    this.dragMode = ev.shiftKey ? "pan" : "orbit";
    this.lastPointer = { x: ev.clientX, y: ev.clientY };
    try { this.shell.setPointerCapture(ev.pointerId); } catch {}
    this.shell.addEventListener("pointermove", this.onPointerMove);
    this.shell.addEventListener("pointerup", this.onPointerUp);
    this.shell.addEventListener("pointercancel", this.onPointerUp);
    this.markDirty();
  }

  onPointerMove(ev) {
    if (!this.pointerInteracting || !this.progState) return;
    const dx = ev.clientX - this.lastPointer.x;
    const dy = ev.clientY - this.lastPointer.y;
    this.lastPointer = { x: ev.clientX, y: ev.clientY };
    const cam = this.progState.camera;
    if (this.dragMode === "pan") {
      cam.center = cam.center.add(new this.engine.Vec3(-dx * 0.4, 0, dy * 0.4));
    } else {
      cam.angle = new this.engine.Vec3(cam.angle.x + dx * 0.3, cam.angle.y + dy * 0.2, cam.angle.z);
    }
    this.markDirty();
  }

  onPointerUp(ev) {
    this.cancelPointer(ev);
  }

  cancelPointer(ev) {
    this.pointerInteracting = false;
    if (this.activePointerId != null) {
      try { this.shell.releasePointerCapture(this.activePointerId); } catch {}
    }
    this.activePointerId = null;
    this.dragMode = null;
    this.shell?.removeEventListener("pointermove", this.onPointerMove);
    this.shell?.removeEventListener("pointerup", this.onPointerUp);
    this.shell?.removeEventListener("pointercancel", this.onPointerUp);
  }

  onKeyDown(ev) {
    if (ev.key === "Escape" && this.playback === "interactive") {
      this.reset();
    }
  }

  exposeTestApi() {
    this.root.__develoLlmViz = {
      getStatus: () => this.status,
      getPlayback: () => this.playback,
      getStage: () => {
        if (!this.engine || !this.progState) return null;
        return this.engine.getDeveloWalkthroughSnapshot(this.progState).phase;
      },
      getWalkthrough: () => (this.engine && this.progState ? this.engine.getDeveloWalkthroughSnapshot(this.progState) : null),
      getSeenPhases: () => this.seenPhases.slice(),
      getSeenMathCues: () => this.seenMathCues.slice(),
      getCamera: () => this.progState && this.progState.camera,
      setPlaybackSpeedForTests: (multiplier) => {
        if (this.engine && this.progState) this.engine.setDeveloWalkthroughSpeed(this.progState, multiplier);
      },
      setClock: (clock) => {
        // Drop the frame pending on the previous clock, otherwise `schedule()`
        // keeps seeing a live rafId and never asks the new clock for frames.
        if (this.rafId != null) this.clock.cancelFrame(this.rafId);
        this.rafId = null;
        this.clock = clock;
      },
      setCapabilities: (fn) => { this.detectCapabilities = fn; },
      beginLoad: () => this.beginLoad(),
      explore: () => this.explore(),
      reset: () => this.reset(),
      replay: () => this.replay(),
      controller: this,
    };
  }

  destroy() {
    this.destroyed = true;
    this.status = "destroyed";
    this.timelinePlaying = false;
    if (this.rafId != null) this.clock.cancelFrame(this.rafId);
    this.rafId = null;
    if (this.abort) this.abort.abort();
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.root.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("visibilitychange", this.onVisibility);
    if (this.mediaQuery) {
      if (this.mediaQuery.removeEventListener) this.mediaQuery.removeEventListener("change", this.onMotionChange);
      else if (this.mediaQuery.removeListener) this.mediaQuery.removeListener(this.onMotionChange);
    }
    this.cancelPointer();
    this.progState = null;
    this.engine = null;
  }
}
