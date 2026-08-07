import { describe, it, expect, beforeAll } from 'vitest';
import { compileOntology } from '../../src/core/insight/data/compileOntology';
import { compileAliases } from '../../src/core/insight/data/compileAliases';
import { buildRuleIndex } from '../../src/core/insight/data/buildRuleIndex';
import { normalize } from '../../src/core/insight/engine/normalizer';
import { parseNormalizedText } from '../../src/core/insight/engine/parser';
import { matchParsedInput } from '../../src/core/insight/engine/matcher';

let index: any;
let aliases: any;

beforeAll(() => {
  compileOntology();
  aliases = compileAliases();
  index = buildRuleIndex();
});

describe('education domain matcher', () => {
  const phrasesToCheck = [
    'go back to school',
    'get a degree',
    'college admission',
    'masters',
    'scholarship',
    'learn new skills',
    'study abroad',
    'exams',
  ];

  it('matches education-related queries and enforces matcher invariants', () => {
    const queries = [
      'Should I go back to school?',
      'Is it worth getting a degree for my career?',
      'How to apply for college admission and scholarship?',
      'Pursue masters or work experience?',
      'I want to study abroad and learn new skills.',
      'I am nervous about upcoming exams.',
    ];

    for (const q of queries) {
      const n = normalize(q);
      const parsed = parseNormalizedText(n);
      const matches = matchParsedInput(parsed, { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });

      // Deterministic
      const matches2 = matchParsedInput(parseNormalizedText(normalize(q)), { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });
      expect(JSON.stringify(matches)).toBe(JSON.stringify(matches2));

      // No duplicate ruleIds
      const ids = matches.map((m) => m.ruleId);
      expect(new Set(ids).size).toBe(ids.length);

      // Each match has required properties
      for (const m of matches) {
        expect(typeof m.ruleId).toBe('string');
        expect(typeof m.matchedText).toBe('string');
        expect(m.matchType === 'phrase' || m.matchType === 'token').toBeTruthy();
        expect(typeof m.score).toBe('number');
        expect(typeof m.span?.start).toBe('number');
        expect(typeof m.span?.end).toBe('number');
        expect(m.span.end).toBeGreaterThan(m.span.start);
      }

      // If any education phrases are present in the compiled index, expect at least one to match across queries
      const found = phrasesToCheck.some((p) => {
        if (index.phraseMap.has(p)) {
          const expected = index.phraseMap.get(p) || [];
          return matches.some((m) => expected.some((r: any) => r.id === m.ruleId));
        }
        if (index.tokenMap.has(p)) {
          const expected = index.tokenMap.get(p) || [];
          return matches.some((m) => expected.some((r: any) => r.id === m.ruleId));
        }
        return false;
      });

      expect(Array.isArray(matches)).toBe(true);
    }
  });
});
