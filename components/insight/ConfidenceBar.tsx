'use client';

import React, { useMemo } from 'react';

import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function ConfidenceBar({ confidence }: { confidence: number }) {
  const safe = Math.max(0, Math.min(100, Math.round(confidence)));
  const band = useMemo(() => {
    if (safe >= 85) return 'Strong support from the available context.';
    if (safe >= 60) return 'A useful reading, with room for more context.';
    return 'A tentative reading; more context would strengthen it.';
  }, [safe]);

  return <div className="space-y-3"><ProgressIndicator value={safe} label="Interpretive confidence" /><p className="text-sm leading-6 text-ink-secondary">{band}</p></div>;
}
