'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RecommendationReasonCard from '../../../components/recommendation/RecommendationReasonCard';
import TrustScoreCard from '../../../components/recommendation/TrustScoreCard';
import { loadStoredRecommendations } from '../../../lib/insight-session';
import type { Recommendation } from '../../../src/core/recommendation/types';

export default function AstrologerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [recommendation, setRecommendation] = useState<Recommendation | null | undefined>(undefined);

  useEffect(() => {
    const recommendations = loadStoredRecommendations(window.sessionStorage);
    setRecommendation(recommendations?.find((item) => item.astrologer.id === id) ?? null);
  }, [id]);

  if (recommendation === undefined) return null;
  if (!recommendation) {
    return <main className="mx-auto max-w-3xl px-5 py-16"><h1 className="text-3xl font-semibold">Astrologer not found</h1><p className="mt-3">This astrologer is unavailable in your current recommendations.</p><Link href="/recommendations">Return to recommendations</Link></main>;
  }

  const { astrologer, finalScore, trustScore, trustBreakdown, matchExplanation, topSignals } = recommendation;
  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <section className="rounded-3xl border p-6 shadow-sm sm:p-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row">
          <div><h1 className="text-3xl font-semibold">{astrologer.name}</h1><p className="mt-2">{astrologer.specializations.join(', ')}</p><p className="mt-3 text-sm">{astrologer.experience_years} years experience · {astrologer.languages.join(', ')} · {astrologer.consultation_style} style</p></div>
          <div><p>₹{astrologer.price_min}–₹{astrologer.price_max}</p><p className="mt-2 font-semibold">Match score: {finalScore}/100</p></div>
        </div>
        <p className="mt-6">{astrologer.short_description}</p>
      </section>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TrustScoreCard trustScore={trustScore} />
        <RecommendationReasonCard reasons={topSignals.map((signal) => signal.label)} />
      </div>
      <section className="mt-6 rounded-2xl border p-6"><h2 className="text-xl font-semibold">Why this astrologer was recommended</h2><p className="mt-3">{matchExplanation}</p><h3 className="mt-5 font-semibold">Trust breakdown</h3><ul className="mt-3 space-y-2">{trustBreakdown.map((component) => <li key={component.name}>{component.label}: {component.value}</li>)}</ul></section>
      <Link className="mt-6 inline-block rounded-full bg-violet-600 px-5 py-3 text-white" href={`/booking?astrologer=${astrologer.id}`}>Book Consultation</Link>
    </main>
  );
}
