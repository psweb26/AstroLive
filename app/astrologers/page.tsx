import Link from 'next/link';

import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { astrologers } from '@/data/astrologers';

export default function AstrologersPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <main className="page-frame product-page">
        <header className="max-w-4xl"><p className="orbital-mark ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Specialists at AstroLive</p><h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-ink sm:text-6xl">A thoughtful introduction, not a generic directory.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-ink-secondary">AstroLive makes a personal recommendation after interpreting your question. This is a small featured sample, not a live searchable marketplace.</p><Button asChild variant="signal" className="mt-8"><Link href="/understanding-you">Begin with your question</Link></Button></header>

        <Divider className="mt-16" />

        <section className="max-w-5xl py-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">Featured sample</p><ol className="mt-6 divide-y divide-line border-y border-line">{astrologers.map((astrologer, index) => <li key={astrologer.id} className="grid gap-5 py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)_13rem] sm:items-start"><span className="font-display text-3xl text-ink-muted">0{index + 1}</span><div><h2 className="text-2xl font-semibold text-ink sm:text-3xl">{astrologer.name}</h2><p className="mt-2 text-base leading-7 text-ink-secondary">{astrologer.specialization}</p><p className="mt-4 text-sm text-ink-muted">{astrologer.experience} years of experience · {astrologer.languages.join(', ')}</p></div><p className="border-l border-line pl-4 text-sm leading-6 text-ink-secondary sm:border-l">AstroLive will explain relevance, trust evidence, and the consultation next step after your insight.</p></li>)}</ol></section>
      </main>
    </div>
  );
}
