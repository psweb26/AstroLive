import type { ParsedInput } from './parser';
import type { RuleDef } from '../rules';

export type MatchedRule = {
  ruleId: string;
  matchedText: string;
  matchType: 'phrase' | 'token';
  score: number; // base weight from rule definition
  span: { start: number; end: number }; // token indices [start, end)
};

export type MatcherContext = {
  // Maps produced by buildRuleIndex()
  phraseMap: ReadonlyMap<string, ReadonlyArray<RuleDef>>;
  tokenMap: ReadonlyMap<string, ReadonlyArray<RuleDef>>;
  styleMap?: ReadonlyMap<string, ReadonlyArray<RuleDef>>;
  // Aliases compiled map: phrase -> alias entry (may include .phrase target)
  aliasesMap: Readonly<Record<string, { phrase: string }>> | null;
  // maxGram to consider when building n-grams (optional)
  maxGram?: number;
};

function buildNgramsFromTokens(tokens: ReadonlyArray<{ value: string }>, maxGram: number) {
  const ngrams: { phrase: string; start: number; end: number }[] = [];
  const tokenCount = tokens.length;
  const maxG = Math.min(maxGram, tokenCount);
  for (let gram = maxG; gram >= 1; gram--) {
    for (let start = 0; start + gram <= tokenCount; start++) {
      const end = start + gram;
      const phrase = tokens
        .slice(start, end)
        .map((t) => t.value)
        .join(' ');
      ngrams.push({ phrase, start, end });
    }
  }
  return ngrams;
}

export function matchParsedInput(parsed: ParsedInput, ctx: MatcherContext): ReadonlyArray<MatchedRule> {
  const tokens = parsed.tokens;
  const tokenCount = tokens.length;
  const matches: MatchedRule[] = [];
  const seen = new Set<string>();
  const maxGram = ctx.maxGram ?? 6;

  function record(rule: RuleDef, matchedText: string, matchType: 'phrase' | 'token', start: number, end: number) {
    if (seen.has(rule.id)) return; // deduplicate by ruleId (first match wins)
    seen.add(rule.id);
    matches.push({ ruleId: rule.id, matchedText, matchType, score: rule.weight, span: { start, end } });
  }

  // Build n-grams (matcher owns n-gram windows)
  const ngrams = buildNgramsFromTokens(tokens as any, maxGram);

  // 1) Phrase & alias matching using phraseMap (O(1) lookup per ngram)
  for (const ngram of ngrams) {
    const phrase = ngram.phrase;
    if (!phrase) continue;

    // Alias resolution first: if alias exists, resolve to target phrase and then lookup rules
    const aliasEntry = ctx.aliasesMap && ctx.aliasesMap[phrase];
    if (aliasEntry && aliasEntry.phrase) {
      const target = aliasEntry.phrase;
      const ruleList = ctx.phraseMap.get(target) || ctx.phraseMap.get(phrase);
      if (ruleList && ruleList.length > 0) {
        for (const r of ruleList) {
          record(r, phrase, 'phrase', ngram.start, ngram.end);
        }
        continue; // prefix handled
      }
    }

    // Direct phrase lookup
    const rules = ctx.phraseMap.get(phrase);
    if (rules && rules.length > 0) {
      for (const r of rules) {
        record(r, phrase, 'phrase', ngram.start, ngram.end);
      }
    }
  }

  // 2) Token matching (left-to-right). Use tokenMap lookups for each token-window.
  for (let i = 0; i < tokenCount; i++) {
    // try longer token-patterns first for this start index
    for (let gram = Math.min(maxGram, tokenCount - i); gram >= 1; gram--) {
      const end = i + gram;
      const phrase = tokens.slice(i, end).map((t) => t.value).join(' ');
      const rules = ctx.tokenMap.get(phrase);
      if (rules && rules.length > 0) {
        for (const r of rules) {
          record(r, phrase, 'token', i, end);
        }
        // do NOT break; allow shorter token matches as well (spec permits multiple matches)
      }
    }
  }

  // Deterministic ordering: start asc, end desc, score desc, ruleId
  matches.sort((a, b) => {
    if (a.span.start !== b.span.start) return a.span.start - b.span.start;
    if (a.span.end !== b.span.end) return b.span.end - a.span.end;
    if (a.score !== b.score) return b.score - a.score;
    return a.ruleId.localeCompare(b.ruleId);
  });

  return Object.freeze(matches.map((m) => Object.freeze(m)));
}
