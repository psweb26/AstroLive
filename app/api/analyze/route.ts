import { NextRequest, NextResponse } from 'next/server';
import { analyze } from '../../../src/core/insight/engine/analyze';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const concern = typeof body?.free_text === 'string' ? body.free_text.trim() : '';

    if (!concern) {
      return NextResponse.json({ error: 'Missing or invalid free_text' }, { status: 400 });
    }

    return NextResponse.json(analyze(concern));
  } catch {
    return NextResponse.json({ error: 'Unable to analyze concern' }, { status: 500 });
  }
}
