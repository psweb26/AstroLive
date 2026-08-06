# AstroLive — PRODUCT_SPEC (FROZEN)

Last updated: 2026-08-06

This document is the single source of truth for the AstroLive MVP. It is intentionally immutable for the duration of the hackathon and initial implementation sprints. All engineering work MUST implement features exactly according to this specification. Do not rename, reinterpret, or redesign product concepts; implement them.

SUMMARY (one sentence)
AstroLive is an Insight-first astrology product that understands a user's situation, transparently recommends the right astrologer, and prepares them for a better consultation.

FINAL FROZEN FLOW (MVP)
Landing
 → Tell us what’s on your mind (free-text)
 → AstroLive Insight Engine (live as-you-type)
 → Insight Card (InsightProfile preview)
 → "Finding experts who match your situation…" (animated checklist)
 → Top 3 Recommendations (explainable)
 → Trust-first Profile (Trust Score visual + Why matched)
 → Book (fake slots, no payment)
 → Session Brief (premium prep)
 → Success

HIGH‑LEVEL PRINCIPLES
- The core differentiator is the Insight Engine (rule‑based deterministic for MVP). Focus on immediate perceived understanding.
- No signup required to see insights and recommendations.
- Transparency: always return explainable reasons for analysis and recommendations.
- Minimal dataset & minimal data model. Keep PII optional and encrypted at rest if stored.
- No external AI or LLMs in MVP. Deterministic rules only; architecture allows future swap to AI.
- UI motion should create the perception of reasoning (animation sequence) but remain quick and cheap.

USER-FACING NAMING
- Engine: AstroLive Insight Engine
- Pre-recommendation output: Insight Card
- Preparation page: Session Brief
- Internally: Concern Analysis Engine (implementation name is fine)

INSIGHTPROFILE (canonical object — returned by /api/analyze)
Fields (MVP):
- id (uuid)
- session_id (cookie)
- free_text (optional; stored hashed or omitted for privacy)
- concernCategory (enum: Career, Relationship, Finance, Health, Education, Spiritual, Timing, Legal, General Guidance)
- subcategory (string)
- primaryNeed (enum: Decision Support, Compatibility, Timing, Guidance, Growth, Remediation, Education)
- urgency (low|medium|high)
- consultationStyleHint (practical|analytical|empathetic|traditional|direct|strategic)
- suggestedConsultation (string)
- confidence (int 0..97) — CAP AT 97
- explanation[] (ordered human strings) — why the engine reached this result
- quickInsightText (1–2 sentence deterministic summary)
- created_at

Design rule: Every downstream module (recommendation, booking, session brief) MUST consume InsightProfile. Do not re-run analysis elsewhere.

LIVe UX — "Understanding You" (exact microflow)
- Input: single free-text prompt: "Tell us what's on your mind" (with examples).
- As-you-type debounce: 400–700ms → POST /api/analyze (server returns InsightProfile).
- Display Insight Card inline (within 3–5s): Category badge, PrimaryNeed, Suggested Consultation, Confidence bar (visualized e.g., ███████ 92/97), explanation chips, quickInsightText, CTA: Continue.
- If confidence < 60 include clarifier options (two buttons to confirm top categories).
- On Continue: show short animated interstitial:
  "Finding experts who match your situation…"
  Animated checklist lines (one-by-one): Analyzing… ✓ Concern ✓ Consultation Type ✓ Trust Match ✓ Best Specialists
  Then fade into Top 3 recommendations.

CONCERN ONTOLOGY (brief)
- Categories: Career, Relationship, Finance, Health, Education, Spiritual, Timing, Legal, General Guidance (user-facing name for Misc).
- Each rule includes aliases/synonyms (e.g., "leave my job" aliases: "quit work", "resign", "career switch", "change employer", "accept offer").
- Ontology must be delivered as CSV (Category, Subcategory, Aliases, SuggestedConsultation, PrimaryNeed).

INSIGHT ENGINE RULES (summary)
- Deterministic pipeline: normalize -> phrase match (longest first) -> token weights -> urgency detection -> style inference -> StructuredInputBoost -> confidence math -> generate explanation[] and quickInsightText.
- Confidence components: LexiconMatchStrength (0–70) + StructuredInputBoost (0 or +20) + StrongPhraseBoost (0 or +10) - AmbiguityPenalty (0..15). Cap result at 97.
- If top categories tie within 15% or confidence <60, return low confidence + clarifier candidates.

RECOMMENDATION ENGINE (Top 3 only)
- Inputs: InsightProfile + optional filters (language, price)
- Weights (MVP):
  - Specialization match (subcategory exact/related): 40%
  - PrimaryNeed alignment: 20%
  - TrustScore normalized: 20%
  - ConsultationStyle match: 10%
  - Experience/proven outcomes normalized: 10%
- Compute normalized subscores [0..1], multiply by weights, sum → finalScore (0..100). Return top 3.
- For each returned astrologer include: matchExplanation (templated paragraph), topSignals[], trustBreakdown[].

TRUST SCORE (computed, transparent)
- Compute from components (do NOT hardcode trust_score in dataset):
  - IdentityVerified (bool) — weight 20
  - VerifiedConsultationsNormalized (0..100) — weight 25
  - RepeatClientsPct (0..100) — weight 20
  - ExperienceNormalized (cap at 20yrs -> 0..100) — weight 15
  - CompletionRatePct (0..100) — weight 10
- trustScore = round(weighted_sum / total_weight)
- Return trustBreakdown list for UI: show each item and count/value.
- UI must visualize trust score (bar + numeric) and show checklist-style reasons.

ASTROLOGER DATASET (MVP fields required)
- id,name,short_bio,specializations[],methods[],consultation_style,experience_years,verified_consultations_count,repeat_client_pct,completion_rate_pct,verification_docs_present (bool),languages[],price_min,price_max,availability_stub[],sample_insight_snippet
- consultation_style values: Practical, Analytical, Empathetic, Traditional, Direct, Strategic
- Do NOT include a precomputed trust_score in the dataset for the demo; compute from components.

SESSION BRIEF (formerly Preparation Assistant)
- Template-driven, deterministic, and premium-feeling.
- Fields: estimated_duration, you'll_probably_discuss[], things_to_keep_ready[], suggested_questions[], expected_outcome, pro_tip
- Generate from InsightProfile + chosen astrologer.consultation_style.

MINIMAL DATA MODEL (MVP)
- User (optional): id,email,display_name,timezone,locale
- Astrologer: as dataset fields above
- InsightProfile: persist the InsightProfile object (see schema)
- Booking: id,user_id,astrologer_id,slot_start,slot_end,contact_name,contact_email,status,created_at
- RecommendationRecord (optional lightweight): insight_profile_id, returned_ids_and_scores (for demo playback) — use sparingly; not required for demo

API CONTRACT (minimal)
- POST /api/analyze
  - Request: { session_id?, free_text, language?, timezone? }
  - Response: InsightProfile
- POST /api/recommend
  - Request: { insight_profile_id, filters? }
  - Response: { recommendations: [3 objects with astrologer, finalScore, trustBreakdown, matchExplanation, topSignals[]] }
- GET /api/astrologer/:id
  - Response: full profile + trust components
- POST /api/book
  - Request: { insight_profile_id, astrologer_id, slot_id, contact_name, contact_email }
  - Response: booking confirmation + session_brief (or session_brief_id)
- GET /api/sessionbrief/:booking_id
  - Response: Session Brief payload

TEST VECTORS
- Provide 30+ golden input sentences (already specified in the design artifacts) with expected InsightProfile outputs. These are required unit tests for the engine.

ACCEPTANCE CRITERIA (MVP)
- Insight Card appears within 3–5s for sample inputs and shows correct category & primaryNeed for >=90% of test vectors.
- Recommendations: top 3 are meaningfully justifiable by matchExplanation in manual judge checks.
- Trust Score is computed from components and visible with breakdown for each recommended astrologer.
- Booking: creates Booking record and shows Session Brief.
- No signup or payment required to reach recommendations.

IMPLEMENTATION SPRINT ORDER (freeze this)
Sprint 1: Insight Engine (rules, aliases, confidence math, test vectors)
Sprint 2: Insight Card (live analysis UX, explanation chips, confidence visualization)
Sprint 3: Recommendation Engine (scoring, trust computation, top 3)
Sprint 4: Trust‑first Profile (matchExplanation + trust breakdown visualization)
Sprint 5: Booking (fake slots; create Booking object)
Sprint 6: Session Brief (template engine and UI)
Sprint 7: Polish (animations, copy, accessibility, demo polish)

DEVELOPER RULES (must follow)
- Consume InsightProfile downstream — do not recompute or reinterpret engine outputs.
- TrustScore must be computed from raw components; do not hardcode or store static trust values.
- Confidence must be capped at 97.
- All recommendations must include explicit matchExplanation and topSignals[].
- No AI/LLM calls in MVP. Label future AI usage as "replaceable engine" in code comments.

DOCUMENTS TO CHECK INTO REPO (required before coding)
1) concern_ontology.csv (Category,Subcategory,Aliases,SuggestedConsultation,PrimaryNeed)
2) astrologer_dataset.csv (50 demo astrologers with required fields; do not include precomputed trust_score)
3) insight_engine_rules.md (rules, priority, confidence math, templates, examples)

FINAL NOTE (product discipline)
Treat this PRODUCT_SPEC as immutable for the duration of the hackathon. Every PR and implementation task MUST start with:
"Implement this feature exactly according to the AstroLive Product Specification. Do not redesign, rename, or reinterpret the product."

If you want, I can now commit the three required artifact files (concern_ontology.csv, astrologer_dataset.csv, insight_engine_rules.md) into the repository so engineering can start. Please confirm and I will push them to the repo on the default branch with a single commit.

