'use client';

import ConcernForm from '../../components/insight/ConcernForm';
import { JourneyMarker } from '@/components/insight/JourneyMarker';
import { ProductShell } from '@/components/layout/product-shell';
import { PageHeading } from '@/components/ui/heading';

export default function UnderstandingYouPage() {
  return (
    <ProductShell>
      <main className="product-page page-frame">
        <JourneyMarker current={1} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-20">
          <div>
            <PageHeading eyebrow="A private starting point">Begin with the question that is staying with you.</PageHeading>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-secondary">AstroLive reads the situation you describe, then makes its interpretation and the next helpful conversation clear.</p>
            <div className="mt-12"><ConcernForm /></div>
          </div>
          <aside className="self-start border-t border-line pt-5 lg:mt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-secondary">Your control</p>
            <p className="mt-3 text-sm leading-6 text-ink-secondary">You choose what to share. A category is never required, and you can start again whenever you need to.</p>
          </aside>
        </div>
      </main>
    </ProductShell>
  );
}
