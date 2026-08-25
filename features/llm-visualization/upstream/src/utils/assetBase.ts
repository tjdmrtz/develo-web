export const LLM_VIZ_ASSET_BASE = "/llm-viz/bycroft-9da9374";

export async function fetchRequiredAsset(
  url: string,
  signal?: AbortSignal,
): Promise<Response> {
  const response = await fetch(url, {
    signal,
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(
      `[llm-viz] Failed to load ${url}: HTTP ${response.status}`,
    );
  }

  return response;
}

export async function fetchJsonAsset<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetchRequiredAsset(url, signal);
  return response.json() as Promise<T>;
}

export async function fetchArrayBufferAsset(url: string, signal?: AbortSignal): Promise<ArrayBuffer> {
  const response = await fetchRequiredAsset(url, signal);
  return response.arrayBuffer();
}

export async function instantiateLlmWasm(
  url: string,
  importObject: WebAssembly.Imports,
  signal?: AbortSignal,
) {
  const response = await fetchRequiredAsset(url, signal);

  try {
    if ("instantiateStreaming" in WebAssembly) {
      return await WebAssembly.instantiateStreaming(
        response.clone(),
        importObject,
      );
    }
  } catch {
    // Continue to the byte-buffer fallback.
  }

  const bytes = await response.arrayBuffer();
  return WebAssembly.instantiate(bytes, importObject);
}
