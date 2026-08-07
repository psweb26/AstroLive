import { CandidateScores } from '../engine/scorer';
import { ConsultationStyle } from '../types';

/**
 * Determine consultation style hint from CandidateScores.
 * Pure deterministic resolver.
 */
export function determineStyle(scores: CandidateScores): ConsultationStyle | null {
  const needEntries = Object.entries(scores.needScores || {}).sort((a, b) => b[1] - a[1]);
  const topNeed = needEntries[0]?.[0] || null;

  if (!topNeed) return null;

  switch (topNeed) {
    case 'Decision Support':
      return 'analytical';
    case 'Timing':
      return 'strategic';
    case 'Education':
      return 'practical';
    case 'Compatibility':
      return 'empathetic';
    case 'Growth':
      return 'strategic';
    case 'Remediation':
      return 'empathetic';
    default:
      return 'practical';
  }
}
