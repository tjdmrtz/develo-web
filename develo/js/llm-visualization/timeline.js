export const WALKTHROUGH_PHASES = [
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

export function walkthroughPhaseIndex(phase) {
  return WALKTHROUGH_PHASES.indexOf(phase);
}
