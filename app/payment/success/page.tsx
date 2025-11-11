'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight, Clock, Gift } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || '';

  return (
    <>
      <Navbar />

      <MaxWidthWrapper className="mt-10 flex flex-col items-center justify-center text-center sm:mt-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-4xl font-heading font-bold text-charcoal sm:text-5xl">
            Payment <span className="text-christmasRed">Successful!</span>
          </h1>
          <p className="mt-4 text-lg text-charcoal/70 font-body max-w-2xl">
            🎉 Your magical Santa video is now being created!
          </p>
        </div>

        {/* Success Card */}
        <Card className="w-full max-w-2xl p-8 bg-cream border-2 border-green-200 shadow-frost mb-8">
          <CardTitle className="text-2xl font-heading text-christmasRed mb-4">
            Order Confirmed
          </CardTitle>
          <CardDescription className="text-charcoal/70 font-body mb-6 text-lg">
            Thank you for your payment! We&apos;re now working on transforming your doorbell scene into a magical Santa video.
          </CardDescription>

          <div className="space-y-4 text-left bg-snowWhite p-6 rounded-lg border border-coolGray/20">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-body text-charcoal">Payment of £12.50 processed successfully</span>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-warmGold" />
              <span className="font-body text-charcoal">Video creation started (2-5 minutes)</span>
            </div>

            <div className="flex items-center space-x-3">
              <Gift className="w-5 h-5 text-christmasRed" />
              <span className="font-body text-charcoal">You&apos;ll receive an email when your video is ready</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href={`/processing?orderId=${orderId}`}
              className={cn(
                buttonVariants({
                  size: "lg",
                  className: "w-full bg-christmasRed hover:bg-[#A71D23] text-white shadow-glow text-lg py-4"
                })
              )}
            >
              Watch Your Video Being Created! 🎬
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <Link
              href="/"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full border-2 border-coolGray/30 text-charcoal hover:bg-coolGray/10"
                })
              )}
            >
              Return to Homepage
            </Link>
          </div>
        </Card>

        {/* What Happens Next */}
        <Card className="w-full max-w-2xl p-6 bg-frostBlue/10 border-2 border-frostBlue/20 shadow-frost">
          <CardTitle className="text-xl font-heading text-christmasRed mb-4">
            🎬 What Happens Next?
          </CardTitle>

          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-christmasRed text-white text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-heading font-semibold text-charcoal">AI Magic Begins</h4>
                <p className="text-charcoal/70 font-body text-sm">
                  Our AI analyzes your doorbell scene and begins creating your personalized Santa video
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-evergreen text-white text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-heading font-semibold text-charcoal">Santa Arrives</h4>
                <p className="text-charcoal/70 font-body text-sm">
                  We add realistic Santa magic to your scene with perfect lighting and placement
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warmGold text-white text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-heading font-semibold text-charcoal">Video Delivered</h4>
                <p className="text-charcoal/70 font-body text-sm">
                  Your 8-second magical video is emailed to you, ready to share with family and friends
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Trust Signals */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Card className="p-6 bg-snowWhite border-2 border-warmGold/20 shadow-frost text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-heading font-semibold text-christmasRed mb-2">Secure Payment</h3>
            <p className="text-charcoal/70 font-body text-sm">
              Your payment was processed securely through Stripe
            </p>
          </Card>

          <Card className="p-6 bg-snowWhite border-2 border-warmGold/20 shadow-frost text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-heading font-semibold text-christmasRed mb-2">Fast Processing</h3>
            <p className="text-charcoal/70 font-body text-sm">
              Your video will be ready within minutes
            </p>
          </Card>

          <Card className="p-6 bg-snowWhite border-2 border-warmGold/20 shadow-frost text-center">
            <div className="text-3xl mb-2">💌</div>
            <h3 className="font-heading font-semibold text-christmasRed mb-2">Email Delivery</h3>
            <p className="text-charcoal/70 font-body text-sm">
              Direct download link sent to your inbox
            </p>
          </Card>
        </div>
      </MaxWidthWrapper>

      <Footer />
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-christmasRed"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}