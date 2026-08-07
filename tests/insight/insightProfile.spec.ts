import { describe, it, expect } from 'vitest';
import { buildInsightProfile } from '../../src/core/insight/builders/insightProfile';
import { scoreCandidates } from '../../src/core/insight/engine/scorer';
import { scoreConfidence } from '../../src/core/insight/engine/confidence';

describe('insightProfile builder', () => {
  it('builds immutable InsightProfile with required fields', () => {
    const parsed: any = { normalizedText: '', tokens: Object.freeze([] as any), tokenCount: 0, length: 0 };
    const matches: any[] = [];
    const cs = scoreCandidates(parsed, Object.freeze(matches));
    const conf = scoreConfidence(cs);
    const p = buildInsightProfile('test', cs, conf as any);
    expect(typeof p.id).toBe('string');
    expect(typeof p.concernCategory).toBe('string');
    expect(p.confidence).toBe(conf.confidence);
    expect(Array.isArray(p.explanation)).toBe(true);
    expect(Object.isFrozen(p)).toBe(true);
  });
});
