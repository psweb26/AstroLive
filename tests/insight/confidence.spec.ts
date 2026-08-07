import { describe, it, expect } from 'vitest';
import { scoreConfidence } from '../../src/core/insight/engine/confidence';
import { scoreCandidates } from '../../src/core/insight/engine/scorer';

describe('confidence spec', () => {
  it('always returns confidence <= 97 and a band', () => {
    const cs = scoreCandidates({ normalizedText: '', tokens: Object.freeze([] as any), tokenCount: 0, length: 0 } as any, Object.freeze([] as any));
    const cr = scoreConfidence(cs);
    expect(cr.confidence).toBeLessThanOrEqual(97);
    expect(['low', 'medium', 'high']).toContain(cr.band);
  });
});
