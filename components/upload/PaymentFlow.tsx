'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PaymentFlowProps {
  onSubmit: (email: string) => void;
  isProcessing: boolean;
  onBack: () => void;
}

export default function PaymentFlow({ onSubmit, isProcessing, onBack }: PaymentFlowProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubmit(email);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6 rounded-lg border-2 border-warmGold/30 bg-warmGold/10 p-8">
        <h3 className="mb-4 font-heading text-xl font-semibold text-christmasRed">
          🎄 Complete Your Order
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label
              htmlFor="email"
              className="block font-heading text-lg font-semibold text-charcoal"
            >
              Email Address
            </label>
            <div className="group relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for Santa updates! 🎅"
                className="min-h-[70px] w-full rounded-2xl border-4 border-christmasRed bg-white px-6 font-body text-xl font-medium text-charcoal transition-all duration-200 placeholder:font-medium placeholder:text-charcoal/40 focus:scale-[1.02] focus:border-electricGreen focus:shadow-[0_0_40px_rgba(0,255,136,0.3)] disabled:opacity-50"
                disabled={isProcessing}
                required
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl">
                ✉️
              </div>
              <div className="absolute inset-0 -z-10 rounded-2xl bg-electricGreen/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
            </div>
            <p className="font-body text-sm text-charcoal/60">
              We&apos;ll send your magical Santa video to this email address
            </p>
          </div>

          <div className="rounded-lg border border-coolGray/20 bg-snowWhite p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-charcoal">
                Santa Video Magic
              </span>
              <span className="font-heading text-2xl font-bold text-christmasRed">
                £12.50
              </span>
            </div>
            <p className="font-body text-charcoal/70">
              8-second personalized Santa video from your doorbell scene
            </p>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              type="button"
              onClick={onBack}
              disabled={isProcessing}
              variant="outline"
              size="chunky"
              className="border-4 border-coolGray/30 text-charcoal hover:scale-105 hover:bg-coolGray/10 sm:flex-1"
            >
              ← Back
            </Button>

            <Button
              type="submit"
              disabled={!email || isProcessing}
              variant="premium"
              size="chunky"
              className="disabled:cursor-not-allowed disabled:opacity-50 sm:flex-2"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-charcoal"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "💳 Pay Securely with Stripe →"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}