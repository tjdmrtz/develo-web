const TOKEN_LETTERS = ["A", "B", "C"];

export function getCurrentTokenProbabilities(model, position) {
  const vocab = 3;
  let values = null;

  if (model && model.softmaxFinal && model.softmaxFinal.output && model.softmaxFinal.output.localBuffer) {
    const buf = model.softmaxFinal.output.localBuffer;
    const start = position * vocab;
    values = [buf[start], buf[start + 1], buf[start + 2]];
  } else if (model && model.sortedBuf) {
    const sorted = model.sortedBuf;
    const raw = [0, 0, 0];
    for (let i = 0; i < vocab; i++) {
      const id = sorted[(position * vocab + i) * 2 + 0];
      const p = sorted[(position * vocab + i) * 2 + 1];
      if (id >= 0 && id < 3) raw[id] = p;
    }
    values = raw;
  }

  if (!values) return [];

  const cleaned = values.map((v) => {
    if (!Number.isFinite(v)) return 0;
    return v < 0 && v > -1e-7 ? 0 : v;
  });

  let sum = cleaned[0] + cleaned[1] + cleaned[2];
  if (sum <= 0) return [];
  if (Math.abs(sum - 1) > 1e-3 && Math.abs(sum - 1) < 0.05) {
    cleaned[0] /= sum;
    cleaned[1] /= sum;
    cleaned[2] /= sum;
    sum = 1;
  } else if (Math.abs(sum - 1) >= 0.05) {
    cleaned[0] /= sum;
    cleaned[1] /= sum;
    cleaned[2] /= sum;
  }

  const out = TOKEN_LETTERS.map((token, tokenId) => ({
    tokenId,
    token,
    probability: cleaned[tokenId],
  }));
  out.sort((a, b) => b.probability - a.probability);
  return out;
}

export function formatProbability(probability, locale) {
  return new Intl.NumberFormat(locale || "en", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(probability);
}
