import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order ID is required'
        },
        { status: 400 }
      );
    }

    // Query the order from Supabase
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, processing_status, processed_video_url, error_message, freepik_video_url, freepik_thumbnail_url')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      console.error('Failed to fetch order:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      );
    }

    // Return order status with relevant data
    const response: any = {
      success: true,
      status: order.processing_status || 'pending',
      orderId: order.id
    };

    // Include video URL when completed
    if (order.processing_status === 'completed' && order.processed_video_url) {
      response.videoUrl = order.processed_video_url;
      response.thumbnailUrl = order.freepik_thumbnail_url;
    }

    // Include error message if failed
    if (order.processing_status === 'failed' && order.error_message) {
      response.errorMessage = order.error_message;
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Order status API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order status'
      },
      { status: 500 }
    );
  }
}
