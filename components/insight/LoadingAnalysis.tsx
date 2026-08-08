'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  'Reading your concern',
  'Identifying your primary concern',
  'Matching consultation patterns',
  'Preparing personalized insight',
];

export default function LoadingAnalysis() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  // Total duration in ms
  const totalDuration = 2000;
  // Step duration derived
  const stepDuration = Math.max(120, Math.floor(totalDuration / STEPS.length));

  // Respect reduced motion
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      // Skip animations but keep UX: short delay then navigate
      const t = setTimeout(() => router.push('/insight'), 300);
      return () => clearTimeout(t);
    }

    const timers: number[] = [];

    for (let i = 0; i < STEPS.length; i++) {
      const activateAt = i * stepDuration;
      const completeAt = activateAt + stepDuration;

      timers.push(
        window.setTimeout(() => {
          setActiveStep(i);
        }, activateAt),
      );

      timers.push(
        window.setTimeout(() => {
          setCompleted((prev) => [...prev, i]);
        }, completeAt),
      );
    }

    // Navigate after totalDuration + small buffer
    const navTimer = window.setTimeout(() => {
      router.push('/insight');
    }, totalDuration + 120);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearTimeout(navTimer);
    };
  }, [router, prefersReduced, stepDuration]);

  const progressStyle = useMemo(() => {
    if (prefersReduced) return { width: '100%', transform: 'none' };
    return {
      transition: `width ${totalDuration}ms linear`,
      width: `${Math.min(100, ((completed.length / STEPS.length) * 100) || 6)}%`,
    };
  }, [completed.length, prefersReduced]);

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
        {STEPS.map((s, i) => {
          const isActive = i === activeStep && !prefersReduced;
          const isDone = completed.includes(i) || (prefersReduced && i === 0);
          return (
            <div
              key={s}
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
                <div style={{ fontSize: 15, color: isDone ? '#e6fffa' : isActive ? '#e0e7ff' : '#d1d5db' }}>{s}</div>
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
            ...progressStyle,
          }}
        />
      </div>

      <p style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
        This is a simulated analysis screen. No data is sent anywhere during this demo.
      </p>
    </section>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
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
