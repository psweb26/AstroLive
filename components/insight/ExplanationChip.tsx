'use client';

import React from 'react';

export default function ExplanationChip({ text }: { text: string }) {
  return (
    <div
      role="listitem"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.02)',
        color: '#dbeafe',
        fontSize: 14,
        boxShadow: '0 4px 12px rgba(2,6,23,0.6)',
      }}
    >
      <span aria-hidden style={{ color: '#34d399', fontWeight: 800 }}>✓</span>
      <span>{text}</span>
    </div>
  );
}
