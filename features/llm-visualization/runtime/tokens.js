export const TOKEN_MAP = { 0: "A", 1: "B", 2: "C" };
export const INITIAL_TOKENS = [2, 1, 0, 1, 1, 2];
export const INITIAL_SEQUENCE = "CBABBC";
export const TARGET_SEQUENCE = "ABBBCC";
export const DISPLAY_INPUT_SEGMENTS = ["<d", "e", "v", "e", "l", "o>"];
export const DISPLAY_INPUT_SEQUENCE = DISPLAY_INPUT_SEGMENTS.join("");

export function tokenToLetter(token) {
  return String.fromCharCode("A".charCodeAt(0) + token);
}

export function tokensToSequence(tokens) {
  return tokens.map(tokenToLetter).join("");
}

export function tokensToSequenceSpaced(tokens) {
  return tokens.map(tokenToLetter).join(" ");
}
