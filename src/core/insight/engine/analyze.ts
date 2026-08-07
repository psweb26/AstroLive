import { normalize } from './normalizer';
import { parseNormalizedText } from './parser';
import { matchParsedInput } from './matcher';
import { compileAliases } from '../data/compileAliases';
import { buildRuleIndex } from '../data/buildRuleIndex';
import { scoreCandidates } from './scorer';
import { scoreConfidence } from './confidence';
import { determineStyle } from '../resolvers/style';
import { determineUrgency } from '../resolvers/urgency';
import { determineConsultation } from '../resolvers/consultation';
import { quickInsightText } from '../builders/quickInsight';
import { buildInsightProfile } from '../builders/insightProfile';
import type { InsightProfile } from '../types';

/**
 * analyze() is an orchestrator only. It wires the deterministic engine together.
 * No business logic inside analyze — all logic lives in resolvers/score/confidence/builders.
 */
export function analyze(freeText: string): Readonly<InsightProfile> {
  // compile/build indices once per call (could be cached externally)
  compileAliases();
  const index = buildRuleIndex();
  const aliases = compileAliases();

  // 1 normalize
  const normalized = normalize(freeText);

  // 2 parse
  const parsed = parseNormalizedText(normalized);

  // 3 match
  const matches = matchParsedInput(parsed, {
    phraseMap: index.phraseMap,
    tokenMap: index.tokenMap,
    styleMap: index.styleMap,
    aliasesMap: aliases,
    maxGram: 6,
  });

  // 4 score (aggregate evidence)
  const candidateScores = scoreCandidates(parsed, matches);

  // 5 confidence (consumes only candidateScores)
  const confidence = scoreConfidence(candidateScores);

  // 6 resolvers (consume candidateScores, may use confidence for banding if needed)
  const style = determineStyle(candidateScores);
  const urgency = determineUrgency(candidateScores);
  const consultation = determineConsultation(candidateScores);
  const quick = quickInsightText(candidateScores);

  // 7 build insight profile
  const profile = buildInsightProfile(freeText, candidateScores, confidence);

  return profile;
}
