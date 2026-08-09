/**
 * Trust Score Tests
 *
 * Test the exact PRODUCT_SPEC trust formula:
 * - IdentityVerified (bool) — weight 20
 * - VerifiedConsultationsNormalized (0..100) — weight 25
 * - RepeatClientsPct (0..100) — weight 20
 * - ExperienceNormalized (cap at 20yrs -> 0..100) — weight 15
 * - CompletionRatePct (0..100) — weight 10
 */

import { describe, it, expect } from 'vitest';
import { computeTrustScore } from '../../src/core/recommendation/trust';
import { AstrologerRecord } from '../../src/core/recommendation/types';

const mockAstrologer = (overrides?: Partial<AstrologerRecord>): AstrologerRecord => ({
  id: 'a01',
  name: 'Test Astrologer',
  short_bio: 'Test',
  specializations: ['Career'],
  methods: ['Vedic'],
  consultation_style: 'Practical',
  experience_years: 10,
  verified_consultations_count: 1000,
  repeat_client_pct: 75,
  completion_rate_pct: 90,
  verification_docs_present: true,
  languages: ['English'],
  price_min: 50,
  price_max: 150,
  available_slots: [],
  short_description: 'Test',
  ...overrides,
});

describe('computeTrustScore', () => {
  it('should compute trust score from all five components', () => {
    const astrologer = mockAstrologer();
    const result = computeTrustScore(astrologer);

    expect(result.finalScore).toBeGreaterThanOrEqual(0);
    expect(result.finalScore).toBeLessThanOrEqual(100);
    expect(result.components).toHaveLength(5);
  });

  it('should have 5 components with correct names', () => {
    const astrologer = mockAstrologer();
    const result = computeTrustScore(astrologer);

    const componentNames = result.components.map((c) => c.name);
    expect(componentNames).toContain('identity_verified');
    expect(componentNames).toContain('verified_consultations');
    expect(componentNames).toContain('repeat_clients_pct');
    expect(componentNames).toContain('experience');
    expect(componentNames).toContain('completion_rate_pct');
  });

  describe('identity_verified component', () => {
    it('should give full weight (20) when verification docs present', () => {
      const astrologer = mockAstrologer({ verification_docs_present: true });
      const result = computeTrustScore(astrologer);

      const identityComp = result.components.find((c) => c.name === 'identity_verified');
      expect(identityComp).toBeDefined();
      expect(identityComp!.normalized).toBe(1.0);
      expect(identityComp!.value).toBe(100);
    });

    it('should give zero weight when verification docs absent', () => {
      const astrologer = mockAstrologer({ verification_docs_present: false });
      const result = computeTrustScore(astrologer);

      const identityComp = result.components.find((c) => c.name === 'identity_verified');
      expect(identityComp).toBeDefined();
      expect(identityComp!.normalized).toBe(0.0);
      expect(identityComp!.value).toBe(0);
    });
  });

  describe('verified_consultations component', () => {
    it('should normalize consultations: 2500+ = 100', () => {
      const astrologer = mockAstrologer({ verified_consultations_count: 2500 });
      const result = computeTrustScore(astrologer);

      const consultComp = result.components.find((c) => c.name === 'verified_consultations');
      expect(consultComp).toBeDefined();
      expect(consultComp!.normalized).toBe(1.0);
    });

    it('should normalize consultations: 1250 = 50%', () => {
      const astrologer = mockAstrologer({ verified_consultations_count: 1250 });
      const result = computeTrustScore(astrologer);

      const consultComp = result.components.find((c) => c.name === 'verified_consultations');
      expect(consultComp).toBeDefined();
      expect(consultComp!.normalized).toBeCloseTo(0.5, 1);
    });

    it('should cap at 100 even with very high consultation count', () => {
      const astrologer = mockAstrologer({ verified_consultations_count: 10000 });
      const result = computeTrustScore(astrologer);

      const consultComp = result.components.find((c) => c.name === 'verified_consultations');
      expect(consultComp).toBeDefined();
      expect(consultComp!.normalized).toBeLessThanOrEqual(1.0);
    });
  });

  describe('repeat_clients_pct component', () => {
    it('should normalize repeat clients: 80% → 0.8', () => {
      const astrologer = mockAstrologer({ repeat_client_pct: 80 });
      const result = computeTrustScore(astrologer);

      const repeatComp = result.components.find((c) => c.name === 'repeat_clients_pct');
      expect(repeatComp).toBeDefined();
      expect(repeatComp!.normalized).toBeCloseTo(0.8, 1);
    });

    it('should handle 0% repeat clients', () => {
      const astrologer = mockAstrologer({ repeat_client_pct: 0 });
      const result = computeTrustScore(astrologer);

      const repeatComp = result.components.find((c) => c.name === 'repeat_clients_pct');
      expect(repeatComp).toBeDefined();
      expect(repeatComp!.normalized).toBe(0);
    });
  });

  describe('experience component', () => {
    it('should cap experience at 20 years', () => {
      const astrologer = mockAstrologer({ experience_years: 30 });
      const result = computeTrustScore(astrologer);

      const expComp = result.components.find((c) => c.name === 'experience');
      expect(expComp).toBeDefined();
      expect(expComp!.normalized).toBeLessThanOrEqual(1.0);
    });

    it('should normalize: 10 years = 50%', () => {
      const astrologer = mockAstrologer({ experience_years: 10 });
      const result = computeTrustScore(astrologer);

      const expComp = result.components.find((c) => c.name === 'experience');
      expect(expComp).toBeDefined();
      expect(expComp!.normalized).toBeCloseTo(0.5, 1);
    });

    it('should normalize: 20 years = 100%', () => {
      const astrologer = mockAstrologer({ experience_years: 20 });
      const result = computeTrustScore(astrologer);

      const expComp = result.components.find((c) => c.name === 'experience');
      expect(expComp).toBeDefined();
      expect(expComp!.normalized).toBe(1.0);
    });
  });

  describe('completion_rate_pct component', () => {
    it('should normalize completion rate: 90% → 0.9', () => {
      const astrologer = mockAstrologer({ completion_rate_pct: 90 });
      const result = computeTrustScore(astrologer);

      const complComp = result.components.find((c) => c.name === 'completion_rate_pct');
      expect(complComp).toBeDefined();
      expect(complComp!.normalized).toBeCloseTo(0.9, 1);
    });
  });

  describe('determinism', () => {
    it('should return identical trust score on repeated calls', () => {
      const astrologer = mockAstrologer();

      const result1 = computeTrustScore(astrologer);
      const result2 = computeTrustScore(astrologer);

      expect(result1.finalScore).toBe(result2.finalScore);
      expect(JSON.stringify(result1.components)).toBe(JSON.stringify(result2.components));
    });

    it('should handle high performer (all maxes)', () => {
      const astrologer = mockAstrologer({
        verification_docs_present: true,
        verified_consultations_count: 5000,
        repeat_client_pct: 100,
        experience_years: 30,
        completion_rate_pct: 100,
      });

      const result = computeTrustScore(astrologer);
      expect(result.finalScore).toBeGreaterThanOrEqual(90);
      expect(result.finalScore).toBeLessThanOrEqual(100);
    });

    it('should handle low performer (all mins)', () => {
      const astrologer = mockAstrologer({
        verification_docs_present: false,
        verified_consultations_count: 0,
        repeat_client_pct: 0,
        experience_years: 0,
        completion_rate_pct: 0,
      });

      const result = computeTrustScore(astrologer);
      expect(result.finalScore).toBeGreaterThanOrEqual(0);
      expect(result.finalScore).toBeLessThanOrEqual(10);
    });
  });

  describe('weight verification', () => {
    it('should have correct weight distributions', () => {
      const astrologer = mockAstrologer();
      const result = computeTrustScore(astrologer);

      const totalWeight = result.components.reduce((sum, c) => sum + c.weight, 0);
      expect(totalWeight).toBeCloseTo(1.0, 1); // weights should sum to 1.0
    });

    it('should reflect PRODUCT_SPEC weights', () => {
      const astrologer = mockAstrologer();
      const result = computeTrustScore(astrologer);

      const weights: Record<string, number> = {};
      result.components.forEach((c) => {
        weights[c.name] = c.weight;
      });

      expect(weights.identity_verified).toBeCloseTo(0.2, 1); // 20%
      expect(weights.verified_consultations).toBeCloseTo(0.25, 1); // 25%
      expect(weights.repeat_clients_pct).toBeCloseTo(0.2, 1); // 20%
      expect(weights.experience).toBeCloseTo(0.15, 1); // 15%
      expect(weights.completion_rate_pct).toBeCloseTo(0.1, 1); // 10%
    });
  });
});
