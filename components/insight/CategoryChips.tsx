'use client';

import React from 'react';

const CATEGORIES = ['Career', 'Relationship', 'Finance', 'Education', 'Health', 'Spiritual'];

export default function CategoryChips({ selected, onSelect }: { selected: string | null; onSelect: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {CATEGORIES.map((c) => {
        const active = selected === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onSelect(c)}
            style={{
              padding: '8px 12px',
              borderRadius: 20,
              border: active ? '1px solid #111827' : '1px solid #e5e7eb',
              background: active ? '#111827' : '#fff',
              color: active ? '#fff' : '#111827',
              cursor: 'pointer',
            }}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
