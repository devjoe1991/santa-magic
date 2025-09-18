import { NextRequest, NextResponse } from 'next/server';
import { analyzeScene, convertFileToBase64, isValidImageFormat } from '@/lib/scene-analyzer';
import { generateVideoPrompts } from '@/lib/prompt-generator';
import {
  uploadImageToStorage,
  storeSceneAnalysis,
  storePrompts,
  cleanupAnalysis,
  cleanupImage
} from '@/lib/supabase-helpers';
import { AnalysisResponse } from '@/types/scene-analysis';
import { EnhancedAnalysisResponse } from '@/types/database';
import { AppError, ErrorCodes, logError } from '@/lib/error-handler';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  let uploadedImagePath: string | undefined;
  let analysisId: string | undefined;

  try {
    // Check content type
    const contentType = request.headers.get('content-type') || '';

    let base64Image: string;
    let imageBuffer: Buffer;
    let fileExtension: string;

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('image') as File;

      if (!file) {
        const errorResponse: EnhancedAnalysisResponse = {
          success: false,
          error: 'No image file provided',
          details: 'Please upload an image file'
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      // Validate file type
      if (!isValidImageFormat(file.type)) {
        const error = new AppError(
          'Invalid image format. Please use JPG, PNG, or WebP files.',
          ErrorCodes.IMAGE_INVALID_FORMAT,
          'upload',
          true,
          ['Convert your image to JPG or PNG format', 'Take a new photo']
        );
        logError(error);

        const errorResponse: EnhancedAnalysisResponse = {
          success: false,
          error: error.message,
          details: 'Supported formats: JPEG, PNG, WebP'
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      // Validate file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        const error = new AppError(
          'Image file is too large. Maximum size allowed is 20MB.',
          ErrorCodes.IMAGE_TOO_LARGE,
          'upload',
          true,
          ['Compress your image to under 20MB', 'Use a different image format', 'Take a new photo with lower resolution']
        );
        logError(error);

        const errorResponse: EnhancedAnalysisResponse = {
          success: false,
          error: error.message,
          details: 'Maximum file size is 20MB'
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      // Convert to buffer and base64
      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
      base64Image = convertFileToBase64(imageBuffer);

      // Extract file extension
      fileExtension = file.type.split('/')[1] || 'jpg';

    } else if (contentType.includes('application/json')) {
      // Handle JSON with base64 image data
      const body = await request.json();

      if (!body.imageData) {
        const errorResponse: EnhancedAnalysisResponse = {
          success: false,
          error: 'No image data provided',
          details: 'Please provide base64 image data'
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      base64Image = body.imageData.replace(/^data:image\/[^;]+;base64,/, '');
      // For JSON uploads, we don't have a buffer for storage
      imageBuffer = Buffer.from(base64Image, 'base64');
      fileExtension = 'jpg'; // Default for JSON uploads

    } else {
      const errorResponse: EnhancedAnalysisResponse = {
        success: false,
        error: 'Invalid content type',
        details: 'Use multipart/form-data or application/json'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate base64 string
    if (!base64Image || base64Image.length === 0) {
      const errorResponse: EnhancedAnalysisResponse = {
        success: false,
        error: 'Invalid image data',
        details: 'Image data appears to be empty or corrupted'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Step 1: Upload image to Supabase Storage
    const uploadResult = await uploadImageToStorage(imageBuffer, fileExtension);
    if (!uploadResult.success) {
      const errorResponse: EnhancedAnalysisResponse = {
        success: false,
        error: 'Image upload failed',
        details: uploadResult.error
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    uploadedImagePath = uploadResult.path;

    // Step 2: Analyze the scene
    const analysis = await analyzeScene(base64Image);
    const processingTime = Date.now() - startTime;

    // Step 3: Store analysis in database
    const storeResult = await storeSceneAnalysis(
      analysis,
      uploadedImagePath,
      processingTime
    );

    if (!storeResult.success) {
      // Cleanup uploaded image on failure
      if (uploadedImagePath) {
        await cleanupImage(uploadedImagePath);
      }

      const errorResponse: EnhancedAnalysisResponse = {
        success: false,
        error: 'Failed to store analysis',
        details: storeResult.error
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    analysisId = storeResult.analysisId!;

    // Step 4: Generate and store prompts
    const promptResult = generateVideoPrompts(analysis);
    const promptStoreResult = await storePrompts(analysisId, promptResult.prompts);

    if (!promptStoreResult.success) {
      console.error('Failed to store prompts:', promptStoreResult.error);
      // Don't fail the entire request for prompt storage issues
    }

    const successResponse: EnhancedAnalysisResponse = {
      success: true,
      analysisId,
      analysis,
      prompts: promptResult.prompts,
      imageUrl: uploadResult.url
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Scene analysis API error:', error);

    // Create appropriate error object
    let appError: AppError;
    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = new AppError(
        'Scene analysis failed. Please try again.',
        ErrorCodes.ANALYSIS_FAILED,
        'scene-analysis',
        true,
        ['Try uploading a different image', 'Ensure good lighting in your photo', 'Check your internet connection']
      );
    } else {
      appError = new AppError(
        'An unexpected error occurred during analysis.',
        'UNKNOWN_ERROR',
        'scene-analysis',
        true,
        ['Please try again', 'Contact support if the problem persists']
      );
    }

    logError(appError);

    // Cleanup on error
    try {
      if (uploadedImagePath) {
        await cleanupImage(uploadedImagePath);
      }
      if (analysisId) {
        await cleanupAnalysis(analysisId);
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
      // Don't throw cleanup errors
    }

    const errorResponse: EnhancedAnalysisResponse = {
      success: false,
      error: appError.message,
      details: appError.suggestions?.[0] || 'Please try again'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  const errorResponse: AnalysisResponse = {
    success: false,
    error: 'Method not allowed',
    details: 'Use POST to analyze images'
  };

  return NextResponse.json(errorResponse, { status: 405 });
}