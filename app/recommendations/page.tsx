'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { JourneyMarker } from '@/components/insight/JourneyMarker';
import { ProductShell } from '@/components/layout/product-shell';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { LoadingState } from '@/components/ui/loading-state';
import { TrustIndicator } from '@/components/ui/trust-indicator';
import { loadStoredInsightProfile, storeRecommendations } from '../../lib/insight-session';
import type { Recommendation } from '../../src/core/recommendation/types';

type PageState = 'loading' | 'success' | 'error';

function SpecialistList({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {recommendations.map((rec, index) => (
        <li key={rec.astrologer.id} className="grid gap-4 py-7 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-start">
          <span className="font-display text-3xl text-ink-muted">0{index + 2}</span>
          <div><h3 className="text-2xl font-semibold text-ink">{rec.astrologer.name}</h3><p className="mt-1 text-sm text-ink-secondary">{rec.astrologer.specializations.join(' · ')}</p><p className="mt-4 max-w-2xl text-sm leading-6 text-ink-secondary">{rec.matchExplanation}</p></div>
          <Button asChild variant="quiet" size="sm" className="justify-self-start sm:justify-self-end"><Link href={`/astrologers/${rec.astrologer.id}`}>View profile</Link></Button>
        </li>
      ))}
    </ol>
  );
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const profileResult = loadStoredInsightProfile(window.sessionStorage);
        if (!profileResult.ok) { setError('Your insight is not available yet.'); setState('error'); return; }

        const response = await fetch('/api/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ insightProfile: profileResult.profile }) });
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);

        const data = await response.json();
        storeRecommendations(window.sessionStorage, data.recommendations);
        setRecommendations(data.recommendations);
        setState('success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setState('error');
      }
    }
    void fetchRecommendations();
  }, []);

  if (state === 'loading') {
    return <ProductShell><main className="product-page page-frame"><JourneyMarker current={4} /><section className="mx-auto max-w-2xl py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Matching your interpretation</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">Finding the people most prepared to help.</h1><LoadingState className="mt-8" label="Using the interpretation you just reviewed." /></section></main></ProductShell>;
  }

  if (state === 'error') {
    const needsInsight = error === 'Your insight is not available yet.';
    return <ProductShell><main className="product-page page-frame"><JourneyMarker current={4} /><section className="mx-auto max-w-2xl py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-danger">Matching unavailable</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">We couldn’t prepare the right matches.</h1><Alert tone="danger" className="mt-8">{error}</Alert>{needsInsight ? <Button asChild variant="outline" className="mt-8"><Link href="/understanding-you">Return to your question</Link></Button> : null}</section></main></ProductShell>;
  }

  if (recommendations.length === 0) {
    return <ProductShell><main className="product-page page-frame"><JourneyMarker current={4} /><section className="mx-auto max-w-2xl py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">No match yet</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">There isn’t a strong recommendation from this interpretation.</h1><p className="mt-5 text-lg leading-8 text-ink-secondary">You can return to your question and add context if you would like a more specific reading.</p><Button asChild variant="outline" className="mt-8"><Link href="/understanding-you">Refine your question</Link></Button></section></main></ProductShell>;
  }

  const best = recommendations[0];
  const others = recommendations.slice(1);

  return (
    <ProductShell>
      <main className="product-page page-frame">
        <JourneyMarker current={4} />
        <header className="mt-12 max-w-4xl"><p className="orbital-mark ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">A considered connection</p><h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-ink sm:text-6xl">The person AstroLive would start with.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-ink-secondary">This recommendation follows the interpretation you just reviewed—not a generic directory ranking.</p></header>

        <Divider className="mt-14" />

        <section className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1.2fr)_18rem] lg:gap-20">
          <div>
            <p className="font-display text-3xl text-ink-muted">01 / Best match</p>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
              <div aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-muted font-display text-3xl text-signal-secondary">{best.astrologer.name.charAt(0)}</div>
              <div><h2 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl">{best.astrologer.name}</h2><p className="mt-3 text-lg leading-7 text-ink-secondary">{best.astrologer.specializations.join(' · ')}</p><p className="mt-2 text-sm text-ink-muted">{best.astrologer.experience_years} years of experience · {best.astrologer.languages.join(', ')}</p></div>
            </div>

            <p className="mt-10 max-w-3xl border-l-2 border-signal-secondary pl-5 font-display text-2xl leading-[1.25] text-ink sm:text-3xl">{best.matchExplanation}</p>

            <div className="mt-10"><p className="text-sm font-semibold text-ink">What supports this match</p><ul className="mt-4 space-y-3">{best.topSignals.map((signal) => <li key={signal.label} className="border-l border-line-strong pl-4 text-sm leading-6 text-ink-secondary">{signal.label}</li>)}</ul></div>
            <Button asChild variant="signal" className="mt-10"><Link href={`/astrologers/${best.astrologer.id}`}>Meet {best.astrologer.name}</Link></Button>
          </div>

          <aside className="self-start border-t border-line pt-5">
            <TrustIndicator score={best.trustScore} />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Evidence behind trust</p>
            <dl className="mt-4 divide-y divide-line border-y border-line text-sm">{best.trustBreakdown.map((component) => <div key={component.name} className="flex items-start justify-between gap-4 py-3"><dt className="text-ink-secondary">{component.label}</dt><dd className="shrink-0 font-semibold tabular-nums text-ink">{component.value}</dd></div>)}</dl>
            <p className="mt-4 text-xs leading-5 text-ink-muted">Trust is computed from verified evidence, consultation history, repeat clients, experience, and completion rate.</p>
          </aside>
        </section>

        {others.length > 0 ? <section className="mt-8 max-w-5xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Also considered</p><h2 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">Other strong fits for this reading.</h2><div className="mt-8"><SpecialistList recommendations={others} /></div></section> : null}
      </main>
    </ProductShell>
  );
}
