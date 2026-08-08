'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CategoryChips from './CategoryChips';
import PrivacyNote from './PrivacyNote';

const EXAMPLES: Record<string, string> = {
  Career: "I'm confused between two job offers.",
  Relationship: "My relationship has become stressful.",
  Finance: "I want to know if this is a good time to start my business.",
  Education: "I'm unsure about which course to take next.",
  Health: "I'm worried about recent health changes.",
  Spiritual: "I want guidance on my spiritual path.",
};

export default function ConcernForm() {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  function handleSelectCategory(cat: string) {
    setCategory(cat);
    // Prefill sample text for the selected category if the textarea is empty
    if (text.trim().length === 0) setText(EXAMPLES[cat] || '');
  }

  return (
    <div>
      <label htmlFor="concern" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
        Your concern
      </label>
      <textarea
        id="concern"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Example: "I'm confused between two job offers."`}
        style={{ width: '100%', minHeight: 160, padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #ddd' }}
      />

      <div style={{ marginTop: 16 }}>
        <CategoryChips selected={category} onSelect={handleSelectCategory} />
      </div>

      <div style={{ marginTop: 12 }}>
        <PrivacyNote />
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <Link href="/analyzing" style={{ textDecoration: 'none' }}>
          <button
            type="button"
            style={{
              background: '#111827',
              color: 'white',
              padding: '12px 20px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
}
