import { Card } from '@/components/ui/card';

export default function TrustSignals() {
  return (
    <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
      <Card className="border-2 border-warmGold/20 bg-cream p-8 text-center shadow-frost">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-christmasRed text-3xl text-white shadow-glow">
          🔒
        </div>
        <h3 className="mb-3 font-heading text-xl font-bold text-christmasRed">
          Secure Upload
        </h3>
        <p className="font-body leading-relaxed text-charcoal/70">
          Your images are encrypted and processed securely with
          enterprise-grade protection
        </p>
      </Card>

      <Card className="border-2 border-warmGold/20 bg-cream p-8 text-center shadow-frost">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warmGold text-3xl text-charcoal shadow-gold">
          ⚡
        </div>
        <h3 className="mb-3 font-heading text-xl font-bold text-christmasRed">
          Lightning Fast
        </h3>
        <p className="font-body leading-relaxed text-charcoal/70">
          Receive your personalized Santa video within minutes of upload
          and payment
        </p>
      </Card>

      <Card className="border-2 border-warmGold/20 bg-cream p-8 text-center shadow-frost">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-evergreen text-3xl text-white shadow-glow">
          🎁
        </div>
        <h3 className="mb-3 font-heading text-xl font-bold text-christmasRed">
          Perfect Gift
        </h3>
        <p className="font-body leading-relaxed text-charcoal/70">
          Create magical Christmas memories that families will treasure
          for years to come
        </p>
      </Card>
    </div>
  );
}