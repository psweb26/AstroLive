// src/core/insight/engine/scorer.ts

import type { ParsedInput } from './parser';
import type { MatchedRule } from './matcher';
import { RULES, RuleDef } from '../rules';
import { Explanation } from '../types';

/**
 * A strongly-typed, immutable map of numeric scores.
 */
export type ScoreMap = Readonly<Record<string, number>>;

export type CandidateScores = {
  categoryScores: ScoreMap;
  subcategoryScores: ScoreMap;
  needScores: ScoreMap;
  matchedRules: ReadonlyArray<MatchedRule>;
  totalWeight: number;
};

/* inside function scoreCandidates(...) keep implementation but declare locals as Record<string, number> */
export function scoreCandidates(parsed: ParsedInput, matches: ReadonlyArray<MatchedRule>): CandidateScores {
  const ruleById = new Map<string, RuleDef>();
  for (const r of RULES) ruleById.set(r.id, r);

  const categoryScores: Record<string, number> = {};
  const subcategoryScores: Record<string, number> = {};
  const needScores: Record<string, number> = {};
  let totalWeight = 0;

  for (const m of matches) {
    const r = ruleById.get(m.ruleId);
    const weight = typeof m.score === 'number' ? m.score : r?.weight ?? 0;
    totalWeight += weight;

    // Metadata-only matches (for example urgency) should remain available to
    // resolvers without creating a false "Unknown" interpretation candidate.
    if (weight <= 0) continue;

    const category = r?.category || 'Unknown';
    const subcategory = r?.subcategory || 'Unknown';
    const primaryNeed = (r?.primaryNeed as string) || 'Guidance';

    categoryScores[category] = (categoryScores[category] || 0) + weight;
    subcategoryScores[subcategory] = (subcategoryScores[subcategory] || 0) + weight;
    needScores[primaryNeed] = (needScores[primaryNeed] || 0) + weight;
  }

  return Object.freeze({
    categoryScores: Object.freeze({ ...categoryScores }) as ScoreMap,
    subcategoryScores: Object.freeze({ ...subcategoryScores }) as ScoreMap,
    needScores: Object.freeze({ ...needScores }) as ScoreMap,
    matchedRules: Object.freeze(matches.map((m) => Object.freeze(m))) as ReadonlyArray<MatchedRule>,
    totalWeight,
  });
}
