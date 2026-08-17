'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ProductShell } from '@/components/layout/product-shell';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { formatPrototypeSlot, loadStoredBooking, loadStoredInsightProfile, loadStoredRecommendations, storeSessionBrief, type Booking } from '../../lib/insight-session';
import { buildSessionBrief } from '../../src/core/session-brief/buildSessionBrief';

export default function SuccessPage() {
  const [booking, setBooking] = useState<Booking | null | undefined>();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const value = loadStoredBooking(sessionStorage);
    const rec = value ? loadStoredRecommendations(sessionStorage)?.find((item) => item.astrologer.id === value.astrologerId) : null;
    const insight = loadStoredInsightProfile(sessionStorage);
    setBooking(value);
    setName(rec?.astrologer.name ?? null);
    if (value && rec && insight.ok) storeSessionBrief(sessionStorage, buildSessionBrief(insight.profile, rec.astrologer, value));
  }, []);

  if (booking === undefined) return null;
  if (!booking || !name) return <ProductShell><main className="product-page page-frame"><section className="mx-auto max-w-2xl py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Preparation unavailable</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">Return to your recommended specialist.</h1><Button asChild variant="outline" className="mt-8"><Link href="/recommendations">Return to recommendations</Link></Button></section></main></ProductShell>;

  return (
    <ProductShell>
      <main className="product-page page-frame">
        <section className="mx-auto max-w-4xl py-8 sm:py-14">
          <p className="orbital-mark ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Consultation prepared</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-ink sm:text-6xl">Your next conversation has a clear starting point.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ink-secondary">AstroLive has prepared the consultation context for your selected prototype time with {name}.</p>

          <Divider className="mt-14" />

          <dl className="grid gap-x-12 gap-y-7 py-10 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Specialist</dt><dd className="mt-2 font-display text-3xl text-ink">{name}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Selected time</dt><dd className="mt-2 text-xl font-semibold text-ink">{formatPrototypeSlot(booking.scheduledAt)}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Booking status</dt><dd className="mt-2 text-base font-semibold capitalize text-ink">{booking.status}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Reference</dt><dd className="mt-2 break-all text-sm text-ink-secondary">{booking.bookingId}</dd></div></dl>

          <section className="border-t border-line pt-8 sm:flex sm:items-start sm:justify-between sm:gap-10"><p className="max-w-xl text-sm leading-6 text-ink-muted">Prototype disclosure: no payment or real reservation has been made. The next step is a locally prepared Session Brief.</p><Button asChild variant="signal" className="mt-6 sm:mt-0"><Link href="/session-brief">Open your Session Brief</Link></Button></section>
        </section>
      </main>
    </ProductShell>
  );
}
