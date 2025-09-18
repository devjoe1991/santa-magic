import { NextRequest, NextResponse } from 'next/server';
import { createFreepikClient } from '@/lib/freepik-client';
import { getEmailPreview } from '@/lib/email-service';

/**
 * Test Video Generation API Endpoint
 *
 * This endpoint is for testing purposes only and should be removed in production
 * It allows testing the video generation pipeline without requiring a full order
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testType = searchParams.get('type') || 'connection';

  switch (testType) {
    case 'connection':
      return testConnection();
    case 'email':
      return testEmailTemplates();
    case 'metrics':
      return testMetrics();
    default:
      return NextResponse.json({
        error: 'Invalid test type',
        availableTests: ['connection', 'email', 'metrics']
      }, { status: 400 });
  }
}

/**
 * Test Freepik API connection
 */
async function testConnection() {
  try {
    const client = createFreepikClient();

    // Test if client can be created successfully
    return NextResponse.json({
      success: true,
      message: 'Freepik client created successfully',
      apiKeyPresent: !!process.env.FREEPIK_API_KEY,
      environment: {
        FREEPIK_API_KEY: process.env.FREEPIK_API_KEY ? 'Present' : 'Missing',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
        SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY ? 'Present' : 'Missing'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Test email template generation
 */
async function testEmailTemplates() {
  try {
    const mockData = {
      orderId: 'test-order-' + Date.now(),
      customerEmail: 'test@example.com',
      videoUrl: 'https://example.com/santa-magic-video.mp4',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      processingDuration: 180
    };

    const successTemplate = getEmailPreview('success', mockData);
    const failureTemplate = getEmailPreview('failure', {
      ...mockData,
      errorMessage: 'Test error: Video processing failed'
    });

    return NextResponse.json({
      success: true,
      templates: {
        success: {
          subject: successTemplate.subject,
          htmlLength: successTemplate.htmlBody.length,
          textLength: successTemplate.textBody.length
        },
        failure: {
          subject: failureTemplate.subject,
          htmlLength: failureTemplate.htmlBody.length,
          textLength: failureTemplate.textBody.length
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Template generation failed'
    }, { status: 500 });
  }
}

/**
 * Test processing metrics
 */
async function testMetrics() {
  try {
    const { getProcessingMetrics } = await import('@/lib/supabase-helpers');

    const dailyMetrics = await getProcessingMetrics('day');
    const hourlyMetrics = await getProcessingMetrics('hour');

    return NextResponse.json({
      success: true,
      metrics: {
        daily: dailyMetrics.success ? dailyMetrics.data : { error: dailyMetrics.error },
        hourly: hourlyMetrics.success ? hourlyMetrics.data : { error: hourlyMetrics.error }
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Metrics test failed'
    }, { status: 500 });
  }
}

/**
 * POST endpoint for manual video generation testing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, prompt, duration = 5 } = body;

    if (!imageUrl || !prompt) {
      return NextResponse.json({
        error: 'imageUrl and prompt are required'
      }, { status: 400 });
    }

    // Create test order ID
    const testOrderId = `test-${Date.now()}`;

    console.log(`Testing video generation for order: ${testOrderId}`);

    // Create Freepik client
    const client = createFreepikClient();

    // Test video generation (this will actually call the API)
    const result = await client.generateVideo({
      orderId: testOrderId,
      imageUrl,
      prompt,
      duration,
      enhancePrompt: true,
      metadata: {
        analysisId: 'test-analysis',
        promptId: 'test-prompt',
        promptTitle: 'Test Santa Magic',
        confidenceScore: 85
      }
    });

    return NextResponse.json({
      success: true,
      testOrderId,
      result: {
        success: result.success,
        jobId: result.jobId,
        videoUrl: result.videoUrl,
        thumbnailUrl: result.thumbnailUrl,
        error: result.error,
        processingTime: result.processingTimeMs
      }
    });

  } catch (error) {
    console.error('Manual video generation test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 });
  }
}

/**
 * DELETE endpoint to cleanup test data
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testOrderId = searchParams.get('testOrderId');

  if (!testOrderId || !testOrderId.startsWith('test-')) {
    return NextResponse.json({
      error: 'Invalid test order ID'
    }, { status: 400 });
  }

  try {
    // Here you could add cleanup logic if needed
    // For now, just acknowledge the cleanup request

    return NextResponse.json({
      success: true,
      message: `Test data for ${testOrderId} marked for cleanup`
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Cleanup failed'
    }, { status: 500 });
  }
}