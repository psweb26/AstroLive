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
import { isInsightProfile } from '../../../lib/insight-session';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { insightProfile, filters } = body;

    // Validate request
    if (!isInsightProfile(insightProfile)) {
      return NextResponse.json(
        {
          error: 'Missing or invalid InsightProfile',
          details: 'Request must include the current InsightProfile object',
        },
        { status: 400 }
      );
    }

    // Load all astrologers
    const astrologers = getAllAstrologers();

    // Run recommendation engine
    const recommendations = recommendAstrologers(insightProfile, astrologers, filters);

    // Build response
    const response: RecommendationResponse = {
      recommendations,
      insight_profile_id: insightProfile.id,
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
