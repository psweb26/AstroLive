// Minimal rule definitions and helpers for the Insight Engine
// Rules are data-driven and referenced by ruleId in explanations.

export type RuleDef = {
  id: string;
  type: 'phrase' | 'token' | 'style';
  pattern: string; // normalized phrase or token
  category: string;
  subcategory: string;
  primaryNeed: string;
  weight: number; // contribution weight for lexicon match strength
  message?: string; // human friendly message template
  aliases?: readonly string[]; // normalized alternatives for the same deterministic rule
};

// One carefully scoped rule per supported ontology entry. Aliases are indexed as
// equivalent phrases so coverage can grow without creating one rule per synonym.
export const RULES: RuleDef[] = [
  { id: 'R101', type: 'phrase', pattern: 'two job offers', category: 'Career', subcategory: 'Job Change (Decision Making)', primaryNeed: 'Decision Support', weight: 30, message: 'You described comparing work options.' },
  { id: 'R100', type: 'phrase', pattern: 'leave my job', category: 'Career', subcategory: 'Job Change (Decision Making)', primaryNeed: 'Decision Support', weight: 30, message: 'You described a possible change in work.', aliases: ['quit work', 'resign', 'switch company', 'change employer', 'career switch', 'moving companies', 'accept offer'] },
  { id: 'R200', type: 'phrase', pattern: 'promotion', category: 'Career', subcategory: 'Promotion / Negotiation', primaryNeed: 'Decision Support', weight: 24, message: 'You mentioned advancement or a work negotiation.', aliases: ['raise', 'negotiate salary', 'salary negotiation', 'promotion next month'] },
  { id: 'R210', type: 'phrase', pattern: 'start a business', category: 'Career', subcategory: 'Startup / New Business', primaryNeed: 'Timing', weight: 26, message: 'You described starting a business or venture.', aliases: ['launch startup', 'founder', 'new venture', 'business idea'] },
  { id: 'R220', type: 'phrase', pattern: 'career fit', category: 'Career', subcategory: 'Vocational Fit', primaryNeed: 'Guidance', weight: 24, message: 'You are looking for clarity about your work direction.', aliases: ['what should i do', 'ideal career', 'vocational fit', 'strengths', 'career match'] },

  { id: 'R400', type: 'phrase', pattern: 'break up', category: 'Relationship', subcategory: 'Breakup / Reconciliation', primaryNeed: 'Guidance', weight: 28, message: 'You described uncertainty in a close relationship.', aliases: ['separated', 'reconcile', 'get back together', 'divorce', 'split up'] },
  { id: 'R410', type: 'phrase', pattern: 'compatibility', category: 'Relationship', subcategory: 'Compatibility', primaryNeed: 'Compatibility', weight: 26, message: 'You are asking about relationship compatibility.', aliases: ['are we compatible', 'partner match', 'compatibility test'] },
  { id: 'R420', type: 'phrase', pattern: 'marriage', category: 'Relationship', subcategory: 'Marriage / Long-term', primaryNeed: 'Timing', weight: 24, message: 'You mentioned a long-term relationship decision.', aliases: ['engagement', 'long term', 'commit', 'propose', 'wedding planning'] },
  { id: 'R430', type: 'phrase', pattern: 'family problem', category: 'Relationship', subcategory: 'Family Dynamics', primaryNeed: 'Guidance', weight: 24, message: 'You described a family or household concern.', aliases: ['in law', 'parent issue', 'household conflict', 'family issues'] },

  { id: 'R300', type: 'phrase', pattern: 'invest', category: 'Finance', subcategory: 'Investments / Business', primaryNeed: 'Timing', weight: 24, message: 'You are considering an investment or business decision.', aliases: ['investment', 'stocks', 'crypto', 'funding', 'raise capital'] },
  { id: 'R510', type: 'phrase', pattern: 'debt', category: 'Finance', subcategory: 'Debt / Recovery', primaryNeed: 'Guidance', weight: 26, message: 'You described a financial recovery concern.', aliases: ['bankruptcy', 'debt recovery', 'financial recovery'] },

  { id: 'R600', type: 'phrase', pattern: 'anxious', category: 'Health', subcategory: 'Mental Health (Stress/Anxiety)', primaryNeed: 'Guidance', weight: 22, message: 'You described stress or wellbeing concerns.', aliases: ['depressed', 'can t sleep', 'stress', 'panic', 'anxiety'] },
  { id: 'R610', type: 'phrase', pattern: 'chronic', category: 'Health', subcategory: 'Chronic Concern', primaryNeed: 'Guidance', weight: 22, message: 'You described an ongoing wellbeing concern.', aliases: ['recurring illness', 'health concern', 'full moon sickness'] },

  { id: 'R700', type: 'phrase', pattern: 'exam', category: 'Education', subcategory: 'Exams / Admissions', primaryNeed: 'Education', weight: 24, message: 'You mentioned an exam or education opportunity.', aliases: ['entrance', 'admission', 'apply to college', 'board exams'] },
  { id: 'R710', type: 'phrase', pattern: 'what to study', category: 'Education', subcategory: 'Study/Career Decision', primaryNeed: 'Decision Support', weight: 26, message: 'You are weighing an education or career path.', aliases: ['which course', 'study vs job', 'higher studies or job'] },

  { id: 'R800', type: 'phrase', pattern: 'meaning', category: 'Spiritual', subcategory: 'Meaning / Purpose', primaryNeed: 'Growth', weight: 22, message: 'You are looking for meaning or personal direction.', aliases: ['purpose', 'lost', 'spiritual growth', 'find purpose'] },
  { id: 'R810', type: 'phrase', pattern: 'remedies', category: 'Spiritual', subcategory: 'Practices & Remedies', primaryNeed: 'Remediation', weight: 22, message: 'You asked about spiritual practices or remedies.', aliases: ['ritual', 'mantra', 'practice', 'spiritual tools'] },

  { id: 'R900', type: 'phrase', pattern: 'best time to', category: 'Timing', subcategory: 'Event Timing / Muhurat', primaryNeed: 'Timing', weight: 24, message: 'You are asking about the timing of an event.', aliases: ['when should i', 'timing', 'muhurta', 'auspicious time'] },
  { id: 'R910', type: 'phrase', pattern: 'relocate', category: 'Timing', subcategory: 'Relocation / Move Timing', primaryNeed: 'Timing', weight: 26, message: 'You described a move or relocation decision.', aliases: ['move', 'shift city', 'change country', 'relocation timing'] },

  { id: 'R1000', type: 'phrase', pattern: 'property', category: 'Legal', subcategory: 'Property / Contracts (advisory only)', primaryNeed: 'Guidance', weight: 22, message: 'You mentioned a property or agreement decision.', aliases: ['contract', 'legal timing', 'agreement', 'purchase'] },
  { id: 'R1100', type: 'phrase', pattern: 'chart reading', category: 'General Guidance', subcategory: 'Chart Reading', primaryNeed: 'Guidance', weight: 20, message: 'You asked for a general chart reading.', aliases: ['natal chart', 'understand my chart', 'general reading'] },

  { id: 'U1', type: 'token', pattern: 'urgent', category: '', subcategory: '', primaryNeed: '', weight: 0, message: 'You indicated that timing feels important.', aliases: ['now', 'immediately', 'asap', 'tomorrow'] },
];

// Build simple index maps for faster lookup at runtime (compiled once)
export function buildRuleIndex() {
  const phrases = RULES.filter((r) => r.type === 'phrase').slice().sort((a, b) => b.pattern.length - a.pattern.length);
  const tokens = RULES.filter((r) => r.type === 'token');
  const styles = RULES.filter((r) => r.type === 'style');
  return { phrases, tokens, styles } as const;
}
