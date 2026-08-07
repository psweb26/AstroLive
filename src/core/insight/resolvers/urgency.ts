import { CandidateScores } from '../engine/scorer';
import { Urgency } from '../types';

/**
 * Determine urgency from CandidateScores.
 * Pure deterministic resolver.
 */
export function determineUrgency(scores: CandidateScores): Urgency {
  const total = scores.totalWeight || 0;
  const matched = (scores.matchedRules || []).length;
  const needs = Object.entries(scores.needScores || {}).sort((a, b) => b[1] - a[1]);
  const topNeed = needs[0]?.[0] || null;

  // Heuristics (deterministic):
  // - High urgency if total weight is high and matched rules include urgency tokens
  // - Medium if moderate evidence
  // - Low otherwise

  // If any matched rule id looks like urgency token (U prefix), increase urgency
  const hasUrgencyToken = (scores.matchedRules || []).some((m: any) => m.ruleId && String(m.ruleId).startsWith('U'));

  if (total >= 40 || hasUrgencyToken) return 'high';
  if (total >= 15 || matched >= 3) return 'medium';
  if (topNeed === 'Timing' && total >= 8) return 'medium';
  return 'low';
}
