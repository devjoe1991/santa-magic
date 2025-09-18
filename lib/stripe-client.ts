import Stripe from 'stripe';

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

export interface CreateCheckoutSessionParams {
  orderId: string;
  email: string;
  amount: number; // in pence
  metadata: {
    orderId: string;
    analysisId?: string;
    promptId?: string;
    orderType: 'ai_generated' | 'direct_upload';
  };
}

/**
 * Create a Stripe checkout session for the order
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  const { orderId, email, amount, metadata } = params;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Santa Doorbell Magic Video',
            description: 'Transform your doorbell footage into a magical Santa video',
            images: [
              // Add your product image URL here if you have one
              `${process.env.NEXT_PUBLIC_SITE_URL || 'https://santadoorbellmagic.com'}/santa-magic-preview.jpg`
            ],
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/cancel?order_id=${orderId}`,
    metadata,
    expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
  });

  return session;
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

/**
 * Retrieve a checkout session
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Create a payment intent (for custom payment flows if needed)
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'gbp',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Process a refund
 */
export async function processRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: Stripe.RefundCreateParams.Reason
): Promise<Stripe.Refund> {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
    reason,
  });
}

/**
 * Get payment intent details
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}