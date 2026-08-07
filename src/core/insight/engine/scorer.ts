import type { ParsedInput } from './parser';
import type { MatchedRule } from './matcher';
import { RULES, RuleDef } from '../rules';
import { Explanation } from '../types';

export type CandidateScores = {
  categoryScores: Readonly<Record<string, number>>;
  subcategoryScores: Readonly<Record<string, number>>;
  needScores: Readonly<Record<string, number>>;
  matchedRules: ReadonlyArray<MatchedRule>;
  totalWeight: number;
};

/**
 * Scorer — aggregate raw evidence from MatchedRule[] into CandidateScores.
 * This module does NOT synthesize urgency, style, or suggested consultation.
 * It only aggregates weights and returns immutable evidence.
 */
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

    const category = r?.category || 'Unknown';
    const subcategory = r?.subcategory || 'Unknown';
    const primaryNeed = (r?.primaryNeed as string) || 'Guidance';

    categoryScores[category] = (categoryScores[category] || 0) + weight;
    subcategoryScores[subcategory] = (subcategoryScores[subcategory] || 0) + weight;
    needScores[primaryNeed] = (needScores[primaryNeed] || 0) + weight;
  }

  return Object.freeze({
    categoryScores: Object.freeze({ ...categoryScores }),
    subcategoryScores: Object.freeze({ ...subcategoryScores }),
    needScores: Object.freeze({ ...needScores }),
    matchedRules: Object.freeze(matches.map((m) => Object.freeze(m))) as ReadonlyArray<MatchedRule>,
    totalWeight,
  });
}
