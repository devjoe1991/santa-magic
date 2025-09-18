import { NextRequest, NextResponse } from 'next/server';
import { updatePromptSelection, updatePromptText } from '@/lib/supabase-helpers';
import { UpdatePromptSelectionRequest } from '@/types/database';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'select') {
      const { analysisId, promptId }: UpdatePromptSelectionRequest = body;

      if (!analysisId || !promptId) {
        return NextResponse.json(
          { success: false, error: 'Analysis ID and Prompt ID are required' },
          { status: 400 }
        );
      }

      const result = await updatePromptSelection(analysisId, promptId);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });

    } else if (action === 'edit') {
      const { promptId, newText } = body;

      if (!promptId || !newText) {
        return NextResponse.json(
          { success: false, error: 'Prompt ID and new text are required' },
          { status: 400 }
        );
      }

      const result = await updatePromptText(promptId, newText);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "select" or "edit"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Update prompt API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}