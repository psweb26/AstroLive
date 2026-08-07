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
};

// Small sample rule set for Sprint 1. This is intentionally compact and deterministic.
export const RULES: RuleDef[] = [
  { id: 'R101', type: 'phrase', pattern: 'two job offers', category: 'Career', subcategory: 'Job Change (Decision Making)', primaryNeed: 'Decision Support', weight: 30, message: "Matched phrase 'two job offers'" },
  { id: 'R100', type: 'phrase', pattern: 'leave my job', category: 'Career', subcategory: 'Job Change (Decision Making)', primaryNeed: 'Decision Support', weight: 30, message: "Matched phrase 'leave my job'" },
  { id: 'R110', type: 'phrase', pattern: "quit work", category: 'Career', subcategory: 'Job Change (Decision Making)', primaryNeed: 'Decision Support', weight: 28, message: "Matched phrase 'quit work'" },
  { id: 'R200', type: 'token', pattern: 'promotion', category: 'Career', subcategory: 'Promotion / Negotiation', primaryNeed: 'Decision Support', weight: 20, message: "Matched token 'promotion'" },
  { id: 'R300', type: 'token', pattern: 'invest', category: 'Finance', subcategory: 'Investments / Business', primaryNeed: 'Timing', weight: 18, message: "Matched token 'invest'" },
  { id: 'S1', type: 'style', pattern: 'decide|deciding|decide between|which to pick|which to accept', category: 'Career', subcategory: 'Job Change (Decision Making)', primaryNeed: 'Decision Support', weight: 10, message: "Detected decision-making wording" },
  { id: 'U1', type: 'token', pattern: 'now|immediately|urgent|asap|tomorrow', category: '', subcategory: '', primaryNeed: '', weight: 0, message: "Urgency token matched" },
];

// Build simple index maps for faster lookup at runtime (compiled once)
export function buildRuleIndex() {
  const phrases = RULES.filter((r) => r.type === 'phrase').slice().sort((a, b) => b.pattern.length - a.pattern.length);
  const tokens = RULES.filter((r) => r.type === 'token');
  const styles = RULES.filter((r) => r.type === 'style');
  return { phrases, tokens, styles } as const;
}
