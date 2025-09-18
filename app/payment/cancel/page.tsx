import { Suspense } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { XCircle, ArrowLeft, HelpCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function PaymentCancelContent() {
  return (
    <>
      <Navbar />

      <MaxWidthWrapper className="mt-10 flex flex-col items-center justify-center text-center sm:mt-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-4xl font-heading font-bold text-charcoal sm:text-5xl">
            Payment <span className="text-red-600">Cancelled</span>
          </h1>
          <p className="mt-4 text-lg text-charcoal/70 font-body max-w-2xl">
            Your payment was cancelled and no charges were made to your account.
          </p>
        </div>

        {/* Cancel Card */}
        <Card className="w-full max-w-2xl p-8 bg-cream border-2 border-red-200 shadow-frost mb-8">
          <CardTitle className="text-2xl font-heading text-red-600 mb-4">
            No Worries!
          </CardTitle>
          <CardDescription className="text-charcoal/70 font-body mb-6 text-lg">
            Your magical Santa video is still waiting to be created. You can try again anytime, and we&apos;ve saved your scene analysis and prompt selection.
          </CardDescription>

          <div className="space-y-4 text-left bg-snowWhite p-6 rounded-lg border border-coolGray/20">
            <div className="flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="font-body text-charcoal">No payment was processed</span>
            </div>

            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-christmasRed" />
              <span className="font-body text-charcoal">Your scene analysis is saved for 24 hours</span>
            </div>

            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-warmGold" />
              <span className="font-body text-charcoal">Need help? Our support team is here for you</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="/upload"
              className={cn(
                buttonVariants({
                  size: "lg",
                  className: "w-full bg-christmasRed hover:bg-[#A71D23] text-white shadow-glow text-lg py-4"
                })
              )}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Try Payment Again
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

        {/* Common Reasons */}
        <Card className="w-full max-w-2xl p-6 bg-frostBlue/10 border-2 border-frostBlue/20 shadow-frost">
          <CardTitle className="text-xl font-heading text-christmasRed mb-4">
            💡 Common Reasons for Payment Cancellation
          </CardTitle>

          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warmGold text-white text-sm font-bold">
                ?
              </div>
              <div>
                <h4 className="font-heading font-semibold text-charcoal">Browser Issues</h4>
                <p className="text-charcoal/70 font-body text-sm">
                  Payment popup was blocked or closed accidentally
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-christmasRed text-white text-sm font-bold">
                💳
              </div>
              <div>
                <h4 className="font-heading font-semibold text-charcoal">Card Information</h4>
                <p className="text-charcoal/70 font-body text-sm">
                  Double-check your card details and billing address
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-evergreen text-white text-sm font-bold">
                🔒
              </div>
              <div>
                <h4 className="font-heading font-semibold text-charcoal">Security Settings</h4>
                <p className="text-charcoal/70 font-body text-sm">
                  Your bank may require additional verification for online purchases
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Support Section */}
        <Card className="w-full max-w-2xl mt-8 p-6 bg-snowWhite border-2 border-warmGold/20 shadow-frost text-center">
          <h3 className="font-heading font-semibold text-christmasRed mb-2">Need Help with Payment?</h3>
          <p className="text-charcoal/70 font-body text-sm mb-4">
            Our team is here to help you complete your magical Santa video order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@santadoorbellmagic.com?subject=Payment Help - Order Issue"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "border-2 border-christmasRed/30 text-christmasRed hover:bg-christmasRed/10"
                })
              )}
            >
              Email Support
            </a>
            <Link
              href="/how-it-works"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "border-2 border-coolGray/30 text-charcoal hover:bg-coolGray/10"
                })
              )}
            >
              How It Works
            </Link>
          </div>
        </Card>

        {/* Alternative Options */}
        <Card className="w-full max-w-2xl mt-8 p-6 bg-lightFrost border border-coolGray/20 text-center">
          <h3 className="font-heading font-semibold text-charcoal mb-3">💝 Still Want Your Santa Video?</h3>
          <p className="text-charcoal/70 font-body text-sm mb-4">
            Your scene analysis and selected prompt are saved. Simply return to the upload page to complete your order.
          </p>
          <div className="bg-warmGold/10 p-4 rounded-lg border border-warmGold/20">
            <p className="text-charcoal font-body text-sm">
              <strong>💡 Pro tip:</strong> Try using a different payment method or contact your bank if the issue persists.
              We accept all major credit and debit cards through Stripe&apos;s secure payment system.
            </p>
          </div>
        </Card>
      </MaxWidthWrapper>

      <Footer />
    </>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-christmasRed"></div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}