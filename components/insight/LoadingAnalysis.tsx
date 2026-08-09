'use client';

import React from 'react';

const STEPS = ['Reading your concern', 'Analyzing your concern', 'Preparing your insight'];

export default function LoadingAnalysis({ isComplete }: { isComplete: boolean }) {
  const completedCount = isComplete ? STEPS.length : 0;

  return (
    <section
      aria-live="polite"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
        padding: 28,
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(2,6,23,0.6)',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: 26, margin: '0 0 8px 0' }}>Analyzing Your Concern</h2>
      <p style={{ margin: '0 0 18px 0', color: '#c7d2fe' }}>
        We&apos;re understanding your concern and preparing a personalized insight.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch' }}>
        {STEPS.map((step, index) => {
          const isActive = index === 0 && !isComplete;
          const isDone = index < completedCount;

          return (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 12px',
                borderRadius: 8,
                background: isDone ? 'rgba(255,255,255,0.03)' : 'transparent',
              }}
            >
              <div
                aria-hidden
                style={{
                  width: 20,
                  height: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  background: isDone ? '#10b981' : isActive ? '#c7d2fe' : 'rgba(255,255,255,0.04)',
                  color: isDone ? 'white' : '#0f1724',
                  fontWeight: 700,
                  flex: '0 0 20px',
                }}
              >
                {isDone ? '✓' : isActive ? '●' : ''}
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: 15, color: isDone ? '#e6fffa' : isActive ? '#e0e7ff' : '#d1d5db' }}>{step}</div>
              </div>
              <div style={{ width: 24 }} />
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
            borderRadius: 6,
            transition: 'width 150ms ease',
            width: `${isComplete ? 100 : 6}%`,
          }}
        />
      </div>

      <p style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
        Your concern is analyzed locally before we continue.
      </p>
    </section>
  );
}
