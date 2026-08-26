export function detectLlmVizCapabilities() {
  if (typeof document === "undefined") {
    return { webgl2: false, colorBufferFloat: false, timerQuery: false };
  }

  const canvas = document.createElement("canvas");
  let gl = null;
  try {
    gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
  } catch {
    gl = null;
  }

  if (!gl) {
    return { webgl2: false, colorBufferFloat: false, timerQuery: false };
  }

  return {
    webgl2: true,
    colorBufferFloat: Boolean(gl.getExtension("EXT_color_buffer_float")),
    timerQuery: Boolean(gl.getExtension("EXT_disjoint_timer_query_webgl2")),
  };
}

export function isLlmVizSupported(caps) {
  return Boolean(caps && caps.webgl2 && caps.colorBufferFloat);
}
