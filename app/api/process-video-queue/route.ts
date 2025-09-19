import { NextRequest, NextResponse } from 'next/server';
import { triggerVideoProcessing } from '@/lib/video-processor';

/**
 * Process Video Queue API
 *
 * This endpoint can be called to manually trigger video processing
 * or can be used by queue systems or webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, analysisId, promptId, videoDuration } = body;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!analysisId || !promptId) {
      return NextResponse.json(
        { error: 'Analysis ID and prompt ID are required for AI video generation' },
        { status: 400 }
      );
    }

    console.log(`Processing video queue request for order: ${orderId}`);

    // Trigger video processing
    await triggerVideoProcessing({
      orderId,
      type: 'ai_generated',
      analysisId,
      promptId,
      videoDuration: videoDuration || 10 // Default to 10 seconds
    });

    console.log(`Video processing initiated for order: ${orderId}`);

    return NextResponse.json({
      success: true,
      message: 'Video processing initiated',
      orderId
    });

  } catch (error) {
    console.error('Video queue processing error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: 'Video processing failed',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

/**
 * Get processing status for an order
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Import here to avoid circular imports
    const { supabaseAdmin } = await import('@/lib/supabase-client');

    // Get order status
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        processing_status,
        freepik_status,
        processing_started_at,
        processing_completed_at,
        processing_duration_seconds,
        processed_video_url,
        freepik_thumbnail_url,
        error_message,
        retry_count
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Failed to get order status:', error);
      return NextResponse.json(
        { error: 'Failed to get order status' },
        { status: 404 }
      );
    }

    // Calculate processing progress
    let progress = 0;
    let estimatedTimeRemaining = null;

    switch (order.processing_status) {
      case 'pending':
        progress = 0;
        break;
      case 'processing':
        // Estimate based on Freepik status
        switch (order.freepik_status) {
          case 'queued':
            progress = 10;
            estimatedTimeRemaining = 240; // 4 minutes average
            break;
          case 'processing':
            progress = 50;
            estimatedTimeRemaining = 120; // 2 minutes remaining
            break;
          default:
            progress = 25;
            estimatedTimeRemaining = 180;
        }
        break;
      case 'completed':
        progress = 100;
        break;
      case 'failed':
        progress = 0;
        break;
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.processing_status,
        freepikStatus: order.freepik_status,
        progress,
        estimatedTimeRemaining,
        startedAt: order.processing_started_at,
        completedAt: order.processing_completed_at,
        processingDuration: order.processing_duration_seconds,
        videoUrl: order.processed_video_url,
        thumbnailUrl: order.freepik_thumbnail_url,
        errorMessage: order.error_message,
        retryCount: order.retry_count
      }
    });

  } catch (error) {
    console.error('Status check error:', error);

    return NextResponse.json(
      {
        error: 'Failed to check status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Retry failed video processing
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (action !== 'retry') {
      return NextResponse.json(
        { error: 'Invalid action. Only "retry" is supported' },
        { status: 400 }
      );
    }

    // Import here to avoid circular imports
    const { supabaseAdmin } = await import('@/lib/supabase-client');

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        scene_analysis_id,
        selected_prompt_id,
        processing_status,
        retry_count,
        video_duration
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is eligible for retry
    if (order.processing_status !== 'failed') {
      return NextResponse.json(
        { error: 'Order is not in failed status' },
        { status: 400 }
      );
    }

    const maxRetries = 3;
    if ((order.retry_count || 0) >= maxRetries) {
      return NextResponse.json(
        { error: `Maximum retry attempts (${maxRetries}) exceeded` },
        { status: 400 }
      );
    }

    console.log(`Retrying video processing for order: ${orderId} (attempt ${(order.retry_count || 0) + 1})`);

    // Update retry count
    await supabaseAdmin
      .from('orders')
      .update({
        retry_count: (order.retry_count || 0) + 1,
        last_retry_at: new Date().toISOString(),
        processing_status: 'pending',
        error_message: null
      })
      .eq('id', orderId);

    // Trigger video processing retry
    await triggerVideoProcessing({
      orderId,
      type: 'ai_generated',
      analysisId: order.scene_analysis_id!,
      promptId: order.selected_prompt_id!,
      videoDuration: (order.video_duration as 5 | 10) || 10
    });

    return NextResponse.json({
      success: true,
      message: 'Video processing retry initiated',
      orderId,
      retryCount: (order.retry_count || 0) + 1
    });

  } catch (error) {
    console.error('Retry processing error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retry processing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}