'use client';

import React from 'react';

export default function ExplanationChip({ text }: { text: string }) {
  return <div role="listitem" className="border-l border-signal-secondary pl-4 text-base leading-7 text-ink-secondary">{text}</div>;
}
