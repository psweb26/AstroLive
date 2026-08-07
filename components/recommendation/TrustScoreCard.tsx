'use client';

import React from 'react';

export default function TrustScoreCard({ trustScore }: { trustScore: number }) {
  const safe = Math.max(0, Math.min(100, Math.round(trustScore)));
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 10, textAlign: 'center' }}>
      <div style={{ fontSize: 13, color: '#9fb0e8', fontWeight: 700 }}>Trust Score</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#e6eef8', marginTop: 6 }}>{safe} / 100</div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginTop: 8, overflow: 'hidden' }}>
        <div style={{ width: `${safe}%`, height: '100%', background: 'linear-gradient(90deg,#10b981,#7c3aed)' }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 13, color: '#94a3b8' }}>Highly Trusted</div>
    </div>
  );
}
