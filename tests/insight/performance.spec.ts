import { describe, it, expect, beforeAll } from 'vitest';
import { compileOntology } from '../../src/core/insight/data/compileOntology';
import { compileAliases } from '../../src/core/insight/data/compileAliases';
import { buildRuleIndex } from '../../src/core/insight/data/buildRuleIndex';
import { normalize } from '../../src/core/insight/engine/normalizer';
import { parseNormalizedText } from '../../src/core/insight/engine/parser';
import { matchParsedInput } from '../../src/core/insight/engine/matcher';
import { performance } from 'perf_hooks';

let index: any;
let aliases: any;

beforeAll(() => {
  compileOntology();
  aliases = compileAliases();
  index = buildRuleIndex();
});

function stats(durations: number[]) {
  durations.sort((a, b) => a - b);
  const sum = durations.reduce((s, v) => s + v, 0);
  const avg = sum / durations.length;
  const median = durations[Math.floor(durations.length / 2)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const max = durations[durations.length - 1];
  return { avg, median, p95, max };
}

describe('performance micro-benchmarks (normalize / parse / match)', () => {
  const iterations = 1000;

  const tiny = 'i have a small question about my job and family';
  const medium = new Array(50).fill('i have many thoughts and questions about career family finance education timing').join(' ');
  const worst = new Array(200).fill('this is a long worst-case paragraph with many tokens to stress the parser and matcher and ensure deterministic behavior across runs').join(' ');

  it('benchmarks tiny / medium / worst inputs for normalize / parse / match', () => {
    const datasets = [
      { name: 'tiny', text: tiny },
      { name: 'medium', text: medium },
      { name: 'worst', text: worst },
    ];

    for (const ds of datasets) {
      const normalizeDur: number[] = [];
      const parseDur: number[] = [];
      const matchDur: number[] = [];

      for (let i = 0; i < 20; i++) {
        const n = normalize(ds.text);
        parseNormalizedText(n);
        matchParsedInput(parseNormalizedText(n), { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });
      }

      for (let i = 0; i < iterations; i++) {
        const t0 = performance.now();
        const n = normalize(ds.text);
        const t1 = performance.now();
        const parsed = parseNormalizedText(n);
        const t2 = performance.now();
        const matches = matchParsedInput(parsed, { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });
        const t3 = performance.now();

        normalizeDur.push(t1 - t0);
        parseDur.push(t2 - t1);
        matchDur.push(t3 - t2);

        if (i === 0) {
          const m2 = matchParsedInput(parseNormalizedText(normalize(ds.text)), { phraseMap: index.phraseMap, tokenMap: index.tokenMap, styleMap: index.styleMap, aliasesMap: aliases, maxGram: 6 });
          expect(JSON.stringify(matches)).toBe(JSON.stringify(m2));
        }
      }

      console.log(`\nBenchmark results for dataset: ${ds.name} (iterations=${iterations})`);
      console.table({
        normalize: stats(normalizeDur),
        parse: stats(parseDur),
        match: stats(matchDur),
        total: stats(normalizeDur.map((v, i) => v + parseDur[i] + matchDur[i])),
      });

      expect(normalizeDur.length).toBe(iterations);
      expect(parseDur.length).toBe(iterations);
      expect(matchDur.length).toBe(iterations);
    }
  }, 120_000);
});
