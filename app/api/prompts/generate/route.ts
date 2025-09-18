import { NextRequest, NextResponse } from 'next/server';
import { generateVideoPrompts } from '@/lib/prompt-generator';
import { getAnalysisWithPrompts, storePrompts } from '@/lib/supabase-helpers';

interface GeneratePromptsRequest {
  analysisId: string;
  forceRegenerate?: boolean;
  maxPrompts?: number;
}

interface GeneratePromptsResponse {
  success: boolean;
  prompts?: any[];
  analysisId?: string;
  totalGenerated?: number;
  fromCache?: boolean;
  error?: string;
  details?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: GeneratePromptsRequest = await request.json();
    const { analysisId, forceRegenerate = false, maxPrompts = 5 } = body;

    // Validate input
    if (!analysisId) {
      const errorResponse: GeneratePromptsResponse = {
        success: false,
        error: 'Analysis ID is required',
        details: 'Please provide a valid analysis ID'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Fetch analysis from database
    const analysisResult = await getAnalysisWithPrompts(analysisId);

    if (!analysisResult.success || !analysisResult.data) {
      const errorResponse: GeneratePromptsResponse = {
        success: false,
        error: 'Analysis not found',
        details: `No analysis found with ID: ${analysisId}`
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const analysisData = analysisResult.data;

    // Check if prompts already exist and we're not forcing regeneration
    if (!forceRegenerate && analysisData.video_prompts && analysisData.video_prompts.length > 0) {
      const successResponse: GeneratePromptsResponse = {
        success: true,
        prompts: analysisData.video_prompts,
        analysisId,
        totalGenerated: analysisData.video_prompts.length,
        fromCache: true
      };
      return NextResponse.json(successResponse, { status: 200 });
    }

    // Generate new prompts based on the analysis data
    const promptResult = generateVideoPrompts(analysisData.analysis_data, {
      maxPrompts,
      minPrompts: Math.min(3, maxPrompts)
    });

    if (promptResult.prompts.length === 0) {
      const errorResponse: GeneratePromptsResponse = {
        success: false,
        error: 'No prompts could be generated',
        details: 'The scene analysis did not provide enough information to generate video prompts'
      };
      return NextResponse.json(errorResponse, { status: 422 });
    }

    // If we're regenerating, delete existing prompts first
    if (forceRegenerate && analysisData.video_prompts && analysisData.video_prompts.length > 0) {
      // Note: The CASCADE delete will handle this when we store new prompts
      console.log(`Regenerating prompts for analysis ${analysisId}`);
    }

    // Store the generated prompts in the database
    const storeResult = await storePrompts(analysisId, promptResult.prompts);

    if (!storeResult.success) {
      const errorResponse: GeneratePromptsResponse = {
        success: false,
        error: 'Failed to store prompts',
        details: storeResult.error || 'Database storage failed'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Return the generated prompts with database IDs
    const storedPrompts = promptResult.prompts.map((prompt, index) => ({
      ...prompt,
      id: storeResult.promptIds?.[index] || prompt.id,
      scene_analysis_id: analysisId,
      created_at: new Date().toISOString(),
      is_selected: false,
      is_user_edited: false
    }));

    const successResponse: GeneratePromptsResponse = {
      success: true,
      prompts: storedPrompts,
      analysisId,
      totalGenerated: storedPrompts.length,
      fromCache: false
    };

    return NextResponse.json(successResponse, { status: 201 });

  } catch (error) {
    console.error('Generate prompts API error:', error);

    const errorResponse: GeneratePromptsResponse = {
      success: false,
      error: 'Prompt generation failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  const errorResponse: GeneratePromptsResponse = {
    success: false,
    error: 'Method not allowed',
    details: 'Use POST to generate prompts'
  };

  return NextResponse.json(errorResponse, { status: 405 });
}