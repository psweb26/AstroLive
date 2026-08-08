'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AstrologerCard from '../../components/recommendation/AstrologerCard';

const recommendations = [
  {
    id: 'ananya',
    name: 'Dr. Ananya Sharma',
    experience: 12,
    price: 799,
    languages: ['English', 'Hindi'],
    specializations: ['Career', 'Finance'],
    trustScore: 96,
    recommendationReasons: [
      'Career Decision Specialist',
      'Practical consultation style',
      '12 years experience',
    ],
    image: '/images/avatars/ananya.jpg',
  },
  {
    id: 'raj',
    name: 'Rajiv Menon',
    experience: 8,
    price: 599,
    languages: ['English'],
    specializations: ['Career', 'Education'],
    trustScore: 90,
    recommendationReasons: ['Empathetic advisor', 'Structured decision frameworks', '8 years experience'],
    image: '/images/avatars/raj.jpg',
  },
  {
    id: 'meera',
    name: 'Meera Kapoor',
    experience: 15,
    price: 999,
    languages: ['English', 'Hindi', 'Sanskrit'],
    specializations: ['Relationship', 'Career'],
    trustScore: 93,
    recommendationReasons: ['Deep compatibility analysis', 'Holistic guidance', '15 years experience'],
    image: '/images/avatars/meera.jpg',
  },
];

export default function RecommendationsPage() {
  const best = recommendations[0];
  const others = recommendations.slice(1);

  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto', color: '#e6eef8' }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>Recommended Astrologers</h1>
        <p style={{ color: '#aab7d6', marginTop: 8 }}>
          Based on your concern, these astrologers are the strongest match.
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
                  <Image
                    src={best.image}
                    alt={`Profile image of ${best.name}`}
                    width={120}
                    height={120}
                    style={{ borderRadius: 12, objectFit: 'cover' }}
                  />
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
                <h2 style={{ margin: 0, fontSize: 20 }}>{best.name}</h2>
                <div style={{ color: '#94a3b8', marginTop: 6 }}>{best.experience} years experience</div>
                <div style={{ marginTop: 10, color: '#cbd5e1' }}>
                  <strong>Languages:</strong> {best.languages.join(', ')}
                </div>
                <div style={{ marginTop: 8, color: '#cbd5e1' }}>
                  <strong>Specializations:</strong> {best.specializations.join(', ')}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>₹{best.price}</div>
                  <Link href={`/astrologers/${best.id}`} aria-label={`View profile of ${best.name}`}>
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
                    {best.recommendationReasons.map((r, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Trust score component inline for prominence */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#9fb0e8', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Trust Score</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#e6eef8' }}>{best.trustScore}</div>
                  <div style={{ color: '#94a3b8', marginTop: 6, fontSize: 13 }}>/ 100</div>
                </div>
              </div>
            </div>
          </div>

          {/* Other recommendations */}
          <div style={{ display: 'grid', gap: 12 }}>
            {others.map((a) => (
              <AstrologerCard key={a.id} {...a} />
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
              <h3 style={{ margin: '0 0 8px 0' }}>How we match</h3>
              <p style={{ margin: 0, color: '#cbd5e1' }}>
                These recommendations are illustrative for the demo. In production they will be personalized to your
                insight.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
],