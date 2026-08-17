'use client';

import React, { FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { INSIGHT_PROFILE_STORAGE_KEY, isInsightProfile } from '../../lib/insight-session';
import type { InsightProfile } from '../../src/core/insight/types';
import CategoryChips from './CategoryChips';
import PrivacyNote from './PrivacyNote';

const EXAMPLES: Record<string, string> = {
  Career: "I'm confused between two job offers.",
  Relationship: 'My relationship has become stressful.',
  Finance: 'I want to know if this is a good time to start my business.',
  Education: "I'm unsure about which course to take next.",
  Health: "I'm worried about recent health changes.",
  Spiritual: 'I want guidance on my spiritual path.',
};

const MINIMUM_PREVIEW_LENGTH = 24;
type PreviewState = 'idle' | 'listening' | 'ready';

export default function ConcernForm() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<Readonly<InsightProfile> | null>(null);
  const [previewState, setPreviewState] = useState<PreviewState>('idle');
  const requestId = useRef(0);

  useEffect(() => {
    const concern = text.trim();
    if (concern.length < MINIMUM_PREVIEW_LENGTH) {
      setPreview(null);
      setPreviewState('idle');
      return;
    }

    const currentRequest = ++requestId.current;
    const controller = new AbortController();
    setPreview(null);
    setPreviewState('listening');

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ free_text: concern }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Preview unavailable');

        const result: unknown = await response.json();
        if (requestId.current !== currentRequest || !isInsightProfile(result) || result.concernCategory === 'Unknown' || result.explanation.length === 0) return;

        setPreview(result);
        setPreviewState('ready');
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        if (requestId.current === currentRequest) setPreviewState('idle');
      }
    }, 650);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [text]);

  function updateText(value: string) {
    setText(value);
    if (error) setError(null);
  }

  function handleSelectCategory(cat: string) {
    setCategory(cat);
    if (text.trim().length === 0) setText(EXAMPLES[cat] || '');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const concern = String(new FormData(event.currentTarget).get('concern') ?? '').trim();
    if (!concern) {
      setError('Please tell us what is on your mind before continuing.');
      return;
    }

    try {
      window.sessionStorage.removeItem(INSIGHT_PROFILE_STORAGE_KEY);
      window.sessionStorage.setItem('astrolive.concern', concern);
      if (preview?.free_text?.trim() === concern) {
        window.sessionStorage.setItem(INSIGHT_PROFILE_STORAGE_KEY, JSON.stringify(preview));
      }
      startTransition(() => router.push('/analyzing'));
    } catch {
      setError('We could not prepare your concern for analysis. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="concern" className="text-sm font-semibold text-ink">What would you like to understand?</label>
        <span className="text-xs text-ink-muted">Write in your own words</span>
      </div>
      <Textarea
        id="concern"
        name="concern"
        value={text}
        aria-describedby="concern-guidance"
        aria-invalid={error ? true : undefined}
        onChange={(event) => updateText(event.target.value)}
        onInput={(event) => updateText(event.currentTarget.value)}
        placeholder="I feel stuck in my career and I’m not sure whether I should change direction."
        className="mt-4 min-h-[17rem] border-line-strong bg-surface-elevated px-5 py-5 font-display text-2xl leading-relaxed placeholder:font-sans placeholder:text-base placeholder:leading-7 placeholder:text-ink-muted focus:border-signal-secondary sm:text-3xl"
      />
      <p id="concern-guidance" className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">There is no required format. Share the context, decision, or feeling that matters most to you.</p>

      {previewState !== 'idle' ? (
        <section aria-live="polite" aria-label="Interpretation preview" className="mt-6 max-w-2xl border-l border-line-strong pl-4">
          {previewState === 'listening' ? <p className="text-sm leading-6 text-ink-muted">AstroLive is quietly considering what you&apos;ve shared.</p> : null}
          {previewState === 'ready' && preview ? <><p className="text-xs font-semibold uppercase tracking-[0.14em] text-signal-secondary">What AstroLive is picking up</p><p className="mt-2 font-display text-2xl leading-tight text-ink">{preview.subcategory}</p><p className="mt-2 text-sm leading-6 text-ink-secondary">A {preview.primaryNeed.toLowerCase()} focus is beginning to emerge.</p></> : null}
        </section>
      ) : null}

      <div className="mt-10 border-t border-line pt-6">
        <p className="text-sm font-semibold text-ink">A prompt, if you want one</p>
        <p className="mt-1 text-sm text-ink-muted">These are optional starting points; your own words lead the interpretation.</p>
        <div className="mt-4"><CategoryChips selected={category} onSelect={handleSelectCategory} /></div>
      </div>

      <div className="mt-6"><PrivacyNote /></div>
      {error ? <Alert tone="danger" className="mt-5">{error}</Alert> : null}

      <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <p className="text-sm text-ink-muted">Your interpretation stays within this browser session.</p>
        <Button type="submit" variant="signal" disabled={isPending}>{isPending ? 'Preparing interpretation…' : 'Continue to interpretation'}</Button>
      </div>
    </form>
  );
}
