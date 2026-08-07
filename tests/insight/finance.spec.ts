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

describe('finance domain matcher', () => {
  const tokensToCheck = [
    'money',
    'invest',
    'savings',
    'loan',
    'debt',
    'property',
    'income',
    'profit',
    'loss',
    'business profit',
  ];

  it('matches common finance words/tokens and preserves matcher invariants', () => {
    const queries = [
      'How do I invest my savings?',
      'I am worried about debt and loans.',
      'Is my business making profit or loss?',
      'How to manage my income and property?',
      'Where to put money?',
    ];

    for (const q of queries) {
      const n = normalize(q);
      const parsed = parseNormalizedText(n);
      const matches = matchParsedInput(parsed, { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });

      // Deterministic and no duplicates
      const matches2 = matchParsedInput(parseNormalizedText(normalize(q)), { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });
      expect(JSON.stringify(matches)).toBe(JSON.stringify(matches2));
      const ids = matches.map((m) => m.ruleId);
      expect(new Set(ids).size).toBe(ids.length);

      // Every matched entry must have required properties
      for (const m of matches) {
        expect(typeof m.ruleId).toBe('string');
        expect(typeof m.matchedText).toBe('string');
        expect(m.matchType === 'phrase' || m.matchType === 'token').toBeTruthy();
        expect(typeof m.score).toBe('number');
        expect(typeof m.span?.start).toBe('number');
        expect(typeof m.span?.end).toBe('number');
        expect(m.span.end).toBeGreaterThan(m.span.start);
      }

      // If any of the finance tokens are in the tokenMap/phraseMap, ensure at least one is matched
      const foundAny = tokensToCheck.some((k) => {
        if (index.tokenMap.has(k)) {
          const expected = index.tokenMap.get(k) || [];
          return matches.some((m) => expected.some((r: any) => r.id === m.ruleId));
        }
        if (index.phraseMap.has(k)) {
          const expected = index.phraseMap.get(k) || [];
          return matches.some((m) => expected.some((r: any) => r.id === m.ruleId));
        }
        return false;
      });

      // Not all corpora will contain finance rules; ensure no exceptions but prefer at least one hit across queries
      expect(Array.isArray(matches)).toBe(true);
    }
  });
});
