export function mapAttentionEdges(softmaxBuffer, nHeads, T, inputLen) {
  const edges = [];
  if (!softmaxBuffer || !nHeads || !T) return edges;
  const active = Math.min(inputLen || T, T);

  for (let head = 0; head < nHeads; head++) {
    for (let fromPosition = 0; fromPosition < active; fromPosition++) {
      let rowSum = 0;
      for (let toPosition = 0; toPosition <= fromPosition; toPosition++) {
        const idx = (head * T + fromPosition) * T + toPosition;
        let weight = softmaxBuffer[idx];
        if (!Number.isFinite(weight) || weight < 0) weight = 0;
        if (weight > 1) weight = 1;
        rowSum += weight;
        if (weight <= 0) continue;
        edges.push({ fromPosition, toPosition, head, weight });
      }
      if (rowSum > 0 && Math.abs(rowSum - 1) > 1e-3) {
        for (const e of edges) {
          if (e.head === head && e.fromPosition === fromPosition) e.weight /= rowSum;
        }
      }
    }
  }
  return edges;
}

export function attentionOpacity(weight, minOpacity = 0.08, opacityRange = 0.92) {
  const o = minOpacity + weight * opacityRange;
  return Math.min(1, Math.max(0, o));
}
