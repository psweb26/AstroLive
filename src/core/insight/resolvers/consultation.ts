import { CandidateScores } from '../../engine/scorer';
import { ConsultationProfile, ConsultationType } from '../../builders/consultation';

/**
 * Determine a consultation suggestion based on CandidateScores.
 * This resolver is purely functional and deterministic.
 */
export function determineConsultation(scores: CandidateScores): ConsultationProfile {
  const topCategory = Object.entries(scores.categoryScores || {}).sort((a, b) => b[1] - a[1])[0];
  const topNeed = Object.entries(scores.needScores || {}).sort((a, b) => b[1] - a[1])[0];

  let type: ConsultationType = 'general';
  if (topNeed && topNeed[0] === 'Decision Support') type = 'decision';
  else if (topNeed && topNeed[0] === 'Timing') type = 'timing';
  else if (topNeed && topNeed[0] === 'Education') type = 'education';
  else if (topCategory && topCategory[0] === 'Relationship') type = 'relationship';

  const description =
    type === 'decision'
      ? 'Decision-focused consultation to help you weigh options.'
      : type === 'timing'
      ? 'Timing-focused consultation to identify favorable periods.'
      : type === 'education'
      ? 'Educational planning and pathways consultation.'
      : type === 'relationship'
      ? 'Relationship compatibility and understanding session.'
      : 'General guidance session.';

  return Object.freeze({ type, description });
}
