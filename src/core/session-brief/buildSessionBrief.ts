import type { InsightProfile } from '../insight/types';
import type { AstrologerRecord } from '../recommendation/types';

export type SessionBrief = {
  bookingId: string; astrologerId: string; estimated_duration: string; youll_probably_discuss: string[];
  things_to_keep_ready: string[]; suggested_questions: string[]; expected_outcome: string; pro_tip: string;
};

export function buildSessionBrief(insight: InsightProfile, astrologer: AstrologerRecord, booking: { bookingId: string; astrologerId: string }): SessionBrief {
  const relationship = insight.concernCategory === 'Relationship';
  const decision = insight.primaryNeed === 'Decision Support';
  const focus = relationship ? ['relationship dynamics', 'communication priorities', 'decision factors'] : decision ? ['decision clarity', 'trade-offs', 'next career direction'] : ['current priorities', 'practical next steps', insight.primaryNeed.toLowerCase()];
  const analytical = astrologer.consultation_style === 'Analytical';
  return { bookingId: booking.bookingId, astrologerId: booking.astrologerId, estimated_duration: '30 minutes', youll_probably_discuss: focus, things_to_keep_ready: ['the key context behind your concern', 'the options or questions you want to explore'], suggested_questions: analytical ? ['What are the main trade-offs?', 'Which question should I resolve first?'] : ['What should I focus on first?', 'What practical next step would help most?'], expected_outcome: 'A clearer understanding of your priorities and next steps for this consultation.', pro_tip: `Share your main concern early so the ${astrologer.consultation_style.toLowerCase()} consultation can focus on what matters most.` };
}
