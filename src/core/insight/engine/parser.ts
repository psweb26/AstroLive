export type Token = {
  value: string;
  start: number; // inclusive char index in normalizedText
  end: number; // exclusive char index in normalizedText
};

export type ParsedInput = {
  normalizedText: string;
  tokens: ReadonlyArray<Token>;
  tokenCount: number;
  length: number; // char length
};

/**
 * Parse normalized text into tokens with character spans.
 * - Assumes normalizedText uses single-space separators (normalizer guarantees this).
 * - Returns immutable ParsedInput.
 */
export function parseNormalizedText(normalizedText: string): ParsedInput {
  const text = (normalizedText || '').trim();
  const tokens: Token[] = [];
  if (text.length === 0) {
    return Object.freeze({ normalizedText: text, tokens: Object.freeze([]), tokenCount: 0, length: 0 });
  }

  let idx = 0;
  let tokenStart = 0;
  for (let i = 0; i <= text.length; i++) {
    const ch = text[i] || ' ';
    if (ch === ' ') {
      if (i > tokenStart) {
        const value = text.slice(tokenStart, i);
        tokens.push({ value, start: tokenStart, end: i });
      }
      tokenStart = i + 1;
    }
  }

  const frozenTokens = Object.freeze(tokens.map((t) => Object.freeze(t)));
  const out: ParsedInput = Object.freeze({
    normalizedText: text,
    tokens: frozenTokens,
    tokenCount: frozenTokens.length,
    length: text.length,
  });
  return out;
}
