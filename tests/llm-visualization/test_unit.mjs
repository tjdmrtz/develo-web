/**
 * Unit tests for the Develo LLM visualization helpers.
 * Run: node --test tests/llm-visualization/test_unit.mjs
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..", "..", "features", "llm-visualization", "runtime",
);
const load = (f) => import(pathToFileURL(path.join(root, f)).href);

test("walkthrough phase order", async () => {
  const { WALKTHROUGH_PHASES, walkthroughPhaseIndex } = await load("timeline.js");
  const expected = [
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
  assert.deepEqual(WALKTHROUGH_PHASES, expected);
  expected.forEach((phase, i) => {
    assert.equal(walkthroughPhaseIndex(phase), i);
  });
  assert.equal(walkthroughPhaseIndex("nope"), -1);
});

test("math cues are notation only", async () => {
  const { MATH_CUES } = await load("mathCues.js");
  const required = [
    "intro_tokens", "intro_indices", "intro_embedding", "intro_flow",
    "embedding_token", "embedding_position", "embedding_sum",
    "layernorm_mean", "layernorm_variance", "layernorm_normalize", "layernorm_affine",
    "attention_qkv", "attention_dot", "attention_score", "attention_mask",
    "attention_softmax", "attention_weighted_value",
    "projection_concat", "projection_linear", "projection_residual",
    "mlp_norm", "mlp_expand", "mlp_gelu", "mlp_project", "mlp_residual",
    "transformer_block", "softmax_stable",
    "output_final_norm", "output_logits", "output_probabilities", "output_argmax",
  ];
  for (const id of required) {
    assert.ok(MATH_CUES[id], `missing math cue ${id}`);
    assert.ok(!/The model|Each position|Discrete inputs|tokens become/i.test(MATH_CUES[id]));
  }
  assert.match(MATH_CUES.embedding_token, /E_\{\\mathrm\{tok\}\}/);
  assert.match(MATH_CUES.embedding_position, /E_\{\\mathrm\{pos\}\}/);
  assert.match(MATH_CUES.layernorm_mean, /\\mu_t/);
  assert.match(MATH_CUES.layernorm_variance, /\\sigma_t\^2/);
  assert.match(MATH_CUES.layernorm_affine, /\\gamma_c/);
  assert.match(MATH_CUES.attention_qkv, /W_Q/);
  assert.match(MATH_CUES.attention_score, /\\sqrt\{A\}/);
  assert.match(MATH_CUES.attention_softmax, /\\alpha_\{t,j\}/);
  assert.match(MATH_CUES.mlp_gelu, /\\operatorname\{GELU\}/);
  assert.match(MATH_CUES.output_argmax, /arg\\,max/);
});

test("dpr cap", async () => {
  const { capDpr, getLlmVizDpr } = await load("dpr.js");
  assert.equal(capDpr(undefined), 1);
  assert.equal(capDpr(0), 1);
  assert.equal(capDpr(1), 1);
  assert.equal(capDpr(1.25), 1.25);
  assert.equal(capDpr(1.5), 1.5);
  assert.equal(capDpr(2), 1.5);
  assert.equal(capDpr(3), 1.5);
  assert.equal(getLlmVizDpr(), 1);
});

test("capabilities without document", async () => {
  const { detectLlmVizCapabilities, isLlmVizSupported } = await load("capabilities.js");
  const caps = detectLlmVizCapabilities();
  assert.equal(caps.webgl2, false);
  assert.equal(isLlmVizSupported(caps), false);
  assert.equal(isLlmVizSupported({ webgl2: true, colorBufferFloat: true, timerQuery: false }), true);
  assert.equal(isLlmVizSupported({ webgl2: true, colorBufferFloat: false, timerQuery: true }), false);
});

test("token mapping", async () => {
  const { tokenToLetter, tokensToSequence, INITIAL_TOKENS, INITIAL_SEQUENCE, TARGET_SEQUENCE } = await load("tokens.js");
  assert.equal(tokenToLetter(0), "A");
  assert.equal(tokenToLetter(1), "B");
  assert.equal(tokenToLetter(2), "C");
  assert.equal(tokensToSequence(INITIAL_TOKENS), INITIAL_SEQUENCE);
  assert.equal(INITIAL_SEQUENCE, "CBABBC");
  assert.equal(TARGET_SEQUENCE, "ABBBCC");
});

test("probabilities from buffer", async () => {
  const { getCurrentTokenProbabilities } = await load("probabilities.js");
  const model = {
    softmaxFinal: { output: { localBuffer: new Float32Array([0.1, 0.2, 0.7]) } },
  };
  const probs = getCurrentTokenProbabilities(model, 0);
  assert.equal(probs.length, 3);
  assert.deepEqual(probs.map((p) => p.token).sort(), ["A", "B", "C"]);
  const sum = probs.reduce((s, p) => s + p.probability, 0);
  assert.ok(Math.abs(sum - 1) < 1e-4);
  for (const p of probs) {
    assert.ok(Number.isFinite(p.probability));
    assert.ok(p.probability >= 0);
  }
});

test("attention edges are causal", async () => {
  const { mapAttentionEdges, attentionOpacity } = await load("attention.js");
  const T = 4;
  const nHeads = 3;
  const buf = new Float32Array(nHeads * T * T);
  for (let h = 0; h < nHeads; h++) {
    for (let i = 0; i < T; i++) {
      const n = i + 1;
      for (let j = 0; j <= i; j++) buf[(h * T + i) * T + j] = 1 / n;
    }
  }
  const edges = mapAttentionEdges(buf, nHeads, T, 4);
  for (const e of edges) {
    assert.ok(e.head >= 0 && e.head <= 2);
    assert.ok(Number.isFinite(e.weight));
    assert.ok(e.weight >= 0 && e.weight <= 1);
    assert.ok(e.toPosition <= e.fromPosition);
    const o = attentionOpacity(e.weight);
    assert.ok(o >= 0 && o <= 1);
  }
});

test("asset fetcher status and abort", async () => {
  const { fetchRequiredAsset, fetchJsonAsset } = await load("assets.js");
  const orig = globalThis.fetch;
  globalThis.fetch = async (url) => ({ ok: false, status: 404 });
  await assert.rejects(() => fetchRequiredAsset("/missing.json"), /HTTP 404/);
  globalThis.fetch = async () => ({ ok: false, status: 500 });
  await assert.rejects(() => fetchRequiredAsset("/x"), /HTTP 500/);
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => { throw new Error("bad json"); },
  });
  await assert.rejects(() => fetchJsonAsset("/bad.json"));
  const ctrl = new AbortController();
  ctrl.abort();
  globalThis.fetch = async (url, opts) => {
    if (opts.signal?.aborted) throw new DOMException("Aborted", "AbortError");
    return { ok: true, json: async () => ({}) };
  };
  await assert.rejects(() => fetchRequiredAsset("/x", ctrl.signal));
  globalThis.fetch = orig;
});

test("wasm streaming fallback", async () => {
  const { instantiateLlmWasm } = await load("assets.js");
  const origFetch = globalThis.fetch;
  const origWA = globalThis.WebAssembly;
  let usedFallback = false;
  globalThis.fetch = async () => ({
    ok: true,
    clone() { return this; },
    arrayBuffer: async () => new ArrayBuffer(8),
  });
  globalThis.WebAssembly = {
    instantiateStreaming: async () => { throw new Error("stream fail"); },
    instantiate: async () => { usedFallback = true; return { instance: {} }; },
  };
  await instantiateLlmWasm("/native.wasm", {});
  assert.equal(usedFallback, true);
  globalThis.fetch = origFetch;
  globalThis.WebAssembly = origWA;
});
