import { NextRequest, NextResponse } from 'next/server';
import { updatePromptText } from '@/lib/supabase-helpers';

interface EditPromptRequest {
  promptId: string;
  newText: string;
}

interface EditPromptResponse {
  success: boolean;
  promptId?: string;
  updatedText?: string;
  error?: string;
  details?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: EditPromptRequest = await request.json();
    const { promptId, newText } = body;

    // Validate required fields
    if (!promptId || !newText) {
      const errorResponse: EditPromptResponse = {
        success: false,
        error: 'Missing required fields',
        details: 'Both promptId and newText are required'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate text length (reasonable limits)
    const trimmedText = newText.trim();
    if (trimmedText.length < 10) {
      const errorResponse: EditPromptResponse = {
        success: false,
        error: 'Text too short',
        details: 'Prompt text must be at least 10 characters long'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (trimmedText.length > 500) {
      const errorResponse: EditPromptResponse = {
        success: false,
        error: 'Text too long',
        details: 'Prompt text must be less than 500 characters'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Update prompt text in database
    const updateResult = await updatePromptText(promptId, trimmedText);

    if (!updateResult.success) {
      const errorResponse: EditPromptResponse = {
        success: false,
        error: 'Failed to update prompt',
        details: updateResult.error || 'Database update failed'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const successResponse: EditPromptResponse = {
      success: true,
      promptId,
      updatedText: trimmedText
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Edit prompt API error:', error);

    const errorResponse: EditPromptResponse = {
      success: false,
      error: 'Prompt editing failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  const errorResponse: EditPromptResponse = {
    success: false,
    error: 'Method not allowed',
    details: 'Use POST to edit a prompt'
  };

  return NextResponse.json(errorResponse, { status: 405 });
}