import { NextRequest, NextResponse } from 'next/server';
import { generateMorePrompts } from '@/lib/prompt-generator';
import { getAnalysisWithPrompts, storePrompts } from '@/lib/supabase-helpers';
import { VideoPrompt } from '@/types/video-prompts';

interface RegeneratePromptsRequest {
  analysisId: string;
  additionalCount?: number;
}

interface RegeneratePromptsResponse {
  success: boolean;
  newPrompts?: any[];
  analysisId?: string;
  totalAdded?: number;
  error?: string;
  details?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RegeneratePromptsRequest = await request.json();
    const { analysisId, additionalCount = 3 } = body;

    // Validate input
    if (!analysisId) {
      const errorResponse: RegeneratePromptsResponse = {
        success: false,
        error: 'Analysis ID is required',
        details: 'Please provide a valid analysis ID'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (additionalCount < 1 || additionalCount > 10) {
      const errorResponse: RegeneratePromptsResponse = {
        success: false,
        error: 'Invalid count',
        details: 'Additional count must be between 1 and 10'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Fetch analysis and existing prompts from database
    const analysisResult = await getAnalysisWithPrompts(analysisId);

    if (!analysisResult.success || !analysisResult.data) {
      const errorResponse: RegeneratePromptsResponse = {
        success: false,
        error: 'Analysis not found',
        details: `No analysis found with ID: ${analysisId}`
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const analysisData = analysisResult.data;
    const existingPrompts = analysisData.video_prompts || [];

    // Convert database prompts to VideoPrompt format for the generator
    const existingVideoPrompts: VideoPrompt[] = existingPrompts.map(dbPrompt => ({
      id: dbPrompt.id,
      title: dbPrompt.prompt_title || 'Generated Prompt',
      description: dbPrompt.prompt_text,
      tags: dbPrompt.metadata?.tags || [],
      confidence: dbPrompt.confidence_score || 50,
      elements: dbPrompt.elements_used || [],
      category: dbPrompt.prompt_category as VideoPrompt['category'] || 'delivery',
      duration: dbPrompt.metadata?.duration || 'medium'
    }));

    // Generate additional prompts based on the analysis and existing prompts
    const newPrompts = generateMorePrompts(
      analysisData.analysis_data,
      existingVideoPrompts,
      additionalCount
    );

    if (newPrompts.length === 0) {
      const errorResponse: RegeneratePromptsResponse = {
        success: false,
        error: 'No additional prompts could be generated',
        details: 'The prompt generator could not create more variations for this scene'
      };
      return NextResponse.json(errorResponse, { status: 422 });
    }

    // Store the new prompts in the database
    const storeResult = await storePrompts(analysisId, newPrompts);

    if (!storeResult.success) {
      const errorResponse: RegeneratePromptsResponse = {
        success: false,
        error: 'Failed to store new prompts',
        details: storeResult.error || 'Database storage failed'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Return the newly generated prompts with database IDs
    const storedNewPrompts = newPrompts.map((prompt, index) => ({
      ...prompt,
      id: storeResult.promptIds?.[index] || prompt.id,
      scene_analysis_id: analysisId,
      created_at: new Date().toISOString(),
      is_selected: false,
      is_user_edited: false,
      prompt_text: prompt.description,
      prompt_title: prompt.title,
      prompt_category: prompt.category,
      confidence_score: prompt.confidence,
      elements_used: prompt.elements,
      metadata: {
        tags: prompt.tags,
        duration: prompt.duration
      }
    }));

    const successResponse: RegeneratePromptsResponse = {
      success: true,
      newPrompts: storedNewPrompts,
      analysisId,
      totalAdded: storedNewPrompts.length
    };

    return NextResponse.json(successResponse, { status: 201 });

  } catch (error) {
    console.error('Regenerate prompts API error:', error);

    const errorResponse: RegeneratePromptsResponse = {
      success: false,
      error: 'Prompt regeneration failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  const errorResponse: RegeneratePromptsResponse = {
    success: false,
    error: 'Method not allowed',
    details: 'Use POST to regenerate prompts'
  };

  return NextResponse.json(errorResponse, { status: 405 });
}