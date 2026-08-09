'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AstrologerCard from '../../components/recommendation/AstrologerCard';
import { Recommendation, TrustComponent } from '../../src/core/recommendation/types';
import { loadStoredInsightProfile, storeRecommendations } from '../../lib/insight-session';

type PageState = 'loading' | 'success' | 'error';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch real recommendations from API
    async function fetchRecommendations() {
      try {
        const profileResult = loadStoredInsightProfile(window.sessionStorage);
        if (!profileResult.ok) {
          setError('Your insight is not available yet.');
          setState('error');
          return;
        }

        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            insightProfile: profileResult.profile,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        storeRecommendations(window.sessionStorage, data.recommendations);
        setRecommendations(data.recommendations);
        setState('success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setState('error');
      }
    }

    fetchRecommendations();
  }, []);

  if (state === 'loading') {
    return (
      <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto', color: '#e6eef8', textAlign: 'center' }}>
        <h1>Finding experts who match your situation…</h1>
        <p style={{ color: '#aab7d6' }}>Analyzing your concern • ✓ Consultation Type • Trust Match • Best Specialists</p>
      </main>
    );
  }

  if (state === 'error') {
    return (
      <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto', color: '#e6eef8' }}>
        <header style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 32, margin: 0, color: '#ef4444' }}>Error Loading Recommendations</h1>
          <p style={{ color: '#aab7d6', marginTop: 8 }}>{error}</p>
          {error === 'Your insight is not available yet.' && (
            <Link href="/understanding-you" style={{ color: '#c4b5fd', fontWeight: 700 }}>
              Return to Understanding You
            </Link>
          )}
        </header>
      </main>
    );
  }

  if (recommendations.length === 0) {
    return (
      <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto', color: '#e6eef8' }}>
        <header style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 32, margin: 0 }}>No Recommendations Available</h1>
          <p style={{ color: '#aab7d6', marginTop: 8 }}>
            We could not find matching astrologers for your criteria.
          </p>
        </header>
      </main>
    );
  }

  const best = recommendations[0];
  const others = recommendations.slice(1);

  /**
   * Convert trust breakdown component to human-readable label.
   * Used to display trust score composition.
   */
  function trustComponentLabel(component: TrustComponent): string {
    const labels: Record<string, string> = {
      identity_verified: 'Identity Verified',
      verified_consultations: 'Verified Consultations',
      repeat_clients_pct: 'Repeat Clients',
      experience: 'Experience',
      completion_rate_pct: 'Completion Rate',
    };
    return labels[component.name] || component.label;
  }

  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto', color: '#e6eef8' }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>Recommended Astrologers</h1>
        <p style={{ color: '#aab7d6', marginTop: 8 }}>
          Based on your insight, these astrologers are the strongest match.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        <div>
          {/* Top (best match) */}
          <div
            style={{
              background: '#071024',
              borderRadius: 12,
              padding: 18,
              boxShadow: '0 8px 30px rgba(2,6,23,0.6)',
              border: '1px solid rgba(255,255,255,0.03)',
              marginBottom: 20,
            }}
            aria-label="Best match"
          >
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: '0 0 120px' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 48,
                    }}
                  >
                    {best.astrologer.name.charAt(0)}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      left: 8,
                      top: 8,
                      background: 'rgba(255,215,0,0.12)',
                      padding: '4px 8px',
                      borderRadius: 8,
                      color: '#ffd700',
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    ⭐ Best Match
                  </div>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>{best.astrologer.name}</h2>
                <div style={{ color: '#94a3b8', marginTop: 6 }}>
                  {best.astrologer.experience_years} years experience
                </div>
                <div style={{ marginTop: 10, color: '#cbd5e1' }}>
                  <strong>Languages:</strong> {best.astrologer.languages.join(', ')}
                </div>
                <div style={{ marginTop: 8, color: '#cbd5e1' }}>
                  <strong>Specializations:</strong> {best.astrologer.specializations.join(', ')}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>
                    ₹{best.astrologer.price_min} - ₹{best.astrologer.price_max}
                  </div>
                  <Link href={`/astrologers/${best.astrologer.id}`} aria-label={`View profile of ${best.astrologer.name}`}>
                    <button
                      style={{
                        background: '#7c3aed',
                        color: '#fff',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      View Profile
                    </button>
                  </Link>
                </div>

                <div style={{ marginTop: 12 }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 15 }}>Why we recommend</h4>
                  <ul style={{ margin: 0, paddingLeft: 18, color: '#dbeafe' }}>
                    {best.topSignals.map((signal, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        {signal.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Trust score component inline for prominence */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#9fb0e8', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Trust Score</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#e6eef8' }}>
                    {best.trustBreakdown[0]?.contribution !== undefined
                      ? Math.round(
                          best.trustBreakdown.reduce(
                            (sum, c) => sum + Math.round(c.normalized * c.weight * 100),
                            0
                          )
                        )
                      : Math.round(best.astrologer.repeat_client_pct)}
                  </div>
                  <div style={{ color: '#94a3b8', marginTop: 6, fontSize: 13 }}>/ 100</div>
                </div>
              </div>
            </div>

            {/* Match explanation */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
                {best.matchExplanation}
              </p>
            </div>
          </div>

          {/* Other recommendations */}
          <div style={{ display: 'grid', gap: 12 }}>
            {others.map((rec) => (
              <AstrologerCard
                key={rec.astrologer.id}
                id={rec.astrologer.id}
                name={rec.astrologer.name}
                experience={rec.astrologer.experience_years}
                price={rec.astrologer.price_min}
                languages={rec.astrologer.languages}
                specializations={rec.astrologer.specializations}
                trustScore={Math.round(
                  rec.trustBreakdown.reduce((sum, c) => sum + Math.round(c.normalized * c.weight * 100), 0)
                )}
                recommendationReasons={rec.topSignals.map((s) => s.label)}
              />
            ))}
          </div>
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 24 }}>
            <div
              style={{
                background: '#071024',
                padding: 14,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.03)',
                boxShadow: '0 8px 24px rgba(2,6,23,0.6)',
              }}
            >
              <h3 style={{ margin: '0 0 12px 0' }}>How we match</h3>
              <div style={{ color: '#cbd5e1', fontSize: 13 }}>
                <p style={{ margin: '0 0 12px 0' }}>
                  These recommendations are computed from your insight profile using deterministic matching:
                </p>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#dbeafe' }}>
                  <li style={{ marginBottom: 8 }}>
                    <strong>Specialization:</strong> {best.topSignals.find((s) => s.type === 'specialization_match') ? '✓' : '—'}{' '}
                    40% weight
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <strong>Primary Need:</strong> {best.topSignals.find((s) => s.type === 'primary_need_match') ? '✓' : '—'}{' '}
                    20% weight
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <strong>Trust Score:</strong> 20% weight
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <strong>Style:</strong> {best.topSignals.find((s) => s.type === 'consultation_style_match') ? '✓' : '—'} 10%
                    weight
                  </li>
                  <li>
                    <strong>Experience:</strong> {best.topSignals.find((s) => s.type === 'experience') ? '✓' : '—'} 10% weight
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
