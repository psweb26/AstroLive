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

describe('relationship domain matcher', () => {
  it('handles relationship-related inputs (punctuation, casing, and aliases)', () => {
    const queries = [
      'My partner and I are arguing a lot.',
      'Should I break up with them?',
      'We are thinking about marriage soon.',
    ];

    for (const q of queries) {
      const n = normalize(q);
      const parsed = parseNormalizedText(n);
      const matches = matchParsedInput(parsed, {
        phraseMap: index.phraseMap,
        tokenMap: index.tokenMap,
        styleMap: index.styleMap,
        aliasesMap: aliases,
        maxGram: 6,
      });

      // deterministic and no duplicates
      const matches2 = matchParsedInput(parseNormalizedText(normalize(q)), {
        phraseMap: index.phraseMap,
        tokenMap: index.tokenMap,
        styleMap: index.styleMap,
        aliasesMap: aliases,
        maxGram: 6,
      });
      expect(JSON.stringify(matches)).toBe(JSON.stringify(matches2));
      const ids = matches.map((m) => m.ruleId);
      expect(new Set(ids).size).toBe(ids.length);

      // If phrase keys exist in phraseMap, ensure at least one map rule matched
      const candidatePhrase = 'break up with them';
      if (index.phraseMap.has(candidatePhrase)) {
        const expected = index.phraseMap.get(candidatePhrase) || [];
        const found = matches.some((m) => expected.some((r: any) => r.id === m.ruleId));
        expect(found).toBe(true);
      }
    }
  });

  it('handles unknown/empty input gracefully', () => {
    const n = normalize('');
    const parsed = parseNormalizedText(n);
    const matches = matchParsedInput(parsed, {
      phraseMap: index.phraseMap,
      tokenMap: index.tokenMap,
      styleMap: index.styleMap,
      aliasesMap: aliases,
      maxGram: 6,
    });
    expect(Array.isArray(matches)).toBe(true);
    expect(matches.length).toBe(0);
  });
});
