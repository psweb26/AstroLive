import { describe, expect, it } from 'vitest';

import { analyze } from '../../src/core/insight/engine/analyze';
import { loadOntology } from '../../src/core/insight/ontology';
import { RULES } from '../../src/core/insight/rules';

describe('Insight Engine coverage and reliability', () => {
  const cases = [
    ['I am deciding whether to leave my job.', 'Career'],
    ['Should I break up or try to reconcile?', 'Relationship'],
    ['Is this a good time to invest in stocks?', 'Finance'],
    ['I have been anxious and unable to sleep.', 'Health'],
    ['Which course should I study next?', 'Education'],
    ['I feel lost and want to find purpose.', 'Spiritual'],
    ['What is the best time to move to another city?', 'Timing'],
    ['Should I sign this property agreement?', 'Legal'],
    ['Can you help me understand my natal chart?', 'General Guidance'],
  ] as const;

  it.each(cases)('classifies supported natural-language input: %s', (input, category) => {
    const profile = analyze(input);

    expect(profile.concernCategory).toBe(category);
    expect(profile.confidence).toBeGreaterThanOrEqual(40);
    expect(profile.confidence).toBeLessThanOrEqual(97);
    expect(profile.explanation.length).toBeGreaterThan(0);
    expect(profile.explanation.every((item) => RULES.some((rule) => rule.id === item.ruleId))).toBe(true);
  });

  it('keeps all ontology entries represented by a runtime rule', () => {
    const ontology = loadOntology();
    const runtimeCoverage = new Set(
      RULES.filter((rule) => rule.category.length > 0).map((rule) => `${rule.category}::${rule.subcategory}`),
    );
    const categoryMap: Record<string, string> = {
      'Health & Well-being': 'Health',
      'Spiritual / Personal Growth': 'Spiritual',
      'Timing / Events': 'Timing',
      'Legal / Transactional': 'Legal',
    };

    for (const entry of ontology) {
      const category = categoryMap[entry.category] ?? entry.category;
      expect(runtimeCoverage.has(`${category}::${entry.subcategory}`)).toBe(true);
    }
  });

  it('represents mixed-domain evidence without hiding the competing match', () => {
    const profile = analyze('I have two job offers and want to invest my savings.');
    const ruleIds = profile.explanation.map((item) => item.ruleId);

    expect(profile.concernCategory).toBe('Career');
    expect(ruleIds).toContain('R101');
    expect(ruleIds).toContain('R300');
  });

  it('does not infer a supported category from unrelated text', () => {
    const profile = analyze('The blue kettle is on the shelf.');

    expect(profile.concernCategory).toBe('Unknown');
    expect(profile.confidence).toBeLessThan(40);
    expect(profile.explanation).toHaveLength(0);
  });
});
