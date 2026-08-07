'use client';

import React from 'react';
import ConcernForm from '../../components/insight/ConcernForm';

export default function UnderstandingYouPage() {
  return (
    <main style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>Understanding You</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Tell us what is on your mind. We'll analyze your concern and recommend the most suitable consultation.
      </p>
      <ConcernForm />
    </main>
  );
}
