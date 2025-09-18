import { NextRequest, NextResponse } from 'next/server';
import { getAnalysisWithPrompts } from '@/lib/supabase-helpers';
import { GetAnalysisResponse } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const analysisId = params.id;

    if (!analysisId) {
      const errorResponse: GetAnalysisResponse = {
        success: false,
        error: 'Analysis ID is required'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const result = await getAnalysisWithPrompts(analysisId);

    if (!result.success) {
      const errorResponse: GetAnalysisResponse = {
        success: false,
        error: result.error || 'Failed to retrieve analysis'
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const successResponse: GetAnalysisResponse = {
      success: true,
      analysis: result.data
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Get analysis API error:', error);

    const errorResponse: GetAnalysisResponse = {
      success: false,
      error: 'Failed to retrieve analysis'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}