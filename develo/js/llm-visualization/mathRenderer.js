let katexPromise = null;

function loadKatex() {
  katexPromise ??= import("/vendor/katex/katex.mjs");
  return katexPromise;
}

export async function renderLlmMath(element, latex) {
  if (!element || !latex) return;
  const module = await loadKatex();
  const katex = module.default || module;
  katex.render(latex, element, {
    throwOnError: false,
    displayMode: true,
    strict: "warn",
    trust: false,
    output: "htmlAndMathml",
  });
}
