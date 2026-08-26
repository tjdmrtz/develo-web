export function capDpr(dpr) {
  if (dpr == null || dpr === 0 || Number.isNaN(Number(dpr))) return 1;
  return Math.min(Number(dpr) || 1, 1.5);
}

export function getLlmVizDpr() {
  if (typeof window === "undefined") return 1;
  return capDpr(window.devicePixelRatio);
}
