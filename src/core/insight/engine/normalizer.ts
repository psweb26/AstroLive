// Normalizer: converts raw input into a stable normalized string
// Responsibilities:
// - lowercase
// - normalize unicode (NFKC)
// - replace punctuation with spaces
// - collapse repeated whitespace
// - trim

export function normalize(input: string | null | undefined): string {
  if (input === null || input === undefined) return '';
  let s = String(input);
  // Unicode normalize to NFKC to collapse composed characters
  try {
    s = s.normalize('NFKC');
  } catch (e) {
    // ignore if environment does not support normalize
  }
  // Replace punctuation (Unicode property) with spaces
  // Keep letters, numbers and whitespace. Convert other punctuation to spaces.
  // Using a conservative regex to avoid stripping language-specific letters.
  s = s.replace(/[\p{P}\p{S}]+/gu, ' ');
  // Replace any sequence of whitespace (including NBSP) with a single space
  s = s.replace(/\s+/g, ' ');
  // Lowercase and trim
  s = s.toLowerCase().trim();
  return s;
}
