'use client';

import React from 'react';
import { Chip } from '@/components/ui/chip';

const CATEGORIES = ['Career', 'Relationship', 'Finance', 'Education', 'Health', 'Spiritual'];

export default function CategoryChips({ selected, onSelect }: { selected: string | null; onSelect: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const active = selected === c;
        return (
          <Chip
            key={c}
            type="button"
            onClick={() => onSelect(c)}
            selected={active}
          >
            {c}
          </Chip>
        );
      })}
    </div>
  );
}
