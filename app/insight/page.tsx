'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { JourneyMarker } from '@/components/insight/JourneyMarker';
import ConfidenceBar from '../../components/insight/ConfidenceBar';
import { ProductShell } from '@/components/layout/product-shell';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { loadStoredInsightProfile } from '../../lib/insight-session';
import type { InsightProfile } from '../../src/core/insight/types';

export default function InsightPage() {
  const [insight, setInsight] = useState<Readonly<InsightProfile> | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  useEffect(() => {
    const result = loadStoredInsightProfile(window.sessionStorage);
    if (result.ok) setInsight(result.profile);
    setHasLoaded(true);
  }, []);

  if (!hasLoaded) return null;

  if (!insight) {
    return <ProductShell><main className="product-page page-frame"><JourneyMarker current={3} /><section className="mx-auto max-w-2xl py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">No interpretation yet</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">Your question is the place to begin.</h1><p className="mt-5 text-lg leading-8 text-ink-secondary">Tell AstroLive what is on your mind, and we’ll prepare an interpretation from there.</p><Button asChild variant="signal" className="mt-8"><Link href="/understanding-you">Share your question</Link></Button></section></main></ProductShell>;
  }

  const lowConfidence = insight.confidence < 60;
  const primaryObservation = insight.explanation[0];
  const supportingObservations = insight.explanation.slice(1);

  return (
    <ProductShell>
      <main className="product-page page-frame">
        <JourneyMarker current={3} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20">
          <header className="max-w-4xl">
            <p className="orbital-mark ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">AstroLive interpretation</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-ink sm:text-6xl">What we understood.</h1>
            <p className="mt-8 max-w-3xl font-display text-3xl leading-[1.14] text-ink sm:text-4xl">{insight.quickInsightText}</p>
          </header>

          <aside className="self-start border-t border-line pt-5 lg:mt-20">
            <ConfidenceBar confidence={insight.confidence} />
          </aside>
        </div>

        <Divider className="mt-14" />

        <section className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">The primary reading</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl">{insight.concernCategory}</h2>
            <p className="mt-4 max-w-2xl text-xl leading-8 text-ink-secondary">{insight.subcategory}</p>

            <div className="mt-12 max-w-2xl border-l border-line-strong pl-5" aria-label="What AstroLive noticed">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal-secondary">What AstroLive noticed</p>
              {primaryObservation ? <p className="mt-3 text-base leading-7 text-ink-secondary">{primaryObservation.message}</p> : <p className="mt-3 text-base leading-7 text-ink-secondary">This interpretation is based on the context you shared.</p>}
              {supportingObservations.length > 0 ? <><button type="button" aria-expanded={evidenceOpen} aria-controls="supporting-observations" onClick={() => setEvidenceOpen((value) => !value)} className="mt-4 text-sm font-semibold text-signal-secondary underline-offset-4 hover:underline">{evidenceOpen ? 'Hide supporting observations' : 'See why'}</button>{evidenceOpen ? <ul id="supporting-observations" className="mt-4 space-y-3" aria-label="Supporting observations">{supportingObservations.map((explanation) => <li key={explanation.ruleId} className="border-l border-line pl-4 text-sm leading-6 text-ink-secondary">{explanation.message}</li>)}</ul> : null}</> : null}
            </div>
          </div>

          <dl className="self-start border-t border-line pt-5 text-sm">
            <div className="pb-5"><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Primary need</dt><dd className="mt-2 text-base font-semibold text-ink">{insight.primaryNeed}</dd></div>
            <div className="border-t border-line py-5"><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Urgency</dt><dd className="mt-2 text-base font-semibold capitalize text-ink">{insight.urgency}</dd></div>
            <div className="border-t border-line pt-5"><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Conversation style</dt><dd className="mt-2 text-base font-semibold capitalize text-ink">{insight.consultationStyleHint ?? 'Not specified'}</dd></div>
          </dl>
        </section>

        {lowConfidence ? <Alert tone="warning" className="max-w-3xl"><p>Not quite enough context yet. Add a little more detail so AstroLive can interpret the concern more precisely.</p><Button asChild variant="quiet" size="sm" className="mt-2 px-0"><Link href="/understanding-you">Add more detail</Link></Button></Alert> : null}

        <section className="mt-14 border-t border-line pt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">A considered next step</p>
            <h2 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">The guidance that fits this reading.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-secondary">{insight.suggestedConsultation}</p>
          </div>
          <div className="mt-7 lg:mt-0"><Button asChild variant="signal"><Link href="/recommendations">Find the right astrologer</Link></Button><p className="mt-4 text-sm leading-6 text-ink-muted">AstroLive will explain why each person is a fit for this interpretation.</p></div>
        </section>
      </main>
    </ProductShell>
  );
}
