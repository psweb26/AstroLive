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

describe('timing & when-related matcher tests', () => {
  const queries = [
    'When will I get a job?',
    'When will I marry?',
    'Is next month a good time?',
    'Will this year be better?',
    'What about the future? Will it be soon?',
    'Why is there a delay?',
    'I need this done asap',
    'When should I expect it to happen?',
  ];

  it('matches timing-related phrases and validates matcher invariants', () => {
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

      // deterministic
      const matches2 = matchParsedInput(parseNormalizedText(normalize(q)), {
        phraseMap: index.phraseMap,
        tokenMap: index.tokenMap,
        styleMap: index.styleMap,
        aliasesMap: aliases,
        maxGram: 6,
      });
      expect(JSON.stringify(matches)).toBe(JSON.stringify(matches2));

      // property checks and no duplicates
      const ids = matches.map((m) => m.ruleId);
      expect(new Set(ids).size).toBe(ids.length);

      for (const m of matches) {
        expect(typeof m.ruleId).toBe('string');
        expect(typeof m.matchedText).toBe('string');
        expect(m.matchType === 'phrase' || m.matchType === 'token').toBeTruthy();
        expect(typeof m.score).toBe('number');
        expect(typeof m.span?.start).toBe('number');
        expect(typeof m.span?.end).toBe('number');
        expect(m.span.end).toBeGreaterThan(m.span.start);
      }

      // At minimum ensure function ran without throwing and returned array
      expect(Array.isArray(matches)).toBe(true);
    }
  });
});
