'use client';

import React from 'react';

export default function RecommendationReasonCard({ reasons }: { reasons: string[] }) {
  return (
    <div style={{ background: '#071024', padding: 12, borderRadius: 10, color: '#dbeafe' }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>Why this astrologer?</div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {reasons.map((r, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            ✓ {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
