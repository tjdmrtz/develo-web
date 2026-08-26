import { LLM_VIZ_ASSET_BASE, fetchJsonAsset } from "./assets.js";
import { detectLlmVizCapabilities, isLlmVizSupported } from "./capabilities.js";
import { getLlmVizDpr } from "./dpr.js";
import { getStageAtTime, TIMELINE_DURATION_MS } from "./timeline.js";
import { COPY } from "./i18n.js";
import { createBrowserClock } from "./clock.js";
import { CAMERA_PRESETS, presetToCamera } from "./cameraPresets.js";
import { getCurrentTokenProbabilities, formatProbability } from "./probabilities.js";

const STAGE_KEYS = ["tokens", "embedding", "qkv", "attention", "transformer", "output", "prediction"];

function tensorSetFromJson(data) {
  return { ...data };
}

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
    this.timelineStart = 0;
    this.timelineElapsed = 0;
    this.wasPlayingBeforeHidden = false;
    this.abort = null;
    this.engine = null;
    this.progState = null;
    this.canvas = root.querySelector("[data-llm-canvas]");
    this.stageEl = root.querySelector("[data-llm-stage]");
    this.hintEl = root.querySelector("[data-llm-hint]");
    this.probsEl = root.querySelector("[data-llm-probs]");
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
    if (this.reducedMotion && this.playback === "playing") this.pausePlayback("idle");
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
      this.applyCamera("overview", true);
      // Settle on a stable overview frame; autoplay decides whether to advance.
      this.progState.stage = "idle";
      engine.runProgram({ time: this.clock.now(), dt: 16, markDirty: () => this.markDirty() }, this.progState);
      this.root.classList.add("is-ready");
      this.status = "ready";
      this.updateStageUi("idle", 0);
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
    this.startTimeline();
    this.autoplayDone = true;
  }

  startTimeline() {
    this.timelineElapsed = 0;
    this.timelineStart = this.clock.now();
    this.timelinePlaying = true;
    this.playback = "playing";
    this.userInteracted = false;
    if (this.progState) {
      this.progState.interactive = false;
      this.progState.stage = "tokens";
    }
    this.setControls("playing");
    this.applyCamera("tokens");
    this.markDirty();
  }

  pausePlayback(next) {
    this.timelinePlaying = false;
    this.playback = next;
    this.markDirty();
  }

  resumePlayback() {
    if (this.timelineElapsed >= TIMELINE_DURATION_MS) return;
    this.timelineStart = this.clock.now() - this.timelineElapsed;
    this.timelinePlaying = true;
    this.playback = "playing";
    this.markDirty();
  }

  explore(ev) {
    const fromKeyboard = wasKeyboardActivation(ev, this.exploreBtn);
    this.userInteracted = true;
    this.timelinePlaying = false;
    this.playback = "interactive";
    if (this.progState) {
      this.progState.interactive = true;
      this.progState.stage = "interactive";
    }
    this.setControls("interactive");
    this.shell?.classList.add("is-interactive");
    this.updateStageUi("interactive", 1);
    // The explore button is now hidden, so keyboard focus must not be dropped.
    if (fromKeyboard) this.resetBtn?.focus();
    this.markDirty();
  }

  reset(ev) {
    const fromKeyboard = wasKeyboardActivation(ev, this.resetBtn);
    this.cancelPointer();
    this.userInteracted = true;
    this.timelinePlaying = false;
    this.playback = "idle";
    this.shell?.classList.remove("is-interactive");
    if (this.progState) {
      this.progState.interactive = false;
      this.progState.stage = "idle";
      this.progState.display.hoverTarget = null;
    }
    this.applyCamera("overview");
    this.updateStageUi("idle", 1);
    this.setControls("passive");
    if (fromKeyboard) this.exploreBtn?.focus();
    this.markDirty();
  }

  replay() {
    this.cancelPointer();
    this.shell?.classList.remove("is-interactive");
    this.userInteracted = false;
    this.autoplayDone = true;
    if (this.progState) {
      this.progState.interactive = false;
      this.progState.generatedLength = 0;
      if (this.progState.jsGptModel) this.progState.jsGptModel.inputLen = 6;
    }
    this.applyCamera("tokens");
    this.startTimeline();
  }

  applyCamera(name, immediate) {
    if (!this.engine || !this.progState) return;
    const cam = presetToCamera(name, this.engine.Vec3);
    if (immediate) {
      this.progState.camera.center = cam.center;
      this.progState.camera.angle = cam.angle;
      this.progState.camera.desiredCamera = undefined;
      this.progState.camera.desiredCameraTransition = undefined;
    } else {
      this.progState.camera.desiredCamera = cam;
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

  updateStageUi(stage, progress) {
    const info = this.copy.stages[stage] || this.copy.stages.idle;
    const titleEl = this.root.querySelector("[data-llm-stage-title]");
    const descEl = this.root.querySelector("[data-llm-stage-desc]");
    if (titleEl) titleEl.textContent = info.title;
    if (descEl) descEl.textContent = info.description;
    this.progressItems.forEach((el, i) => {
      el.classList.toggle("is-active", STAGE_KEYS[i] === stage);
    });
    this.updateProbabilities();
  }

  updateProbabilities() {
    if (!this.probsEl || !this.progState || !this.progState.jsGptModel) return;
    const pos = Math.max(0, (this.progState.jsGptModel.inputLen || 6) - 1);
    const probs = getCurrentTokenProbabilities(this.progState.jsGptModel, pos);
    if (!probs.length) {
      this.probsEl.textContent = "";
      return;
    }
    const locale = this.lang === "es" ? "es" : "en";
    const pred = this.lang === "es" ? "Predicción del modelo" : "Model prediction";
    this.probsEl.textContent = `${pred}: ${probs.map((p) => `${p.token} ${formatProbability(p.probability, locale)}`).join(" · ")}`;
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
      (this.progState && this.progState.render && this.progState.render.syncObjects && this.progState.render.syncObjects.length)
    );
    if (!needsFrame) {
      this.dirty = false;
      return;
    }

    if (this.timelinePlaying) {
      this.timelineElapsed = Math.min(TIMELINE_DURATION_MS, this.clock.now() - this.timelineStart);
      const { stage, localProgress } = getStageAtTime(this.timelineElapsed);
      if (this.progState) {
        const prev = this.progState.stage;
        this.progState.stage = stage;
        this.progState.stageProgress = localProgress;
        if (prev !== stage && CAMERA_PRESETS[stage]) this.applyCamera(stage);
        if (stage === "prediction" && localProgress > 0.4 && this.progState.generatedLength === 0) {
          this.progState.stepModel = true;
        }
      }
      this.updateStageUi(stage, localProgress);
      if (this.timelineElapsed >= TIMELINE_DURATION_MS) {
        this.timelinePlaying = false;
        this.playback = "idle";
        if (this.progState) this.progState.stage = "idle";
        this.applyCamera("overview");
        this.updateStageUi("idle", 1);
        this.setControls("passive");
      }
    }

    if (this.engine && this.progState) {
      const dt = 16;
      this.engine.runProgram({ time: this.clock.now(), dt, markDirty: () => this.markDirty() }, this.progState);
    }
    this.dirty = false;
    if (this.timelinePlaying || this.pointerInteracting) this.schedule();
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
      getStage: () => (this.progState ? this.progState.stage : null),
      getCamera: () => this.progState && this.progState.camera,
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
