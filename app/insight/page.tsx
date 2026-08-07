'use client';

import React from 'react';
import ConfidenceBar from '../../components/insight/ConfidenceBar';
import ExplanationChip from '../../components/insight/ExplanationChip';
import Link from 'next/link';

const mockInsight = {
  concernCategory: 'Career',
  subcategory: 'Decision Making',
  primaryNeed: 'Decision Support',
  confidence: 92,
  suggestedConsultation: 'Career Decision Consultation',
  quickInsight:
    "Your concern suggests you're evaluating multiple career opportunities and are looking for structured guidance before making a decision.",
  explanation: [
    'Matched phrase "two job offers"',
    'Detected decision-making language',
    'Career concern identified',
  ],
};

export default function InsightPage() {
  const insight = mockInsight;

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: '0 auto', color: '#e6eef8' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Your Personalized Insight</h1>
        <p style={{ color: '#aab7d6', marginTop: 8 }}>Here's what we understood from your concern.</p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        <div>
          {/* Category Card */}
          <div
            role="region"
            aria-label="Category"
            style={{
              background: '#0f1724',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 6px 20px rgba(2,6,23,0.6)',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#93c5fd', fontSize: 13, fontWeight: 600 }}>Category</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{insight.concernCategory}</div>
                <div style={{ color: '#94a3b8', marginTop: 4 }}>{insight.subcategory}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#c7d2fe', fontSize: 13, fontWeight: 600 }}>Primary Need</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{insight.primaryNeed}</div>
              </div>
            </div>
          </div>

          {/* Quick Insight */}
          <div
            role="region"
            aria-label="Quick Insight"
            style={{
              background: 'linear-gradient(180deg, rgba(124,58,237,0.06), rgba(6,182,212,0.02))',
              padding: 18,
              borderRadius: 12,
              boxShadow: '0 8px 30px rgba(2,6,23,0.6)',
              border: '1px solid rgba(124,58,237,0.08)',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Quick Insight</div>
            <p style={{ margin: 0, color: '#dbeafe', lineHeight: 1.5 }}>{insight.quickInsight}</p>
          </div>

          {/* Suggested Consultation */}
          <div
            role="region"
            aria-label="Suggested Consultation"
            style={{
              background: '#071024',
              padding: 16,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.03)',
              boxShadow: '0 6px 18px rgba(2,6,23,0.6)',
              marginBottom: 20,
            }}
          >
            <div style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 600 }}>Suggested Consultation</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#e6eef8', marginTop: 8 }}>{insight.suggestedConsultation}</div>
          </div>

          {/* Explanation chips */}
          <div style={{ marginTop: 6 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>What we found</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {insight.explanation.map((t, i) => (
                <ExplanationChip key={i} text={t} />
              ))}
            </div>
          </div>
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#9fb0e8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Confidence</div>
              <ConfidenceBar confidence={insight.confidence} />
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => {
                  /* client-side navigation via Link below */
                }}
                style={{
                  width: '100%',
                  background: '#7c3aed',
                  color: 'white',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                <Link href="/recommendations" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Find Matching Astrologers
                </Link>
              </button>
            </div>
          </div>
        </aside>
      </section>

      <footer style={{ marginTop: 28, color: '#94a3b8', fontSize: 13 }}>
        <p style={{ margin: 0 }}>This insight is for informational purposes and is generated from our analysis model.</p>
      </footer>
    </main>
  );
}
