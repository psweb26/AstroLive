'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ProductShell } from '@/components/layout/product-shell';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { formatPrototypeSlot, loadStoredBooking, loadStoredRecommendations, loadStoredSessionBrief } from '../../lib/insight-session';
import type { SessionBrief } from '../../src/core/session-brief/buildSessionBrief';

export default function SessionBriefPage() {
  const [brief, setBrief] = useState<SessionBrief | null | undefined>();
  const [specialist, setSpecialist] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  useEffect(() => {
    const value = loadStoredSessionBrief(sessionStorage);
    const booking = loadStoredBooking(sessionStorage);
    const rec = booking ? loadStoredRecommendations(sessionStorage)?.find((item) => item.astrologer.id === booking.astrologerId) : null;
    setBrief(value);
    setSpecialist(rec?.astrologer.name ?? null);
    setSlot(booking?.scheduledAt ?? null);
  }, []);

  if (brief === undefined) return null;
  if (!brief) return <ProductShell><main className="product-page page-frame"><section className="mx-auto max-w-2xl py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Brief unavailable</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">Prepare your consultation after choosing a time.</h1><Button asChild variant="outline" className="mt-8"><Link href="/recommendations">Return to recommendations</Link></Button></section></main></ProductShell>;

  return (
    <ProductShell>
      <main className="product-page page-frame">
        <article className="mx-auto max-w-4xl py-8 sm:py-14">
          <p className="orbital-mark ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">AstroLive Session Brief</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-ink sm:text-6xl">Take this into your consultation.</h1>
          <p className="mt-7 max-w-2xl font-display text-2xl leading-[1.25] text-ink sm:text-3xl">{brief.expected_outcome}</p>

          <Divider className="mt-14" />

          <dl className="grid gap-x-12 gap-y-7 py-9 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Estimated duration</dt><dd className="mt-2 text-xl font-semibold text-ink">{brief.estimated_duration}</dd></div>{specialist ? <div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Specialist</dt><dd className="mt-2 font-display text-2xl text-ink">{specialist}</dd></div> : null}{slot ? <div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Selected prototype time</dt><dd className="mt-2 text-base font-semibold text-ink">{formatPrototypeSlot(slot)}</dd></div> : null}</dl>

          <section className="grid gap-12 border-t border-line py-10 md:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">What to discuss</p><ul className="mt-5 space-y-4">{brief.youll_probably_discuss.map((item) => <li key={item} className="border-l border-line-strong pl-4 text-base leading-7 text-ink-secondary">{item}</li>)}</ul></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Keep ready</p><ul className="mt-5 space-y-4">{brief.things_to_keep_ready.map((item) => <li key={item} className="border-l border-line-strong pl-4 text-base leading-7 text-ink-secondary">{item}</li>)}</ul></div></section>

          <section className="border-t border-line py-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Questions to bring</p><ol className="mt-5 space-y-4">{brief.suggested_questions.map((item, index) => <li key={item} className="grid grid-cols-[2rem_1fr] gap-4 text-lg leading-7 text-ink"><span className="font-display text-2xl text-ink-muted">0{index + 1}</span><span>{item}</span></li>)}</ol><p className="mt-10 max-w-2xl border-l-2 border-signal-secondary pl-5 text-sm leading-7 text-ink-secondary">{brief.pro_tip}</p></section>
        </article>
      </main>
    </ProductShell>
  );
}
