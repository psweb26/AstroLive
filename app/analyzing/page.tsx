'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { JourneyMarker } from '@/components/insight/JourneyMarker';
import LoadingAnalysis from '../../components/insight/LoadingAnalysis';
import { ProductShell } from '@/components/layout/product-shell';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CONCERN_STORAGE_KEY, analyzeStoredConcern, loadStoredInsightProfile } from '../../lib/insight-session';

export default function AnalyzingPage() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [concern, setConcern] = useState<string | undefined>();

  useEffect(() => {
    let isCurrent = true;
    let navigationTimer: number | undefined;
    const storedConcern = window.sessionStorage.getItem(CONCERN_STORAGE_KEY)?.trim() || undefined;
    setConcern(storedConcern);

    const continueToInsight = () => {
      setIsComplete(true);
      navigationTimer = window.setTimeout(() => router.replace('/insight'), 650);
    };

    async function runAnalysis() {
      const preview = loadStoredInsightProfile(window.sessionStorage);
      if (preview.ok && preview.profile.free_text?.trim() === storedConcern) {
        continueToInsight();
        return;
      }

      const result = await analyzeStoredConcern(window.sessionStorage, async (storedConcern) => {
        const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ free_text: storedConcern }) });
        if (!response.ok) throw new Error('Analysis request failed');
        return response.json();
      });

      if (!isCurrent) return;
      if (!result.ok) { setError(result.message); return; }
      continueToInsight();
    }

    void runAnalysis();
    return () => { isCurrent = false; if (navigationTimer !== undefined) window.clearTimeout(navigationTimer); };
  }, [router]);

  if (error) {
    return <ProductShell><main className="product-page page-frame"><JourneyMarker current={2} /><section className="mx-auto max-w-2xl py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-danger">Interpretation paused</p><h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">We couldn’t complete that reading.</h1><Alert tone="danger" className="mt-8">{error}</Alert><Button asChild variant="outline" className="mt-8"><Link href="/understanding-you">Return to your question</Link></Button></section></main></ProductShell>;
  }

  return <ProductShell><main className="product-page page-frame"><JourneyMarker current={2} /><LoadingAnalysis isComplete={isComplete} concern={concern} /></main></ProductShell>;
}
