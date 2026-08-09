/**
 * PHASE 3D: Recommendation Scorer
 *
 * Pure, deterministic scoring function that computes a recommendation score
 * for a single astrologer given an InsightProfile.
 *
 * Per PRODUCT_SPEC.md, uses these weights:
 * - Specialization match (subcategory exact/related): 40%
 * - PrimaryNeed alignment: 20%
 * - TrustScore normalized: 20%
 * - ConsultationStyle match: 10%
 * - Experience/proven outcomes normalized: 10%
 */

import { InsightProfile } from '../insight/types';
import { AstrologerRecord, RecommendationSignal } from './types';
import { computeTrustScore } from './trust';

export type ScoringEvidence = {
  specialization: {
    matched: boolean;
    score: number; // 0..1
    reasoning: string;
  };
  primaryNeed: {
    matched: boolean;
    score: number; // 0..1
    reasoning: string;
  };
  consultationStyle: {
    matched: boolean;
    score: number; // 0..1
    reasoning: string;
  };
  trust: {
    score: number; // 0..1 (normalized from 0..100)
    reasoning: string;
  };
  experience: {
    score: number; // 0..1
    reasoning: string;
  };
};

export type ScoredAstrologer = {
  astrologer: AstrologerRecord;
  finalScore: number; // 0..100
  evidence: ScoringEvidence;
  signals: RecommendationSignal[];
};

/**
 * Normalize a concern category for matching.
 * "Career" vs "Career" → exact match
 * "Health & Well-being" vs "Health" → related match (return 0.7)
 * "Relationship" vs "Finance" → no match (return 0)
 */
function categorizationScore(
  insightCategory: string,
  astrologerSpecializations: string[],
  astrologerSubcategory?: string
): { score: number; matched: boolean; reasoning: string } {
  const normalizedInsight = insightCategory.toLowerCase().trim();
  const normalizedSpecializations = astrologerSpecializations.map((s) => s.toLowerCase().trim());

  // Exact match in specializations
  if (normalizedSpecializations.includes(normalizedInsight)) {
    return {
      score: 1.0,
      matched: true,
      reasoning: `Exact specialization match: ${insightCategory}`,
    };
  }

  // Partial match (e.g., "Finance" in "Investments / Business")
  for (const spec of normalizedSpecializations) {
    if (spec.includes(normalizedInsight) || normalizedInsight.includes(spec)) {
      return {
        score: 0.7,
        matched: true,
        reasoning: `Related specialization: ${astrologerSpecializations.find(
          (s) => s.toLowerCase() === spec
        ) || spec}`,
      };
    }
  }

  return {
    score: 0.0,
    matched: false,
    reasoning: `No specialization match for ${insightCategory}`,
  };
}

/**
 * Score primary need alignment.
 * Check if the astrologer's consultation style or specializations suggest
 * they can handle the primary need.
 */
function primaryNeedScore(
  primaryNeed: string,
  astrologerSpecializations: string[]
): { score: number; matched: boolean; reasoning: string } {
  const normalizedNeed = primaryNeed.toLowerCase().trim();
  const normalizedSpecs = astrologerSpecializations.map((s) => s.toLowerCase().trim());

  // Map primary needs to common specialization keywords
  const needKeywords: Record<string, string[]> = {
    'decision support': ['decision', 'career', 'choice', 'option'],
    compatibility: ['relationship', 'compatibility', 'partner', 'marriage'],
    timing: ['timing', 'muhurta', 'auspicious', 'transit', 'event'],
    guidance: ['guidance', 'counseling', 'therapeutic', 'career', 'education'],
    growth: ['spiritual', 'growth', 'remedies', 'practice', 'development'],
    remediation: ['remedies', 'remedial', 'healing', 'stress', 'health'],
    education: ['education', 'exam', 'study', 'career'],
  };

  const keywords = needKeywords[normalizedNeed] || [];

  let maxScore = 0;
  let matchedKeyword = '';

  for (const keyword of keywords) {
    for (const spec of normalizedSpecs) {
      if (spec.includes(keyword) || keyword.includes(spec.split(' ')[0])) {
        maxScore = Math.max(maxScore, 0.8);
        matchedKeyword = keyword;
      }
    }
  }

  if (maxScore > 0) {
    return {
      score: maxScore,
      matched: true,
      reasoning: `Primary need "${primaryNeed}" aligns with specializations`,
    };
  }

  return {
    score: 0.5,
    matched: false,
    reasoning: `Moderate alignment for primary need "${primaryNeed}"`,
  };
}

/**
 * Score consultation style match.
 * Direct comparison between InsightProfile consultationStyleHint and astrologer.consultation_style.
 */
function consultationStyleScore(
  styleHint: string | undefined,
  astrologerStyle: string
): { score: number; matched: boolean; reasoning: string } {
  if (!styleHint) {
    // No style hint; return neutral score
    return {
      score: 0.5,
      matched: false,
      reasoning: 'No consultation style preference detected',
    };
  }

  const normalizedHint = styleHint.toLowerCase().trim();
  const normalizedAstroStyle = astrologerStyle.toLowerCase().trim();

  if (normalizedHint === normalizedAstroStyle) {
    return {
      score: 1.0,
      matched: true,
      reasoning: `Perfect consultation style match: ${astrologerStyle}`,
    };
  }

  // Partial matches (e.g., "practical" and "Practical")
  if (normalizedHint.includes(normalizedAstroStyle) || normalizedAstroStyle.includes(normalizedHint)) {
    return {
      score: 0.8,
      matched: true,
      reasoning: `Compatible consultation style: ${astrologerStyle}`,
    };
  }

  return {
    score: 0.2,
    matched: false,
    reasoning: `Consultation style mismatch: seeking ${styleHint}, astrologer is ${astrologerStyle}`,
  };
}

/**
 * Score experience as normalized 0..1.
 * Cap at 20 years as per trust calculation.
 */
function experienceScore(years: number): { score: number; reasoning: string } {
  const capped = Math.min(years, 20);
  const normalized = capped / 20;

  return {
    score: normalized,
    reasoning: `Experience: ${years} years (normalized to ${(normalized * 100).toFixed(0)}%)`,
  };
}

/**
 * Score an astrologer against an InsightProfile.
 * Returns detailed evidence and final score.
 *
 * This is the core pure function for recommendation scoring.
 */
export function scoreAstrologer(
  insightProfile: InsightProfile,
  astrologer: AstrologerRecord
): ScoredAstrologer {
  // Compute trust score (0..100), then normalize to 0..1
  const trustResult = computeTrustScore(astrologer);
  const trustNormalized = trustResult.finalScore / 100;

  // 1. Specialization match (40%)
  const specScore = categorizationScore(
    insightProfile.concernCategory,
    astrologer.specializations
  );

  // 2. Primary need alignment (20%)
  const needScore = primaryNeedScore(insightProfile.primaryNeed, astrologer.specializations);

  // 3. Consultation style match (10%)
  const styleScore = consultationStyleScore(
    insightProfile.consultationStyleHint,
    astrologer.consultation_style
  );

  // 4. Trust score normalized (20%)
  const trustScore = {
    score: trustNormalized,
    reasoning: `Trust score: ${trustResult.finalScore}/100`,
  };

  // 5. Experience normalized (10%)
  const expScore = experienceScore(astrologer.experience_years);

  // Build evidence object
  const evidence: ScoringEvidence = {
    specialization: specScore,
    primaryNeed: needScore,
    consultationStyle: styleScore,
    trust: trustScore,
    experience: expScore,
  };

  // PRODUCT_SPEC weights (frozen)
  const WEIGHTS = {
    specialization: 0.4,
    primaryNeed: 0.2,
    trust: 0.2,
    consultationStyle: 0.1,
    experience: 0.1,
  };

  // Compute weighted final score
  const weightedSum =
    specScore.score * WEIGHTS.specialization +
    needScore.score * WEIGHTS.primaryNeed +
    trustNormalized * WEIGHTS.trust +
    styleScore.score * WEIGHTS.consultationStyle +
    expScore.score * WEIGHTS.experience;

  const finalScore = Math.round(weightedSum * 100);

  // Build top signals from evidence
  const signals: RecommendationSignal[] = [];

  if (specScore.matched) {
    signals.push({
      type: 'specialization_match',
      label: `Specializes in ${insightProfile.concernCategory}`,
      contribution: specScore.score * WEIGHTS.specialization * 100,
    });
  }

  if (needScore.matched) {
    signals.push({
      type: 'primary_need_match',
      label: `Aligned with ${insightProfile.primaryNeed}`,
      contribution: needScore.score * WEIGHTS.primaryNeed * 100,
    });
  }

  if (styleScore.matched) {
    signals.push({
      type: 'consultation_style_match',
      label: `${astrologer.consultation_style} consultation style`,
      contribution: styleScore.score * WEIGHTS.consultationStyle * 100,
    });
  }

  signals.push({
    type: 'trust_score',
    label: `Trust score: ${trustResult.finalScore}/100`,
    contribution: trustNormalized * WEIGHTS.trust * 100,
  });

  if (astrologer.experience_years > 10) {
    signals.push({
      type: 'experience',
      label: `${astrologer.experience_years} years experience`,
      contribution: expScore.score * WEIGHTS.experience * 100,
    });
  }

  return {
    astrologer,
    finalScore,
    evidence,
    signals,
  };
}
