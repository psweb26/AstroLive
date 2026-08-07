import type { ParsedInput } from './parser';
import type { MatchedRule } from './matcher';
import { RULES, RuleDef } from '../rules';
import { Urgency, ConsultationStyle, PrimaryNeed, Explanation } from '../types';
import { determineUrgency } from '../builders/urgency';
import { determineStyle } from '../builders/style';

export type CandidateScores = {
  categoryScores: Readonly<Record<string, number>>;
  subcategoryScores: Readonly<Record<string, number>>;
  primaryNeed: PrimaryNeed | null;
  consultationStyle: ConsultationStyle | null;
  suggestedConsultation: string | null;
  urgencyCandidate: Urgency | null;
  explanations: ReadonlyArray<Explanation>;
  totalWeight: number;
};

/**
 * Scorer consumes only ParsedInput and MatchedRule[] (signatures) and
 * produces aggregate CandidateScores used by the confidence layer.
 */
export function scoreCandidates(parsed: ParsedInput, matches: ReadonlyArray<MatchedRule>): CandidateScores {
  // Build rule lookup from RULES (readonly map)
  const ruleById = new Map<string, RuleDef>();
  for (const r of RULES) ruleById.set(r.id, r);

  const categoryScores: Record<string, number> = {};
  const subcategoryScores: Record<string, number> = {};
  const needScores: Record<string, number> = {};
  const explanations: Explanation[] = [];

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

    explanations.push({ ruleId: m.ruleId, type: m.matchType, weight, message: r?.message || '' });
  }

  // Decide primary need (highest-weight)
  const primaryNeed = Object.keys(needScores).length === 0 ? null : (Object.entries(needScores).sort((a, b) => b[1] - a[1])[0][0] as PrimaryNeed);

  // Determine consultation style and urgency using small helper modules
  const consultationStyle = determineStyle(matches, ruleById);
  const urgencyCandidate = determineUrgency(matches, ruleById);

  // Suggested consultation: simple mapping based on primaryNeed
  const suggestedConsultation = primaryNeed
    ? primaryNeed === 'Decision Support'
      ? 'Career guidance (decision-focused)'
      : primaryNeed === 'Timing'
      ? 'Timing-oriented consultation'
      : primaryNeed === 'Education'
      ? 'Educational planning consultation'
      : 'General guidance session'
    : null;

  return Object.freeze({
    categoryScores: Object.freeze({ ...categoryScores }),
    subcategoryScores: Object.freeze({ ...subcategoryScores }),
    primaryNeed: primaryNeed ?? null,
    consultationStyle: consultationStyle ?? null,
    suggestedConsultation: suggestedConsultation,
    urgencyCandidate: urgencyCandidate ?? null,
    explanations: Object.freeze(explanations.map((e) => Object.freeze(e))),
    totalWeight,
  });
}
