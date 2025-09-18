import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/stripe-client';
import { updateOrderPaymentStatus } from '@/lib/supabase-helpers';
import { triggerVideoProcessing } from '@/lib/video-processor';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { orderId, analysisId, promptId, orderType, videoFileUrl } = session.metadata || {};

    if (!orderId) {
      console.error('No order ID in checkout session metadata');
      return;
    }

    console.log(`Checkout completed for order: ${orderId}`);

    // Update order payment status
    const paymentIntentId = session.payment_intent as string;
    await updateOrderPaymentStatus(orderId, 'completed', paymentIntentId);

    // Update order with Stripe checkout session ID for reference
    // You might want to add this function to supabase-helpers if needed

    // Trigger video processing based on order type
    if (orderType === 'ai_generated' && analysisId && promptId) {
      await triggerVideoProcessing({
        orderId,
        analysisId,
        promptId,
        type: 'ai_generated'
      });
    } else if (orderType === 'direct_upload' && videoFileUrl) {
      await triggerVideoProcessing({
        orderId,
        videoFileUrl,
        type: 'direct_upload'
      });
    } else {
      console.error('Invalid order type or missing required data for video processing');
    }

  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`Payment succeeded: ${paymentIntent.id}`);

    // If you need additional processing when payment specifically succeeds
    // This is usually already handled in checkout.session.completed

    // You might want to send confirmation emails here or update additional metrics

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`Payment failed: ${paymentIntent.id}`);

    // Extract order ID from metadata if available
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      // Update order status to failed
      await updateOrderPaymentStatus(orderId, 'failed');

      // You might want to send notification email about failed payment
      // Or trigger retry logic
    }

  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}