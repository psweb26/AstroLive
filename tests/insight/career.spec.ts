import { describe, it, expect, beforeAll } from 'vitest';
import { compileOntology } from '../../src/core/insight/data/compileOntology';
import { compileAliases } from '../../src/core/insight/data/compileAliases';
import { buildRuleIndex } from '../../src/core/insight/data/buildRuleIndex';
import { normalize } from '../../src/core/insight/engine/normalizer';
import { parseNormalizedText } from '../../src/core/insight/engine/parser';
import { matchParsedInput } from '../../src/core/insight/engine/matcher';

let ontology: any;
let aliases: Record<string, any> | null;
let index: any;

beforeAll(() => {
  ontology = compileOntology();
  aliases = compileAliases();
  index = buildRuleIndex();
});

describe('career domain matcher', () => {
  it('matches phrase R101 (two job offers) with correct span and type', () => {
    const input = 'I HAVE TWO JOB OFFERS!!!';
    const n = normalize(input);
    const parsed = parseNormalizedText(n);
    const matches = matchParsedInput(parsed, { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });

    // should contain R101
    const r101 = matches.find((m) => m.ruleId === 'R101');
    expect(r101).toBeDefined();
    expect(r101?.matchType).toBe('phrase');
    expect(typeof r101?.score).toBe('number');
    // tokens: ['i','have','two','job','offers'] -> span start 2 end 5
    expect(r101?.span.start).toBe(2);
    expect(r101?.span.end).toBe(5);

    // deterministic: running again yields same JSON
    const parsed2 = parseNormalizedText(normalize(input));
    const matches2 = matchParsedInput(parsed2, { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });
    expect(JSON.stringify(matches)).toBe(JSON.stringify(matches2));

    // no duplicate ruleIds
    const ids = matches.map((m) => m.ruleId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('matches phrase R100 (leave my job) despite punctuation and casing', () => {
    const input = "Should I leave my job?";
    const n = normalize(input);
    const parsed = parseNormalizedText(n);
    const matches = matchParsedInput(parsed, { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });
    const r100 = matches.find((m) => m.ruleId === 'R100');
    expect(r100).toBeDefined();
    expect(r100?.matchType).toBe('phrase');
  });

  it('matches mixed domain: career phrase and finance token', () => {
    const input = 'I have two job offers and I want to invest';
    const n = normalize(input);
    const parsed = parseNormalizedText(n);
    const matches = matchParsedInput(parsed, { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });
    const ids = matches.map((m) => m.ruleId);
    expect(ids).toContain('R101');
    expect(ids).toContain('R300');
    // ordering deterministic: R101 should appear before R300 (earlier span)
    const posR101 = ids.indexOf('R101');
    const posR300 = ids.indexOf('R300');
    expect(posR101).toBeGreaterThanOrEqual(0);
    expect(posR300).toBeGreaterThanOrEqual(0);
    expect(posR101).toBeLessThan(posR300);
  });
});
