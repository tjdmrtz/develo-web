export const LLM_VIZ_ASSET_BASE = "/llm-viz/bycroft-9da9374";

export async function fetchRequiredAsset(url, signal) {
  const response = await fetch(url, {
    signal,
    credentials: "same-origin",
  });
  if (!response.ok) {
    throw new Error(`[llm-viz] Failed to load ${url}: HTTP ${response.status}`);
  }
  return response;
}

export async function fetchJsonAsset(url, signal) {
  const response = await fetchRequiredAsset(url, signal);
  return response.json();
}

export async function fetchArrayBufferAsset(url, signal) {
  const response = await fetchRequiredAsset(url, signal);
  return response.arrayBuffer();
}

export async function instantiateLlmWasm(url, importObject, signal) {
  const response = await fetchRequiredAsset(url, signal);
  try {
    if ("instantiateStreaming" in WebAssembly) {
      return await WebAssembly.instantiateStreaming(response.clone(), importObject);
    }
  } catch {
    // Continue to the byte-buffer fallback.
  }
  const bytes = await response.arrayBuffer();
  return WebAssembly.instantiate(bytes, importObject);
}
