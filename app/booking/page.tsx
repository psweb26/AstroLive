'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ProductShell } from '@/components/layout/product-shell';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { loadStoredRecommendations, createBooking, storeBooking } from '../../lib/insight-session';
import type { Recommendation } from '../../src/core/recommendation/types';

const SLOTS = ['Today · 6:00 PM', 'Today · 7:00 PM', 'Tomorrow · 10:00 AM', 'Tomorrow · 5:00 PM'];

function Content() {
  const router = useRouter();
  const id = useSearchParams().get('astrologer');
  const [rec, setRec] = useState<Recommendation | null | undefined>();
  const [slot, setSlot] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setRec(loadStoredRecommendations(sessionStorage)?.find((item) => item.astrologer.id === id) ?? null), [id]);

  if (rec === undefined) return null;
  if (!rec) return <ProductShell><main className="product-page page-frame"><section className="mx-auto max-w-2xl py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Consultation unavailable</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">Return to your considered matches.</h1><Button asChild variant="outline" className="mt-8"><Link href="/recommendations">Return to recommendations</Link></Button></section></main></ProductShell>;

  const confirm = () => {
    if (!slot) { setError('Choose a prototype consultation time to continue.'); return; }
    storeBooking(sessionStorage, createBooking(rec.astrologer.id, slot));
    router.push('/success');
  };

  return (
    <ProductShell>
      <main className="product-page page-frame">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Consultation preparation</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20">
            <header><h1 className="text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-ink sm:text-6xl">Choose a time to continue with {rec.astrologer.name}.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-ink-secondary">This conversation follows the match AstroLive prepared from your interpretation.</p></header>
            <aside className="self-start border-t border-line pt-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Your specialist</p><p className="mt-3 font-display text-3xl text-ink">{rec.astrologer.name}</p><p className="mt-2 text-sm leading-6 text-ink-secondary">{rec.astrologer.specializations.join(' · ')}</p></aside>
          </div>

          <Divider className="mt-14" />

          <section className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Prototype time choices</p>
              <fieldset className="mt-6"><legend className="text-2xl font-semibold text-ink">Select a consultation time</legend><p className="mt-3 text-sm leading-6 text-ink-secondary">Choose the time that works best for this demo consultation flow.</p><div className="mt-7 grid border-y border-line sm:grid-cols-2">{SLOTS.map((value) => { const selected = slot === value; return <button key={value} type="button" aria-pressed={selected} onClick={() => { setSlot(value); setError(''); }} className={`min-h-16 border-b border-line px-4 py-4 text-left text-base font-semibold transition-[background-color,border-color,color,box-shadow] duration-150 last:border-b-0 focus-visible:outline-none sm:even:border-l sm:odd:last:border-b-0 ${selected ? 'relative z-10 bg-surface-elevated text-signal-secondary shadow-[inset_0_0_0_1px_hsl(var(--accent-secondary))]' : 'text-ink hover:bg-surface-muted/60'}`}><span>{value}</span>{selected ? <span className="ml-3 text-xs font-medium uppercase tracking-[0.14em]">Selected</span> : null}</button>; })}</div></fieldset>
              {slot ? <p className="mt-5 text-sm text-ink-secondary">Selected time: <span className="font-semibold text-ink">{slot}</span></p> : null}
              {error ? <Alert tone="danger" className="mt-5">{error}</Alert> : null}
            </div>
            <aside className="self-start border-t border-line pt-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Why this continues naturally</p><p className="mt-3 text-sm leading-6 text-ink-secondary">{rec.matchExplanation}</p></aside>
          </section>

          <section className="flex flex-col-reverse justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-start"><p className="max-w-xl text-sm leading-6 text-ink-muted">Prototype disclosure: this confirms a local demo booking only. No payment, live availability check, or real reservation is made.</p><Button type="button" variant="signal" onClick={confirm} disabled={!slot}>Prepare consultation</Button></section>
        </div>
      </main>
    </ProductShell>
  );
}

export default function BookingPage() {
  return <Suspense fallback={null}><Content /></Suspense>;
}
