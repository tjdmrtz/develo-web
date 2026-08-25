export const TOKEN_MAP = { 0: "A", 1: "B", 2: "C" };
export const INITIAL_TOKENS = [2, 1, 0, 1, 1, 2];
export const INITIAL_SEQUENCE = "CBABBC";
export const TARGET_SEQUENCE = "ABBBCC";

export function tokenToLetter(token) {
  return String.fromCharCode("A".charCodeAt(0) + token);
}

export function tokensToSequence(tokens) {
  return tokens.map(tokenToLetter).join("");
}

export function hexToVec4(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
    1,
  ];
}

/** Develo CSS tokens mapped into WebGL Vec4 roles. */
export const DEVELO_LLM_VIZ_THEME = {
  text: hexToVec4("#e2e8f0"),
  muted: hexToVec4("#94a3b8"),
  token: hexToVec4("#38bdf8"),
  embedding: hexToVec4("#7dd3fc"),
  q: hexToVec4("#38bdf8"),
  k: hexToVec4("#0284c7"),
  v: hexToVec4("#34d399"),
  attention: hexToVec4("#38bdf8"),
  residual: hexToVec4("#94a3b8"),
  mlp: hexToVec4("#34d399"),
  output: hexToVec4("#e2e8f0"),
  border: hexToVec4("#24365c"),
  panel: hexToVec4("#16233d"),
};
