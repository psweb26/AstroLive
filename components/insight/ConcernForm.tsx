'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { INSIGHT_PROFILE_STORAGE_KEY } from '../../lib/insight-session';
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

export default function ConcernForm() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      router.push('/analyzing');
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

      <div className="mt-10 border-t border-line pt-6">
        <p className="text-sm font-semibold text-ink">A prompt, if you want one</p>
        <p className="mt-1 text-sm text-ink-muted">These are optional starting points; your own words lead the interpretation.</p>
        <div className="mt-4"><CategoryChips selected={category} onSelect={handleSelectCategory} /></div>
      </div>

      <div className="mt-6"><PrivacyNote /></div>
      {error ? <Alert tone="danger" className="mt-5">{error}</Alert> : null}

      <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <p className="text-sm text-ink-muted">Your interpretation stays within this browser session.</p>
        <Button type="submit" variant="signal">Continue to interpretation</Button>
      </div>
    </form>
  );
}
