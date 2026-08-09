/**
 * PHASE 3G: Recommendation API
 *
 * POST /api/recommend
 *
 * Thin wrapper around the pure recommendation engine.
 * Inputs: InsightProfile ID (or direct InsightProfile) + optional filters
 * Output: Canonical RecommendationResponse with Top 3 astrologers
 *
 * Per PRODUCT_SPEC.md:
 * - Request: { insight_profile_id, filters? }
 * - Response: { recommendations: [3 objects with astrologer, finalScore, trustBreakdown, matchExplanation, topSignals[]] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { recommendAstrologers } from '../../../src/core/recommendation/recommend';
import { getAllAstrologers } from '../../../src/core/recommendation/dataset';
import { RecommendationResponse } from '../../../src/core/recommendation/types';
import { InsightProfile } from '../../../src/core/insight/types';

/**
 * TODO: In production, retrieve InsightProfile from database/session using insight_profile_id.
 * For now, mock implementations are acceptable for demo.
 */
function getMockInsightProfile(insightProfileId: string): InsightProfile {
  // Mock implementation: return a default insight
  // In production: query database
  return {
    id: insightProfileId,
    engineVersion: '1.0.0',
    concernCategory: 'Career',
    subcategory: 'Job Change (Decision Making)',
    primaryNeed: 'Decision Support',
    urgency: 'medium',
    consultationStyleHint: 'practical',
    suggestedConsultation: 'Career Guidance (Decision Session)',
    confidence: 92,
    explanation: [],
    quickInsightText: 'You are evaluating multiple career opportunities and need structured guidance.',
    created_at: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { insight_profile_id, filters } = body;

    // Validate request
    if (!insight_profile_id || typeof insight_profile_id !== 'string') {
      return NextResponse.json(
        {
          error: 'Missing or invalid insight_profile_id',
          details: 'Request must include insight_profile_id string',
        },
        { status: 400 }
      );
    }

    // Retrieve InsightProfile
    // TODO: Replace getMockInsightProfile with database query
    const insightProfile = getMockInsightProfile(insight_profile_id);

    // Load all astrologers
    const astrologers = getAllAstrologers();

    // Run recommendation engine
    const recommendations = recommendAstrologers(insightProfile, astrologers, filters);

    // Build response
    const response: RecommendationResponse = {
      recommendations,
      insight_profile_id,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in /api/recommend:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
