import { CandidateScores } from '../engine/scorer';

export type ConfidenceResult = {
  confidence: number; // 0..97
  band: 'low' | 'medium' | 'high';
  ambiguityPenalty: number;
};

/**
 * Compute a deterministic confidence score from CandidateScores.
 * Inputs: CandidateScores ONLY.
 */
export function scoreConfidence(scores: CandidateScores): ConfidenceResult {
  // Basic signals
  const total = scores.totalWeight || 0;
  const matched = (scores.matchedRules || []).length;
  const distinctCategories = Object.keys(scores.categoryScores || {}).length;

  // Lexicon score: total weight scaled into 0..70
  const lexiconRaw = Math.min(70, total * 2); // heuristic: each weight point -> 2 confidence up to 70

  // Phrase boost: if a single matched rule has a large share, boost up to +10
  let phraseBoost = 0;
  if (matched > 0) {
    const topRuleWeight = Math.max(...scores.matchedRules.map((m) => (typeof m.score === 'number' ? m.score : 0)));
    phraseBoost = Math.min(10, (topRuleWeight / Math.max(1, total)) * 10);
  }

  // Structured boost: more distinct categories decreases confidence slightly; single-category increases
  const structuredBoost = distinctCategories <= 1 ? 8 : Math.max(0, 5 - (distinctCategories - 1));

  // Ambiguity penalty: if top two needs are close in weight -> penalty
  let ambiguityPenalty = 0;
  const needs = Object.entries(scores.needScores || {}).sort((a, b) => b[1] - a[1]);
  if (needs.length >= 2) {
    const [a, b] = needs;
    if (a[1] > 0 && b[1] > 0) {
      const ratio = b[1] / a[1];
      if (ratio > 0.7) {
        ambiguityPenalty = Math.min(15, Math.round((ratio - 0.7) * 50));
      }
    }
  }

  let raw = lexiconRaw + phraseBoost + structuredBoost - ambiguityPenalty;

  // Presence of many matched rules without weight reduces confidence slightly
  if (matched > 6) raw -= Math.min(10, (matched - 6) * 1.5);

  // Normalize and cap at 97
  raw = Math.max(0, Math.min(97, Math.round(raw)));

  const band = raw >= 75 ? 'high' : raw >= 40 ? 'medium' : 'low';

  return Object.freeze({ confidence: raw, band, ambiguityPenalty });
}
