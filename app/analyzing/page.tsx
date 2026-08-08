'use client';

import React from 'react';
import LoadingAnalysis from '../../components/insight/LoadingAnalysis';

export default function AnalyzingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0b1020 0%, #0f1724 100%)',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>
        <LoadingAnalysis />
      </div>
    </main>
  );
}
