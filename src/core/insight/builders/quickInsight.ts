import { CandidateScores } from '../engine/scorer';

/**
 * Template-driven quick insight generator.
 * Pure and deterministic. Templates are tiny and isolated to support localization.
 */

const templates: Record<string, string> = {
  Career: "You appear to be seeking guidance regarding an important career decision.",
  Relationship: "You seem to be looking for clarity in a relationship.",
  Finance: "You're asking about financial matters like savings, investment, or loans.",
  Education: "You are asking about studies, exams, or higher education options.",
  Default: "You are looking for guidance and clarity.",
};

export function quickInsightText(scores: CandidateScores): string {
  const category = Object.entries(scores.categoryScores || {}).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (category && templates[category]) return templates[category];
  return templates.Default;
}
