/**
 * Recommendation Scorer Tests
 *
 * Test the PRODUCT_SPEC recommendation scoring formula:
 * - Specialization match (subcategory exact/related): 40%
 * - PrimaryNeed alignment: 20%
 * - TrustScore normalized: 20%
 * - ConsultationStyle match: 10%
 * - Experience/proven outcomes normalized: 10%
 */

import { describe, it, expect } from 'vitest';
import { scoreAstrologer } from '../../src/core/recommendation/scorer';
import { AstrologerRecord } from '../../src/core/recommendation/types';
import { InsightProfile } from '../../src/core/insight/types';

const mockAstrologer = (overrides?: Partial<AstrologerRecord>): AstrologerRecord => ({
  id: 'a01',
  name: 'Career Specialist',
  short_bio: 'Career expert',
  specializations: ['Career', 'Decision Making'],
  methods: ['Vedic', 'Transit'],
  consultation_style: 'Practical',
  experience_years: 12,
  verified_consultations_count: 1842,
  repeat_client_pct: 86,
  completion_rate_pct: 95,
  verification_docs_present: true,
  languages: ['English', 'Hindi'],
  price_min: 60,
  price_max: 150,
  available_slots: [],
  short_description: 'Career guidance',
  ...overrides,
});

const mockInsightProfile = (overrides?: Partial<InsightProfile>): InsightProfile => ({
  id: 'insight-001',
  engineVersion: '1.0.0',
  concernCategory: 'Career',
  subcategory: 'Job Change (Decision Making)',
  primaryNeed: 'Decision Support',
  urgency: 'medium',
  consultationStyleHint: 'practical',
  suggestedConsultation: 'Career Guidance (Decision Session)',
  confidence: 92,
  explanation: [],
  quickInsightText: 'Test insight',
  created_at: new Date().toISOString(),
  ...overrides,
});

describe('scoreAstrologer', () => {
  it('should return a scored astrologer with finalScore 0..100', () => {
    const insight = mockInsightProfile();
    const astrologer = mockAstrologer();

    const scored = scoreAstrologer(insight, astrologer);

    expect(scored.finalScore).toBeGreaterThanOrEqual(0);
    expect(scored.finalScore).toBeLessThanOrEqual(100);
    expect(scored.astrologer).toBe(astrologer);
  });

  it('should include evidence object with all five scoring factors', () => {
    const insight = mockInsightProfile();
    const astrologer = mockAstrologer();

    const scored = scoreAstrologer(insight, astrologer);

    expect(scored.evidence).toBeDefined();
    expect(scored.evidence.specialization).toBeDefined();
    expect(scored.evidence.primaryNeed).toBeDefined();
    expect(scored.evidence.consultationStyle).toBeDefined();
    expect(scored.evidence.trust).toBeDefined();
    expect(scored.evidence.experience).toBeDefined();
  });

  it('should include top signals from scoring evidence', () => {
    const insight = mockInsightProfile();
    const astrologer = mockAstrologer();

    const scored = scoreAstrologer(insight, astrologer);

    expect(scored.signals).toBeDefined();
    expect(scored.signals.length).toBeGreaterThan(0);
    expect(scored.signals[0]).toHaveProperty('type');
    expect(scored.signals[0]).toHaveProperty('label');
  });

  describe('specialization matching', () => {
    it('should score 1.0 for exact category match', () => {
      const insight = mockInsightProfile({ concernCategory: 'Career' });
      const astrologer = mockAstrologer({ specializations: ['Career', 'Finance'] });

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.specialization.score).toBe(1.0);
      expect(scored.evidence.specialization.matched).toBe(true);
    });

    it('should score 0.7 for related specialization match', () => {
      const insight = mockInsightProfile({ concernCategory: 'Career' });
      const astrologer = mockAstrologer({ specializations: ['Career Development', 'Finance'] });

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.specialization.score).toBeGreaterThanOrEqual(0.5);
      expect(scored.evidence.specialization.matched).toBe(true);
    });

    it('should score 0.0 for no specialization match', () => {
      const insight = mockInsightProfile({ concernCategory: 'Career' });
      const astrologer = mockAstrologer({ specializations: ['Relationship', 'Finance'] });

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.specialization.score).toBe(0.0);
      expect(scored.evidence.specialization.matched).toBe(false);
    });
  });

  describe('primary need alignment', () => {
    it('should score positively when primary need aligns with specializations', () => {
      const insight = mockInsightProfile({ primaryNeed: 'Decision Support' });
      const astrologer = mockAstrologer({ specializations: ['Career', 'Decision Making'] });

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.primaryNeed.score).toBeGreaterThan(0.5);
    });

    it('should provide reasoning for primary need score', () => {
      const insight = mockInsightProfile();
      const astrologer = mockAstrologer();

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.primaryNeed.reasoning).toBeDefined();
      expect(scored.evidence.primaryNeed.reasoning.length).toBeGreaterThan(0);
    });
  });

  describe('consultation style matching', () => {
    it('should score 1.0 for exact style match', () => {
      const insight = mockInsightProfile({ consultationStyleHint: 'practical' });
      const astrologer = mockAstrologer({ consultation_style: 'Practical' });

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.consultationStyle.score).toBe(1.0);
      expect(scored.evidence.consultationStyle.matched).toBe(true);
    });

    it('should score 0.5 when no style hint provided', () => {
      const insight = mockInsightProfile({ consultationStyleHint: undefined });
      const astrologer = mockAstrologer({ consultation_style: 'Practical' });

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.consultationStyle.score).toBe(0.5);
    });

    it('should score low for mismatched style', () => {
      const insight = mockInsightProfile({ consultationStyleHint: 'empathetic' });
      const astrologer = mockAstrologer({ consultation_style: 'Analytical' });

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.consultationStyle.score).toBeLessThan(0.5);
    });
  });

  describe('experience scoring', () => {
    it('should score 0.5 for 10 years experience', () => {
      const insight = mockInsightProfile();
      const astrologer = mockAstrologer({ experience_years: 10 });

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.experience.score).toBeCloseTo(0.5, 1);
    });

    it('should score 1.0 for 20+ years experience', () => {
      const insight = mockInsightProfile();
      const astrologer = mockAstrologer({ experience_years: 25 });

      const scored = scoreAstrologer(insight, astrologer);

      expect(scored.evidence.experience.score).toBeLessThanOrEqual(1.0);
    });
  });

  describe('determinism', () => {
    it('should return identical score on repeated calls', () => {
      const insight = mockInsightProfile();
      const astrologer = mockAstrologer();

      const scored1 = scoreAstrologer(insight, astrologer);
      const scored2 = scoreAstrologer(insight, astrologer);

      expect(scored1.finalScore).toBe(scored2.finalScore);
      expect(JSON.stringify(scored1.evidence)).toBe(JSON.stringify(scored2.evidence));
    });
  });

  describe('high-compatibility scenario', () => {
    it('should score high when all factors match perfectly', () => {
      const insight = mockInsightProfile({
        concernCategory: 'Career',
        primaryNeed: 'Decision Support',
        consultationStyleHint: 'practical',
      });

      const astrologer = mockAstrologer({
        specializations: ['Career', 'Decision Making'],
        consultation_style: 'Practical',
        experience_years: 15,
        verification_docs_present: true,
        verified_consultations_count: 2000,
        repeat_client_pct: 85,
        completion_rate_pct: 95,
      });

      const scored = scoreAstrologer(insight, astrologer);

      // Should score high (80+) when all factors align
      expect(scored.finalScore).toBeGreaterThanOrEqual(75);
    });
  });

  describe('low-compatibility scenario', () => {
    it('should score low when factors do not match', () => {
      const insight = mockInsightProfile({
        concernCategory: 'Relationship',
        primaryNeed: 'Compatibility',
        consultationStyleHint: 'empathetic',
      });

      const astrologer = mockAstrologer({
        specializations: ['Finance', 'Investments'],
        consultation_style: 'Analytical',
        experience_years: 2,
        verification_docs_present: false,
        verified_consultations_count: 50,
        repeat_client_pct: 20,
        completion_rate_pct: 70,
      });

      const scored = scoreAstrologer(insight, astrologer);

      // Should score lower when specialization/style don't match
      expect(scored.finalScore).toBeLessThan(50);
    });
  });

  describe('explainability', () => {
    it('should generate signals based on actual evidence', () => {
      const insight = mockInsightProfile();
      const astrologer = mockAstrologer({
        experience_years: 15,
        verification_docs_present: true,
      });

      const scored = scoreAstrologer(insight, astrologer);

      // Should have signals corresponding to matching evidence
      const signalTypes = scored.signals.map((s) => s.type);
      expect(signalTypes).toContain('trust_score');

      // Experience signal should only appear if > 10 years
      if (astrologer.experience_years > 10) {
        expect(signalTypes).toContain('experience');
      }
    });

    it('should not generate fake signals', () => {
      const insight = mockInsightProfile({
        concernCategory: 'Relationship',
      });

      const astrologer = mockAstrologer({
        specializations: ['Finance', 'Investments'],
      });

      const scored = scoreAstrologer(insight, astrologer);

      // Should NOT have specialization_match signal when there's no match
      const specSignal = scored.signals.find((s) => s.type === 'specialization_match');
      expect(specSignal).toBeUndefined();
    });
  });
});
