import { describe, it, expect } from 'vitest';
import { analyze } from '../../src/core/insight/engine/analyze';

describe('analyze end-to-end', () => {
  it('produces deterministic InsightProfile and explains confidence', () => {
    const inText = 'I have two job offers.';
    const p1 = analyze(inText);
    const p2 = analyze(inText);
    expect(JSON.stringify(p1)).toBe(JSON.stringify(p2));
    if (p1.confidence > 0) {
      expect(p1.explanation.length).toBeGreaterThan(0);
    }
  });
});
