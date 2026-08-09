/**
 * Recommendation Ranking Tests
 *
 * Test the Top 3 ranking engine that selects and orders astrologers
 * based on recommendation scores.
 */

import { describe, it, expect } from 'vitest';
import { recommendAstrologers } from '../../src/core/recommendation/recommend';
import { AstrologerRecord } from '../../src/core/recommendation/types';
import { InsightProfile } from '../../src/core/insight/types';

const mockAstrologer = (id: string, overrides?: Partial<AstrologerRecord>): AstrologerRecord => ({
  id,
  name: `Astrologer ${id}`,
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

const mockInsightProfile = (overrides?: Partial<InsightProfile>): InsightProfile => ({
  id: 'insight-001',
  engineVersion: '1.0.0',
  concernCategory: 'Career',
  subcategory: 'Job Change (Decision Making)',
  primaryNeed: 'Decision Support',
  urgency: 'medium',
  consultationStyleHint: 'practical',
  suggestedConsultation: 'Career Guidance',
  confidence: 92,
  explanation: [],
  quickInsightText: 'Test insight',
  created_at: new Date().toISOString(),
  ...overrides,
});

describe('recommendAstrologers', () => {
  it('should return array of recommendations', () => {
    const insight = mockInsightProfile();
    const astrologers = [mockAstrologer('a01'), mockAstrologer('a02')];

    const recommendations = recommendAstrologers(insight, astrologers);

    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeGreaterThan(0);
  });

  it('should return at most 3 recommendations', () => {
    const insight = mockInsightProfile();
    const astrologers = [
      mockAstrologer('a01'),
      mockAstrologer('a02'),
      mockAstrologer('a03'),
      mockAstrologer('a04'),
      mockAstrologer('a05'),
    ];

    const recommendations = recommendAstrologers(insight, astrologers);

    expect(recommendations.length).toBeLessThanOrEqual(3);
  });

  it('should return exactly 3 when 3+ candidates exist', () => {
    const insight = mockInsightProfile();
    const astrologers = [
      mockAstrologer('a01'),
      mockAstrologer('a02'),
      mockAstrologer('a03'),
      mockAstrologer('a04'),
    ];

    const recommendations = recommendAstrologers(insight, astrologers);

    expect(recommendations.length).toBe(3);
  });

  it('should return fewer than 3 when fewer candidates exist', () => {
    const insight = mockInsightProfile();
    const astrologers = [mockAstrologer('a01'), mockAstrologer('a02')];

    const recommendations = recommendAstrologers(insight, astrologers);

    expect(recommendations.length).toBe(2);
  });

  it('should rank by finalScore descending', () => {
    const insight = mockInsightProfile();
    const astrologers = [
      mockAstrologer('a01', { specializations: ['Finance'] }), // poor match
      mockAstrologer('a02', { specializations: ['Career', 'Decision Making'] }), // good match
      mockAstrologer('a03', { specializations: ['Career'] }), // ok match
    ];

    const recommendations = recommendAstrologers(insight, astrologers);

    // First recommendation should have higher score than second
    expect(recommendations[0].finalScore).toBeGreaterThanOrEqual(recommendations[1].finalScore);
    if (recommendations.length > 2) {
      expect(recommendations[1].finalScore).toBeGreaterThanOrEqual(recommendations[2].finalScore);
    }
  });

  it('should include astrologer data in each recommendation', () => {
    const insight = mockInsightProfile();
    const astrologers = [mockAstrologer('a01'), mockAstrologer('a02')];

    const recommendations = recommendAstrologers(insight, astrologers);

    recommendations.forEach((rec) => {
      expect(rec.astrologer).toBeDefined();
      expect(rec.astrologer.id).toBeDefined();
      expect(rec.astrologer.name).toBeDefined();
    });
  });

  it('should include finalScore in each recommendation', () => {
    const insight = mockInsightProfile();
    const astrologers = [mockAstrologer('a01'), mockAstrologer('a02')];

    const recommendations = recommendAstrologers(insight, astrologers);

    recommendations.forEach((rec) => {
      expect(rec.finalScore).toBeDefined();
      expect(typeof rec.finalScore).toBe('number');
      expect(rec.finalScore).toBeGreaterThanOrEqual(0);
      expect(rec.finalScore).toBeLessThanOrEqual(100);
    });
  });

  it('should include matchExplanation in each recommendation', () => {
    const insight = mockInsightProfile();
    const astrologers = [mockAstrologer('a01'), mockAstrologer('a02')];

    const recommendations = recommendAstrologers(insight, astrologers);

    recommendations.forEach((rec) => {
      expect(rec.matchExplanation).toBeDefined();
      expect(typeof rec.matchExplanation).toBe('string');
      expect(rec.matchExplanation.length).toBeGreaterThan(0);
    });
  });

  it('should include topSignals in each recommendation', () => {
    const insight = mockInsightProfile();
    const astrologers = [mockAstrologer('a01'), mockAstrologer('a02')];

    const recommendations = recommendAstrologers(insight, astrologers);

    recommendations.forEach((rec) => {
      expect(rec.topSignals).toBeDefined();
      expect(Array.isArray(rec.topSignals)).toBe(true);
      expect(rec.topSignals.length).toBeGreaterThan(0);

      rec.topSignals.forEach((signal) => {
        expect(signal.type).toBeDefined();
        expect(signal.label).toBeDefined();
      });
    });
  });

  it('should include trustBreakdown in each recommendation', () => {
    const insight = mockInsightProfile();
    const astrologers = [mockAstrologer('a01'), mockAstrologer('a02')];

    const recommendations = recommendAstrologers(insight, astrologers);

    recommendations.forEach((rec) => {
      expect(rec.trustBreakdown).toBeDefined();
      expect(Array.isArray(rec.trustBreakdown)).toBe(true);
      expect(rec.trustBreakdown.length).toBeGreaterThan(0);

      rec.trustBreakdown.forEach((component) => {
        expect(component.name).toBeDefined();
        expect(component.label).toBeDefined();
        expect(component.value).toBeDefined();
        expect(component.normalized).toBeDefined();
      });
    });
  });

  describe('determinism', () => {
    it('should return identical recommendations on repeated calls', () => {
      const insight = mockInsightProfile();
      const astrologers = [
        mockAstrologer('a01'),
        mockAstrologer('a02'),
        mockAstrologer('a03'),
        mockAstrologer('a04'),
      ];

      const recs1 = recommendAstrologers(insight, astrologers);
      const recs2 = recommendAstrologers(insight, astrologers);

      expect(recs1.length).toBe(recs2.length);
      recs1.forEach((rec, i) => {
        expect(rec.astrologer.id).toBe(recs2[i].astrologer.id);
        expect(rec.finalScore).toBe(recs2[i].finalScore);
      });
    });
  });

  describe('tie-breaking', () => {
    it('should use deterministic tie-breaking when scores are equal', () => {
      const insight = mockInsightProfile();

      // Create astrologers with identical scores
      const astrologers = [
        mockAstrologer('z-astro', { specializations: ['Career'] }),
        mockAstrologer('a-astro', { specializations: ['Career'] }),
        mockAstrologer('m-astro', { specializations: ['Career'] }),
      ];

      const recs1 = recommendAstrologers(insight, astrologers);
      const recs2 = recommendAstrologers(insight, astrologers);

      // Same order both times (deterministic)
      expect(recs1.map((r) => r.astrologer.id)).toEqual(recs2.map((r) => r.astrologer.id));
    });
  });

  describe('filters', () => {
    it('should filter by language if provided', () => {
      const insight = mockInsightProfile();
      const astrologers = [
        mockAstrologer('a01', { languages: ['English', 'Hindi'] }),
        mockAstrologer('a02', { languages: ['French'] }),
        mockAstrologer('a03', { languages: ['English'] }),
      ];

      const recommendations = recommendAstrologers(insight, astrologers, { language: 'Hindi' });

      recommendations.forEach((rec) => {
        expect(rec.astrologer.languages).toContain('Hindi');
      });
    });

    it('should filter by maxPrice if provided', () => {
      const insight = mockInsightProfile();
      const astrologers = [
        mockAstrologer('a01', { price_min: 50, price_max: 100 }),
        mockAstrologer('a02', { price_min: 200, price_max: 300 }),
        mockAstrologer('a03', { price_min: 60, price_max: 120 }),
      ];

      const recommendations = recommendAstrologers(insight, astrologers, { maxPrice: 150 });

      recommendations.forEach((rec) => {
        expect(rec.astrologer.price_min).toBeLessThanOrEqual(150);
      });
    });
  });

  describe('explainability', () => {
    it('should generate explanations from actual evidence, not hardcoded', () => {
      const insight1 = mockInsightProfile({
        concernCategory: 'Career',
        primaryNeed: 'Decision Support',
      });

      const insight2 = mockInsightProfile({
        concernCategory: 'Relationship',
        primaryNeed: 'Compatibility',
      });

      const astrologer = mockAstrologer('a01', {
        specializations: ['Career', 'Relationship'],
      });

      const recs1 = recommendAstrologers(insight1, [astrologer]);
      const recs2 = recommendAstrologers(insight2, [astrologer]);

      // Explanations should differ because insights differ
      expect(recs1[0].matchExplanation).not.toBe(recs2[0].matchExplanation);
      expect(recs1[0].matchExplanation).toContain('Career');
      expect(recs2[0].matchExplanation).toContain('Relationship');
    });

    it('should only include signals for matched factors', () => {
      const insight = mockInsightProfile({ consultationStyleHint: undefined });
      const astrologer = mockAstrologer('a01');

      const recommendations = recommendAstrologers(insight, [astrologer]);

      const signals = recommendations[0].topSignals;
      const styleSignal = signals.find((s) => s.type === 'consultation_style_match');

      // Should not have style match signal when no style hint
      expect(styleSignal).toBeUndefined();
    });
  });

  describe('integration', () => {
    it('should handle real-world dataset (50 astrologers)', () => {
      const insight = mockInsightProfile();
      const astrologers = Array.from({ length: 50 }, (_, i) =>
        mockAstrologer(`a${String(i + 1).padStart(2, '0')}`, {
          specializations:
            i % 3 === 0
              ? ['Career']
              : i % 3 === 1
                ? ['Relationship']
                : ['Finance'],
          consultation_style:
            i % 4 === 0
              ? 'Practical'
              : i % 4 === 1
                ? 'Analytical'
                : i % 4 === 2
                  ? 'Empathetic'
                  : 'Traditional',
          experience_years: 2 + (i % 20),
        })
      );

      const recommendations = recommendAstrologers(insight, astrologers);

      expect(recommendations.length).toBe(3);
      expect(recommendations.every((r) => r.finalScore >= 0 && r.finalScore <= 100)).toBe(true);
      expect(recommendations.every((r) => r.matchExplanation.length > 0)).toBe(true);
    });
  });
});
