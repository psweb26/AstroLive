// src/core/insight/resolvers/consultation.ts

import type { CandidateScores } from "../engine/scorer";
import type {
  ConsultationProfile,
  ConsultationType,
} from "../builders/consultation";

/**
 * Determine a consultation suggestion based on CandidateScores.
 * Pure, deterministic resolver.
 */
export function determineConsultation(
  scores: CandidateScores
): ConsultationProfile {
  const topCategory = Object.entries(scores.categoryScores ?? {}).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const topNeed = Object.entries(scores.needScores ?? {}).sort(
    (a, b) => b[1] - a[1]
  )[0];

  let type: ConsultationType = "general";

  if (topNeed?.[0] === "Decision Support") {
    type = "decision";
  } else if (topNeed?.[0] === "Timing") {
    type = "timing";
  } else if (topNeed?.[0] === "Education") {
    type = "education";
  } else if (topCategory?.[0] === "Relationship") {
    type = "relationship";
  }

  const description =
    type === "decision"
      ? "Decision-focused consultation to help you weigh options."
      : type === "timing"
      ? "Timing-focused consultation to identify favorable periods."
      : type === "education"
      ? "Educational planning and pathways consultation."
      : type === "relationship"
      ? "Relationship compatibility and understanding session."
      : "General guidance session.";

  return Object.freeze({
    type,
    description,
  });
}
