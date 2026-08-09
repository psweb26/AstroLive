'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingAnalysis from '../../components/insight/LoadingAnalysis';
import { analyzeStoredConcern } from '../../lib/insight-session';

export default function AnalyzingPage() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    let navigationTimer: number | undefined;

    async function runAnalysis() {
      const result = await analyzeStoredConcern(window.sessionStorage, async (concern) => {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ free_text: concern }),
        });

        if (!response.ok) {
          throw new Error('Analysis request failed');
        }

        return response.json();
      });

      if (!isCurrent) return;

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setIsComplete(true);
      navigationTimer = window.setTimeout(() => router.replace('/insight'), 200);
    }

    void runAnalysis();

    return () => {
      isCurrent = false;
      if (navigationTimer !== undefined) window.clearTimeout(navigationTimer);
    };
  }, [router]);

  if (error) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #0b1020 0%, #0f1724 100%)',
          padding: 24,
          color: '#e6eef8',
        }}
      >
        <section style={{ width: '100%', maxWidth: 560, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Unable to Analyze Your Concern</h1>
          <p style={{ color: '#c7d2fe', marginBottom: 20 }}>{error}</p>
          <Link href="/understanding-you" style={{ color: '#e6eef8', fontWeight: 700 }}>
            Return to Understanding You
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0b1020 0%, #0f1724 100%)',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>
        <LoadingAnalysis isComplete={isComplete} />
      </div>
    </main>
  );
}
