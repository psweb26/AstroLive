'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { JourneyMarker } from '@/components/insight/JourneyMarker';
import { ProductShell } from '@/components/layout/product-shell';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { TrustIndicator } from '@/components/ui/trust-indicator';
import { astrologers as directoryAstrologers } from '@/data/astrologers';
import { loadStoredRecommendations } from '../../../lib/insight-session';
import type { Recommendation } from '../../../src/core/recommendation/types';

export default function AstrologerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [recommendation, setRecommendation] = useState<Recommendation | null | undefined>();

  useEffect(() => {
    const recommendations = loadStoredRecommendations(window.sessionStorage);
    setRecommendation(recommendations?.find((item) => item.astrologer.id === id) ?? null);
  }, [id]);

  if (recommendation === undefined) return null;
  const directoryProfile = directoryAstrologers.find((astrologer) => astrologer.id === id);
  if (!recommendation) {
    if (!directoryProfile) {
      return <ProductShell><main className="product-page page-frame"><section className="mx-auto max-w-2xl py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Specialist unavailable</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">This profile is not available.</h1><Button asChild variant="outline" className="mt-8"><Link href="/astrologers">Return to astrologers</Link></Button></section></main></ProductShell>;
    }

    return <ProductShell><main className="product-page page-frame"><section className="mx-auto max-w-3xl py-12 sm:py-20"><p className="orbital-mark ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Specialist introduction</p><h1 className="mt-5 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-ink sm:text-6xl">{directoryProfile.name}</h1><p className="mt-5 max-w-2xl text-xl leading-8 text-ink-secondary">{directoryProfile.specialization}</p><dl className="mt-12 grid gap-6 border-y border-line py-7 sm:grid-cols-3"><div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Experience</dt><dd className="mt-2 text-lg font-semibold text-ink">{directoryProfile.experience} years</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Languages</dt><dd className="mt-2 text-lg font-semibold text-ink">{directoryProfile.languages.join(', ')}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Consultation from</dt><dd className="mt-2 text-lg font-semibold text-ink">₹{directoryProfile.price}</dd></div></dl><div className="mt-10 border-l-2 border-signal-secondary pl-5"><p className="font-display text-2xl leading-[1.25] text-ink sm:text-3xl">Begin with your question so AstroLive can explain the most relevant specialist and prepare the consultation context.</p><Button asChild variant="signal" className="mt-7"><Link href="/understanding-you">Start an insight</Link></Button></div></section></main></ProductShell>;
  }

  const { astrologer, trustScore, trustBreakdown, matchExplanation, topSignals } = recommendation;

  return (
    <ProductShell>
      <main className="product-page page-frame">
        <JourneyMarker current={4} />
        <section className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
          <div>
            <p className="orbital-mark ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">A relevant specialist</p>
            <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-start">
              <div aria-hidden="true" className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-muted font-display text-4xl text-signal-secondary">{astrologer.name.charAt(0)}</div>
              <div><h1 className="text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-ink sm:text-6xl">{astrologer.name}</h1><p className="mt-4 max-w-2xl text-xl leading-8 text-ink-secondary">{astrologer.specializations.join(' · ')}</p><p className="mt-3 text-sm leading-6 text-ink-muted">{astrologer.experience_years} years of experience · {astrologer.languages.join(', ')} · {astrologer.consultation_style} consultation style</p></div>
            </div>
          </div>
          <aside className="self-start border-t border-line pt-5 lg:mt-20"><TrustIndicator score={trustScore} /></aside>
        </section>

        <Divider className="mt-14" />

        <section className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Why AstroLive recommended this person</p>
            <p className="mt-5 max-w-3xl border-l-2 border-signal-secondary pl-5 font-display text-3xl leading-[1.2] text-ink sm:text-4xl">{matchExplanation}</p>
            <div className="mt-10"><p className="text-sm font-semibold text-ink">Relevant signals</p><ul className="mt-4 space-y-3">{topSignals.map((signal) => <li key={signal.label} className="border-l border-line-strong pl-4 text-sm leading-6 text-ink-secondary">{signal.label}</li>)}</ul></div>
          </div>
          <aside className="self-start border-t border-line pt-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Trust evidence</p><dl className="mt-4 divide-y divide-line border-y border-line text-sm">{trustBreakdown.map((component) => <div key={component.name} className="flex items-start justify-between gap-4 py-3"><dt className="text-ink-secondary">{component.label}</dt><dd className="shrink-0 font-semibold tabular-nums text-ink">{component.value}</dd></div>)}</dl><p className="mt-4 text-xs leading-5 text-ink-muted">Trust reflects the verified evidence available in AstroLive’s recommendation data.</p></aside>
        </section>

        <section className="border-t border-line pt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Consultation</p><h2 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">Continue with a focused conversation.</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-ink-secondary">{astrologer.short_description}</p><p className="mt-5 text-sm text-ink-muted">Consultation range: ₹{astrologer.price_min}–₹{astrologer.price_max}</p></div>
          <div className="mt-7 lg:mt-0"><Button asChild variant="signal"><Link href={`/booking?astrologer=${astrologer.id}`}>Choose a consultation time</Link></Button><p className="mt-4 text-sm leading-6 text-ink-muted">AstroLive will prepare the next step using the selected prototype time.</p></div>
        </section>
      </main>
    </ProductShell>
  );
}
