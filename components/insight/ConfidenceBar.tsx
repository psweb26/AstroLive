'use client';

import React, { useMemo } from 'react';

export default function ConfidenceBar({ confidence }: { confidence: number }) {
  const safe = Math.max(0, Math.min(100, Math.round(confidence)));

  const band = useMemo(() => {
    if (safe >= 85) return { text: 'High Confidence', color: '#10b981' };
    if (safe >= 60) return { text: 'Medium Confidence', color: '#f59e0b' };
    return { text: 'Low Confidence', color: '#ef4444' };
  }, [safe]);

  const prefersReduced = usePrefersReducedMotion();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 700, color: '#e6eef8' }}>Confidence</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>{safe}%</div>
      </div>
      <div style={{ height: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 8, overflow: 'hidden' }} aria-hidden>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safe}
          aria-valuetext={`${safe}% confidence`}
          style={{
            height: '100%',
            width: `${safe}%`,
            background: `linear-gradient(90deg, ${band.color}, #7c3aed)`,
            transition: prefersReduced ? 'none' : 'width 1000ms ease',
          }}
        />
      </div>
      <div
        style={{
          marginTop: 8,
          display: 'inline-block',
          padding: '6px 8px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          color: band.color,
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {band.text}
      </div>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);
  return reduced;
}
