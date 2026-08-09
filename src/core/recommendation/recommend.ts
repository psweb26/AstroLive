/**
 * PHASE 3E: Ranking Engine
 *
 * Pure, deterministic function that ranks all astrologers against an InsightProfile
 * and returns the Top 3 recommendations with evidence-based explanations.
 *
 * Per PRODUCT_SPEC.md:
 * - Return Top 3 astrologers
 * - Deterministic ranking (no randomization)
 * - Include matchExplanation and topSignals for each
 * - Include trustBreakdown for each
 */

import { InsightProfile } from '../insight/types';
import { AstrologerRecord, Recommendation, TrustComponent } from './types';
import { scoreAstrologer, ScoredAstrologer } from './scorer';
import { computeTrustScore } from './trust';

/**
 * Generate a human-readable match explanation from scoring evidence.
 * This explains WHY an astrologer was recommended based on actual scoring data.
 */
function generateMatchExplanation(
  scored: ScoredAstrologer,
  insightProfile: InsightProfile
): string {
  const { astrologer, evidence } = scored;
  const parts: string[] = [];

  // Build explanation from evidence
  if (evidence.specialization.matched) {
    parts.push(
      `${astrologer.name} specializes in ${insightProfile.concernCategory} and has expertise in your specific situation.`
    );
  }

  if (evidence.primaryNeed.matched) {
    parts.push(`Their approach aligns well with your need for ${insightProfile.primaryNeed.toLowerCase()}.`);
  }

  if (evidence.consultationStyle.matched) {
    parts.push(`Their ${astrologer.consultation_style.toLowerCase()} consultation style matches your preference.`);
  }

  const trustScore = computeTrustScore(astrologer).finalScore;
  if (trustScore >= 85) {
    parts.push(`With a trust score of ${trustScore}/100, they have a strong track record of verified consultations.`);
  } else if (trustScore >= 70) {
    parts.push(`They maintain a solid trust score of ${trustScore}/100 based on their experience and client feedback.`);
  }

  if (astrologer.experience_years >= 10) {
    parts.push(`Their ${astrologer.experience_years} years of experience brings proven expertise to your consultation.`);
  }

  // Fallback if no parts were added
  if (parts.length === 0) {
    parts.push(
      `${astrologer.name} is a strong match for your consultation needs based on their skills and experience.`
    );
  }

  return parts.join(' ');
}

/**
 * Deterministic tie-breaker using astrologer ID.
 * When two astrologers have the same final score, sort by ID lexicographically.
 */
function compareScoredAstrologers(a: ScoredAstrologer, b: ScoredAstrologer): number {
  const scoreDiff = b.finalScore - a.finalScore;
  if (scoreDiff !== 0) return scoreDiff;

  // Tie-breaker: lexicographic comparison of ID
  return a.astrologer.id.localeCompare(b.astrologer.id);
}

/**
 * Recommend astrologers based on an InsightProfile.
 * Returns exactly Top 3 if enough candidates exist, or fewer if not.
 *
 * This is the main entry point for the recommendation engine.
 */
export function recommendAstrologers(
  insightProfile: InsightProfile,
  astrologers: ReadonlyArray<AstrologerRecord>,
  filters?: {
    language?: string;
    maxPrice?: number;
  }
): Recommendation[] {
  // Filter astrologers if filters provided
  let candidates = Array.from(astrologers);

  if (filters?.language) {
    const normalizedLang = filters.language.toLowerCase();
    candidates = candidates.filter((a) =>
      a.languages.some((lang) => lang.toLowerCase() === normalizedLang)
    );
  }

  if (filters?.maxPrice !== undefined) {
    candidates = candidates.filter((a) => a.price_min <= filters.maxPrice!);
  }

  // Score all candidates
  const scored = candidates.map((astrologer) => scoreAstrologer(insightProfile, astrologer));

  // Sort by finalScore (descending), with deterministic tie-breaking
  scored.sort(compareScoredAstrologers);

  // Take Top 3 (or fewer if not enough candidates)
  const top3 = scored.slice(0, 3);

  // Build recommendation objects with explanations and trust breakdown
  const recommendations: Recommendation[] = top3.map((scored) => {
    const trustResult = computeTrustScore(scored.astrologer);

    return {
      astrologer: scored.astrologer,
      finalScore: scored.finalScore,
      trustBreakdown: trustResult.components,
      matchExplanation: generateMatchExplanation(scored, insightProfile),
      topSignals: scored.signals,
    };
  });

  return recommendations;
}
