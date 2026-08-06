import { describe, it, expect } from 'vitest';
import { normalize } from './normalizer';

describe('normalizer', () => {
  it('lowercases text', () => {
    expect(normalize('HELLO WORLD')).toBe('hello world');
  });

  it('removes punctuation', () => {
    expect(normalize("I HAVE TWO JOB OFFERS!!!")).toBe('i have two job offers');
    expect(normalize('what??!! when...')).toBe('what when');
  });

  it('collapses repeated spaces and trims', () => {
    expect(normalize('  multiple   spaces  here ')).toBe('multiple spaces here');
    expect(normalize('\t tabs\n and   spaces')).toBe('tabs and spaces');
  });

  it('handles empty and whitespace-only input', () => {
    expect(normalize('')).toBe('');
    expect(normalize('   ')).toBe('');
    expect(normalize(null)).toBe('');
    expect(normalize(undefined)).toBe('');
  });

  it('is idempotent', () => {
    const s = "I HAVE TWO JOB OFFERS!!!";
    expect(normalize(normalize(s))).toBe(normalize(s));
  });

  it('handles unicode whitespace and special characters', () => {
    // NBSP and em dash
    const raw = 'Two\u00A0Job\u2014Offers';
    expect(normalize(raw)).toBe('two job offers');
  });

  it('already normalized input remains unchanged', () => {
    const n = 'i have two job offers';
    expect(normalize(n)).toBe(n);
  });

  it('preserves semantic words', () => {
    expect(normalize("don't panic")).toBe('don t panic');
  });
});
