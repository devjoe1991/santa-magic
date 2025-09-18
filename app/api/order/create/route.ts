import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/supabase-helpers';
import { createCheckoutSession } from '@/lib/stripe-client';
import { CreateOrderRequest, CreateOrderResponse } from '@/types/database';

interface ExtendedCreateOrderRequest extends CreateOrderRequest {
  videoFileUrl?: string; // For backward compatibility with direct uploads
  testMode?: boolean; // For development testing without payment
}

interface ExtendedCreateOrderResponse extends CreateOrderResponse {
  checkoutUrl?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: ExtendedCreateOrderRequest = await request.json();
    const { email, analysisId, selectedPromptId, videoFileUrl, testMode } = body;

    // Validate required fields - either AI flow or direct upload
    if (!email) {
      const errorResponse: ExtendedCreateOrderResponse = {
        success: false,
        error: 'Email is required'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // For AI-generated videos, both analysisId and selectedPromptId are required
    // For direct uploads, videoFileUrl is required
    if (!analysisId && !videoFileUrl) {
      const errorResponse: ExtendedCreateOrderResponse = {
        success: false,
        error: 'Either analysis data or video file is required'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (analysisId && !selectedPromptId) {
      const errorResponse: ExtendedCreateOrderResponse = {
        success: false,
        error: 'Selected prompt ID is required for AI-generated videos'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Basic email validation (skip in test mode)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!testMode && !emailRegex.test(email)) {
      const errorResponse: ExtendedCreateOrderResponse = {
        success: false,
        error: 'Invalid email format'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create order in database
    const result = await createOrder(email, analysisId, selectedPromptId);

    if (!result.success) {
      const errorResponse: ExtendedCreateOrderResponse = {
        success: false,
        error: result.error || 'Failed to create order'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Check if in test mode and skip payment
    if (testMode && process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
      console.log(`Creating test order ${result.orderId} - skipping payment`);

      // Import and update order payment status to completed for testing
      const { updateOrderPaymentStatus } = await import('@/lib/supabase-helpers');
      await updateOrderPaymentStatus(result.orderId!, 'completed', 'test-payment-intent');

      const successResponse: ExtendedCreateOrderResponse = {
        success: true,
        orderId: result.orderId
        // No checkoutUrl in test mode
      };

      return NextResponse.json(successResponse, { status: 201 });
    }

    // Create Stripe checkout session for production
    try {
      const orderType = analysisId ? 'ai_generated' : 'direct_upload';

      const checkoutSession = await createCheckoutSession({
        orderId: result.orderId!,
        email,
        amount: 1250, // £12.50 in pence
        metadata: {
          orderId: result.orderId!,
          analysisId: analysisId || '',
          promptId: selectedPromptId || '',
          orderType,
          ...(videoFileUrl && { videoFileUrl })
        }
      });

      const successResponse: ExtendedCreateOrderResponse = {
        success: true,
        orderId: result.orderId,
        checkoutUrl: checkoutSession.url || undefined
      };

      return NextResponse.json(successResponse, { status: 201 });

    } catch (stripeError) {
      console.error('Stripe checkout session creation failed:', stripeError);

      // Cleanup the order if Stripe fails
      // Note: You might want to implement order cleanup here

      const errorResponse: ExtendedCreateOrderResponse = {
        success: false,
        error: 'Failed to create payment session. Please try again.'
      };

      return NextResponse.json(errorResponse, { status: 500 });
    }

  } catch (error) {
    console.error('Create order API error:', error);

    const errorResponse: ExtendedCreateOrderResponse = {
      success: false,
      error: 'Failed to create order'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}