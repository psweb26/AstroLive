'use client';

import React from 'react';

export default function LoadingAnalysis({ isComplete, concern }: { isComplete: boolean; concern?: string }) {
  return (
    <section aria-live="polite" className="mx-auto grid max-w-4xl items-center gap-12 py-12 text-center md:grid-cols-[1fr_auto] md:text-left">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">AstroLive is listening</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-ink sm:text-5xl">{isComplete ? 'Your interpretation is ready.' : 'Interpreting the question you shared.'}</h1>
        {concern ? <p className="mt-6 max-w-xl border-l border-line-strong pl-4 text-base leading-7 text-ink-secondary">“{concern}”</p> : null}
        <p className="mt-6 max-w-xl text-sm leading-6 text-ink-muted">{isComplete ? 'We’re bringing together what AstroLive understood.' : 'AstroLive is using your words to identify the kind of guidance that may be most useful.'}</p>
      </div>
      <div className={`interpretation-orbit ${isComplete ? '' : 'interpretation-orbit-active motion-reduce:animate-none'}`} aria-hidden="true"><span className="interpretation-orbit-dot" /></div>
    </section>
  );
}
