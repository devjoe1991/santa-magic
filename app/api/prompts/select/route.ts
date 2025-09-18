import { NextRequest, NextResponse } from 'next/server';
import { updatePromptSelection, updatePromptText } from '@/lib/supabase-helpers';

interface SelectPromptRequest {
  analysisId: string;
  promptId: string;
  editedText?: string;
}

interface SelectPromptResponse {
  success: boolean;
  selectedPromptId?: string;
  isEdited?: boolean;
  error?: string;
  details?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: SelectPromptRequest = await request.json();
    const { analysisId, promptId, editedText } = body;

    // Validate required fields
    if (!analysisId || !promptId) {
      const errorResponse: SelectPromptResponse = {
        success: false,
        error: 'Missing required fields',
        details: 'Both analysisId and promptId are required'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Update prompt selection in database
    const selectionResult = await updatePromptSelection(analysisId, promptId);

    if (!selectionResult.success) {
      const errorResponse: SelectPromptResponse = {
        success: false,
        error: 'Failed to select prompt',
        details: selectionResult.error || 'Database update failed'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    let isEdited = false;

    // If edited text is provided, update the prompt text
    if (editedText && editedText.trim() !== '') {
      const editResult = await updatePromptText(promptId, editedText.trim());

      if (!editResult.success) {
        // Log the error but don't fail the entire request since selection succeeded
        console.error('Failed to update prompt text:', editResult.error);
      } else {
        isEdited = true;
      }
    }

    const successResponse: SelectPromptResponse = {
      success: true,
      selectedPromptId: promptId,
      isEdited
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Select prompt API error:', error);

    const errorResponse: SelectPromptResponse = {
      success: false,
      error: 'Prompt selection failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  const errorResponse: SelectPromptResponse = {
    success: false,
    error: 'Method not allowed',
    details: 'Use POST to select a prompt'
  };

  return NextResponse.json(errorResponse, { status: 405 });
}