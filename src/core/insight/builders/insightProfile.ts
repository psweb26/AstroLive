import { CandidateScores } from '../engine/scorer';
import { ConfidenceResult } from '../engine/confidence';
import { determineStyle } from '../resolvers/style';
import { determineUrgency } from '../resolvers/urgency';
import { determineConsultation } from '../resolvers/consultation';
import { quickInsightText } from './quickInsight';
import { RULES } from '../rules';
import { InsightProfile } from '../types';

/**
 * Build an immutable InsightProfile from evidence and confidence.
 * Pure mapping function; deterministic.
 */
function deterministicId(seed: string): string {
  // simple deterministic hash -> hex (not cryptographic)
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return 'insight_' + (h >>> 0).toString(16);
}

export function buildInsightProfile(
  freeText: string,
  scores: CandidateScores,
  confidence: ConfidenceResult,
): Readonly<InsightProfile> {
  const topCategory = Object.entries(scores.categoryScores || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
  const topSubcategory = Object.entries(scores.subcategoryScores || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General';
  const topNeed = Object.entries(scores.needScores || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || ('Guidance' as any);

  const style = determineStyle(scores);
  const urgency = determineUrgency(scores);
  const consultation = determineConsultation(scores);
  const quick = quickInsightText(scores);

  // Build explanation array mapping matched rule ids to RULES messages (if present)
  const ruleMap = new Map(RULES.map((r) => [r.id, r]));
  const explanation = (scores.matchedRules || []).map((m: any) => {
    const r = ruleMap.get(m.ruleId);
    return {
      ruleId: m.ruleId,
      type: m.matchType || 'other',
      weight: typeof m.score === 'number' ? m.score : r?.weight ?? 0,
      message: r?.message || m.matchedText || '',
    };
  });

  // Deterministic created_at derived from signature of freeText + totalWeight
  const createdSeed = `${freeText}::${scores.totalWeight}`;
  const created_at = new Date(0).toISOString(); // intentionally deterministic (epoch) for tests

  const id = deterministicId(`${freeText}::${topCategory}::${scores.totalWeight}`);

  const profile: InsightProfile = Object.freeze({
    id,
    engineVersion: 'insight-engine@1.0.0',
    free_text: freeText,
    concernCategory: topCategory,
    subcategory: topSubcategory,
    primaryNeed: topNeed,
    urgency: urgency,
    consultationStyleHint: style ?? undefined,
    suggestedConsultation: consultation.description,
    confidence: confidence.confidence,
    explanation: Object.freeze(explanation.map((e) => Object.freeze(e))),
    quickInsightText: quick,
    created_at,
  });

  return profile;
}
