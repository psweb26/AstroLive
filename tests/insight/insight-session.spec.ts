import { describe, expect, it, vi } from 'vitest';
import { analyze } from '../../src/core/insight/engine/analyze';
import type { InsightProfile } from '../../src/core/insight/types';
import {
  analyzeStoredConcern,
  CONCERN_STORAGE_KEY,
  INSIGHT_PROFILE_STORAGE_KEY,
  loadStoredInsightProfile,
} from '../../lib/insight-session';

function createStorage(initialValues: Record<string, string> = {}) {
  const values = new Map(Object.entries(initialValues));

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
  };
}

describe('analyzeStoredConcern', () => {
  it('does not call analyze when the stored concern is missing', async () => {
    const storage = createStorage();
    const analyzeConcern = vi.fn(analyze);

    const result = await analyzeStoredConcern(storage, analyzeConcern);

    expect(result.ok).toBe(false);
    expect(analyzeConcern).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('passes the real concern to analyze and persists its serialized profile', async () => {
    const concern = '  I have two job offers and need help deciding.  ';
    const storage = createStorage({ [CONCERN_STORAGE_KEY]: concern });
    const analyzeConcern = vi.fn(analyze);

    const result = await analyzeStoredConcern(storage, analyzeConcern);

    expect(result.ok).toBe(true);
    expect(analyzeConcern).toHaveBeenCalledWith(concern.trim());
    expect(storage.setItem).toHaveBeenCalledWith(
      INSIGHT_PROFILE_STORAGE_KEY,
      JSON.stringify(analyze(concern.trim())),
    );
  });

  it('does not persist a profile when analysis fails', async () => {
    const storage = createStorage({ [CONCERN_STORAGE_KEY]: 'I need guidance.' });
    const analyzeConcern = vi.fn((): Readonly<InsightProfile> => {
      throw new Error('engine failure');
    });

    const result = await analyzeStoredConcern(storage, analyzeConcern);

    expect(result.ok).toBe(false);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('serializes the same profile deterministically for the same concern', async () => {
    const concern = 'I have two job offers and need help deciding.';
    const firstStorage = createStorage({ [CONCERN_STORAGE_KEY]: concern });
    const secondStorage = createStorage({ [CONCERN_STORAGE_KEY]: concern });

    const first = await analyzeStoredConcern(firstStorage, analyze);
    const second = await analyzeStoredConcern(secondStorage, analyze);

    expect(first.ok && first.serializedProfile).toBe(second.ok && second.serializedProfile);
  });
});

describe('loadStoredInsightProfile', () => {
  it('loads and preserves a valid serialized profile exactly', () => {
    const profile = analyze('I have two job offers and need help deciding.');
    const storage = createStorage({ [INSIGHT_PROFILE_STORAGE_KEY]: JSON.stringify(profile) });

    const result = loadStoredInsightProfile(storage);

    expect(result).toEqual({ ok: true, profile });
    if (result.ok) expect(result.profile.confidence).toBe(profile.confidence);
  });

  it('returns a controlled fallback for a missing profile', () => {
    expect(loadStoredInsightProfile(createStorage())).toEqual({ ok: false });
  });

  it('returns a controlled fallback for invalid JSON', () => {
    const storage = createStorage({ [INSIGHT_PROFILE_STORAGE_KEY]: '{not valid json' });

    expect(loadStoredInsightProfile(storage)).toEqual({ ok: false });
  });

  it('returns a controlled fallback for an invalid profile shape', () => {
    const storage = createStorage({
      [INSIGHT_PROFILE_STORAGE_KEY]: JSON.stringify({ concernCategory: 'Career', confidence: 83 }),
    });

    expect(loadStoredInsightProfile(storage)).toEqual({ ok: false });
  });
});
