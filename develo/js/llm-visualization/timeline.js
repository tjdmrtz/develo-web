export const STAGE_WINDOWS = [
  { stage: "tokens", start: 0, end: 1400 },
  { stage: "embedding", start: 1400, end: 3200 },
  { stage: "qkv", start: 3200, end: 5300 },
  { stage: "attention", start: 5300, end: 8200 },
  { stage: "transformer", start: 8200, end: 10500 },
  { stage: "output", start: 10500, end: 12600 },
  { stage: "prediction", start: 12600, end: 14000 },
];

export const TIMELINE_DURATION_MS = 14000;

export function getStageAtTime(elapsedMs) {
  if (elapsedMs >= TIMELINE_DURATION_MS) {
    return { stage: "idle", localProgress: 1 };
  }
  const t = Math.max(0, elapsedMs);
  for (const win of STAGE_WINDOWS) {
    if (t < win.end) {
      const span = win.end - win.start;
      const localProgress = span <= 0 ? 1 : Math.min(1, Math.max(0, (t - win.start) / span));
      return { stage: win.stage, localProgress };
    }
  }
  return { stage: "idle", localProgress: 1 };
}
