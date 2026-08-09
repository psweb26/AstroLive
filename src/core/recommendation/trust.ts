import { AstrologerRecord, TrustResult, TrustComponent } from './types';

/**
 * PHASE 2: Trust Score Computation (pure, deterministic)
 *
 * Per PRODUCT_SPEC.md:
 * - IdentityVerified (bool) — weight 20
 * - VerifiedConsultationsNormalized (0..100) — weight 25
 * - RepeatClientsPct (0..100) — weight 20
 * - ExperienceNormalized (cap at 20yrs -> 0..100) — weight 15
 * - CompletionRatePct (0..100) — weight 10
 *
 * trustScore = round(weighted_sum / total_weight)
 * Total weight = 20 + 25 + 20 + 15 + 10 = 90 (then divide by 90 and * 100 for 0..100 range)
 */

export function computeTrustScore(astrologer: AstrologerRecord): TrustResult {
  const components: TrustComponent[] = [];
  let weightedSum = 0;
  const totalWeight = 100; // sum of all weights

  // 1. Identity Verified (weight 20)
  const identityValue = astrologer.verification_docs_present ? 100 : 0;
  const identityNormalized = astrologer.verification_docs_present ? 1.0 : 0.0;
  const identityWeight = 20;
  const identityContribution = identityNormalized * identityWeight;

  components.push({
    name: 'identity_verified',
    label: 'Identity Verified',
    value: identityValue,
    normalized: identityNormalized,
    weight: identityWeight / 100,
    contribution: identityContribution / 100,
  });

  weightedSum += identityContribution;

  // 2. Verified Consultations Normalized (weight 25)
  // Normalize to 0..100 range (assume 2500+ consultations = 100)
  const consultationNormalized = Math.min(astrologer.verified_consultations_count / 25, 100);
  const consultationNormalizedRatio = consultationNormalized / 100;
  const consultationWeight = 25;
  const consultationContribution = consultationNormalizedRatio * consultationWeight;

  components.push({
    name: 'verified_consultations',
    label: 'Verified Consultations',
    value: astrologer.verified_consultations_count,
    normalized: consultationNormalizedRatio,
    weight: consultationWeight / 100,
    contribution: consultationContribution / 100,
  });

  weightedSum += consultationContribution;

  // 3. Repeat Clients % (weight 20)
  // Already 0..100, normalize to 0..1
  const repeatClientsRatio = Math.min(astrologer.repeat_client_pct, 100) / 100;
  const repeatClientsWeight = 20;
  const repeatClientsContribution = repeatClientsRatio * repeatClientsWeight;

  components.push({
    name: 'repeat_clients_pct',
    label: 'Repeat Clients',
    value: astrologer.repeat_client_pct,
    normalized: repeatClientsRatio,
    weight: repeatClientsWeight / 100,
    contribution: repeatClientsContribution / 100,
  });

  weightedSum += repeatClientsContribution;

  // 4. Experience Normalized (weight 15, cap at 20 years)
  // Cap experience at 20 years: 20yrs = 100, 0yrs = 0
  const experienceCapped = Math.min(astrologer.experience_years, 20);
  const experienceNormalized = experienceCapped / 20;
  const experienceWeight = 15;
  const experienceContribution = experienceNormalized * experienceWeight;

  components.push({
    name: 'experience',
    label: 'Experience',
    value: astrologer.experience_years,
    normalized: experienceNormalized,
    weight: experienceWeight / 100,
    contribution: experienceContribution / 100,
  });

  weightedSum += experienceContribution;

  // 5. Completion Rate % (weight 10)
  // Already 0..100, normalize to 0..1
  const completionRateRatio = Math.min(astrologer.completion_rate_pct, 100) / 100;
  const completionRateWeight = 10;
  const completionRateContribution = completionRateRatio * completionRateWeight;

  components.push({
    name: 'completion_rate_pct',
    label: 'Completion Rate',
    value: astrologer.completion_rate_pct,
    normalized: completionRateRatio,
    weight: completionRateWeight / 100,
    contribution: completionRateContribution / 100,
  });

  weightedSum += completionRateContribution;

  // Final trust score: weighted sum / 100, capped at 100, rounded
  const finalScore = Math.round(Math.min(weightedSum, 100));

  return {
    finalScore,
    components,
  };
}
