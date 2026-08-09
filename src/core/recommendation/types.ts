/**
 * Recommendation domain types per PRODUCT_SPEC.md
 * These types define the contract between the recommendation engine and the API/UI.
 */

/**
 * Raw astrologer record from datasets/astrologers.csv.
 * Trust score is NOT precomputed; it is calculated dynamically from components.
 */
export type AstrologerRecord = {
  id: string;
  name: string;
  short_bio: string;
  specializations: string[]; // pipe-delimited in CSV
  methods: string[]; // pipe-delimited in CSV
  consultation_style: ConsultationStyle;
  experience_years: number;
  verified_consultations_count: number;
  repeat_client_pct: number; // 0..100
  completion_rate_pct: number; // 0..100
  verification_docs_present: boolean;
  languages: string[]; // pipe-delimited in CSV
  price_min: number;
  price_max: number;
  available_slots: string[]; // ISO 8601 timestamps
  short_description: string;
};

export type ConsultationStyle =
  | 'Practical'
  | 'Analytical'
  | 'Empathetic'
  | 'Traditional'
  | 'Direct'
  | 'Strategic';

/**
 * Trust score breakdown.
 * Per PRODUCT_SPEC, computed from five components with specific weights.
 */
export type TrustComponent = {
  name: string;
  label: string;
  value: number; // raw value (e.g., years, count, percentage)
  normalized: number; // 0..1 after normalization
  weight: number; // e.g., 0.20 for 20%
  contribution: number; // normalized * weight (0..component_max)
};

export type TrustResult = {
  finalScore: number; // 0..100, rounded
  components: TrustComponent[]; // breakdown for UI
};

/**
 * Signal explaining why an astrologer ranked where they did.
 */
export type RecommendationSignal = {
  type:
    | 'specialization_match'
    | 'primary_need_match'
    | 'consultation_style_match'
    | 'trust_score'
    | 'experience'
    | 'other';
  label: string; // human-readable, e.g., "Career specialist"
  contribution?: number; // optional score contribution
};

/**
 * A single recommendation result for an astrologer.
 */
export type Recommendation = {
  astrologer: AstrologerRecord;
  finalScore: number; // 0..100
  trustScore: number; // 0..100, computed by the trust engine
  trustBreakdown: TrustComponent[]; // trust score components
  matchExplanation: string; // templated paragraph explaining the match
  topSignals: RecommendationSignal[]; // evidence for recommendation
};

/**
 * Response from the recommendation engine.
 */
export type RecommendationResponse = {
  recommendations: Recommendation[];
  insight_profile_id?: string;
};
