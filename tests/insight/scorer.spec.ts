import { describe, it, expect } from 'vitest';
import { scoreCandidates } from '../../src/core/insight/engine/scorer';
import { parseNormalizedText } from '../../src/core/insight/engine/parser';
import { matchParsedInput } from '../../src/core/insight/engine/matcher';
import { buildRuleIndex } from '../../src/core/insight/data/buildRuleIndex';
import { compileAliases } from '../../src/core/insight/data/compileAliases';

describe('scorer integration tests', () => {
  it('scores matches produced by matcher', () => {
    const index = buildRuleIndex();
    const aliases = compileAliases();
    const text = 'I have two job offers';
    const parsed = parseNormalizedText(text);
    const matches = matchParsedInput(parsed, { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });
    const cs = scoreCandidates(parsed, matches as any);
    expect(typeof cs.totalWeight).toBe('number');
    expect(Array.isArray(cs.matchedRules)).toBe(true);
  });
});
