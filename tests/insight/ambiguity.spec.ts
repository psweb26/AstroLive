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

describe('ambiguity and overlapping phrases', () => {
  it('longest phrase should be matched and ordering deterministic', () => {
    // Construct input that could match both long and short phrases.
    const input = 'i have two job offers and two job';
    const n = normalize(input);
    const parsed = parseNormalizedText(n);
    const matches = matchParsedInput(parsed, {
      phraseMap: index.phraseMap,
      tokenMap: index.tokenMap,
      styleMap: index.styleMap,
      aliasesMap: aliases,
      maxGram: 6,
    });

    // Deterministic
    const matches2 = matchParsedInput(parseNormalizedText(normalize(input)), {
      phraseMap: index.phraseMap,
      tokenMap: index.tokenMap,
      styleMap: index.styleMap,
      aliasesMap: aliases,
      maxGram: 6,
    });
    expect(JSON.stringify(matches)).toBe(JSON.stringify(matches2));

    // No duplicate ruleIds
    const ids = matches.map((m) => m.ruleId);
    expect(new Set(ids).size).toBe(ids.length);

    // If both long and short phrase rules exist in index, ensure longer spans come before shorter ones when they share the same start
    for (let i = 0; i < matches.length - 1; i++) {
      const a = matches[i];
      const b = matches[i + 1];
      if (a.span.start === b.span.start) {
        expect(a.span.end).toBeGreaterThanOrEqual(b.span.end);
      }
    }
  });

  it('alias resolution should map alias phrase to target rules when present', () => {
    const raw = "i'm thinking of quitting my job";
    const n = normalize(raw);
    const parsed = parseNormalizedText(n);
    const matches = matchParsedInput(parsed, {
      phraseMap: index.phraseMap,
      tokenMap: index.tokenMap,
      styleMap: index.styleMap,
      aliasesMap: aliases,
      maxGram: 6,
    });

    const aliasKey = 'quitting my job';
    if (aliases && Object.prototype.hasOwnProperty.call(aliases, aliasKey)) {
      const aliasTarget = aliases[aliasKey]?.phrase;
      if (aliasTarget) {
        const expectedRules = index.phraseMap.get(aliasTarget) || [];
        const found = matches.some((m) => expectedRules.some((r: any) => r.id === m.ruleId));
        expect(found).toBe(true);
      }
    }

    // Basic invariants
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
  });

  it('mixed-domain and edge cases: unknown words, repeated words, empty input, punctuation, casing', () => {
    const examples = [
      '!!!', // punctuation only
      '', // empty
      'invest invest invest', // repeated word
      'I have no idea about zxyqplk', // unknown token
      'I HAVE two JOB offers!!!', // casing + punctuation
      'I am torn: two job offers vs invest', // mixed-domain
    ];

    for (const ex of examples) {
      const n = normalize(ex);
      const parsed = parseNormalizedText(n);
      const matches = matchParsedInput(parsed, {
        phraseMap: index.phraseMap,
        tokenMap: index.tokenMap,
        styleMap: index.styleMap,
        aliasesMap: aliases,
        maxGram: 6,
      });

      // Deterministic & no duplicates
      const matches2 = matchParsedInput(parseNormalizedText(normalize(ex)), {
        phraseMap: index.phraseMap,
        tokenMap: index.tokenMap,
        styleMap: index.styleMap,
        aliasesMap: aliases,
        maxGram: 6,
      });
      expect(JSON.stringify(matches)).toBe(JSON.stringify(matches2));
      const ids = matches.map((m) => m.ruleId);
      expect(new Set(ids).size).toBe(ids.length);

      // verify fields when matches exist
      for (const m of matches) {
        expect(typeof m.ruleId).toBe('string');
        expect(typeof m.matchedText).toBe('string');
        expect(m.matchType === 'phrase' || m.matchType === 'token').toBeTruthy();
        expect(typeof m.score).toBe('number');
        expect(typeof m.span?.start).toBe('number');
        expect(typeof m.span?.end).toBe('number');
        expect(m.span.end).toBeGreaterThan(m.span.start);
      }
    }
  });
});
