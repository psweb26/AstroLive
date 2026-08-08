'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AstrologerCard({
  id,
  name,
  experience,
  price,
  languages,
  specializations,
  trustScore,
  recommendationReasons,
  image,
  isBestMatch,
}: {
  id: string;
  name: string;
  experience: number;
  price: number;
  languages: string[];
  specializations: string[];
  trustScore: number;
  recommendationReasons: string[];
  image?: string;
  isBestMatch?: boolean;
}) {
  return (
    <div
      style={{
        background: '#0b1320',
        padding: 12,
        borderRadius: 12,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.02)',
      }}
      role="article"
      aria-label={`Recommendation for ${name}`}
    >
      <div style={{ width: 84, height: 84, position: 'relative', flex: '0 0 84px' }}>
        <Image src={image || '/images/avatars/placeholder.jpg'} alt={`Profile image of ${name}`} width={84} height={84} style={{ borderRadius: 10, objectFit: 'cover' }} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{name}</div>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>{experience} years experience</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>₹{price}</div>
            <Link href={`/astrologers/${id}`} aria-label={`View profile of ${name}`}>
              <button
                style={{
                  marginTop: 8,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#e6eef8',
                  padding: '8px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                View Profile
              </button>
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 8, color: '#cbd5e1' }}>
          <strong>Languages:</strong> {languages.join(', ')}
        </div>
        <div style={{ marginTop: 6, color: '#cbd5e1' }}>
          <strong>Specializations:</strong> {specializations.join(', ')}
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ color: '#9fb0e8', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Why this astrologer</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#dbeafe' }}>
            {recommendationReasons.map((r, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
