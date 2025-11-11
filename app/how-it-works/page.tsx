import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Upload, CreditCard, Mail, Sparkles } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      
      <MaxWidthWrapper className="mt-10 flex flex-col items-center justify-center text-center sm:mt-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-display lg:text-display-lg font-bold text-charcoal">
            How <span className="text-christmasRed">Santa Doorbell Magic</span> Works
          </h1>
          <p className="mt-4 font-body text-body lg:text-body-lg text-charcoal/70 max-w-3xl">
            Transform your ordinary doorbell footage into magical Christmas memories in just three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="w-full max-w-6xl space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-christmasRed text-white rounded-full flex items-center justify-center font-display font-bold text-title">
                  1
                </div>
                <h2 className="font-display text-hero lg:text-hero-lg font-bold text-charcoal">Upload Your Video</h2>
              </div>
              <p className="font-body text-body lg:text-body-lg text-charcoal/70 mb-6">
                Simply upload your doorbell footage (MP4, MOV, or AVI format). Our system accepts videos up to 100MB
                and works best with clear, well-lit footage of your doorway.
              </p>
              <ul className="space-y-2 font-body text-body text-charcoal/70">
                <li>• Drag and drop or click to browse</li>
                <li>• Maximum file size: 100MB</li>
                <li>• Recommended duration: 5-30 seconds</li>
                <li>• Best results with clear doorway footage</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <Card className="p-8 bg-cream border-2 border-warmGold/20 shadow-frost max-w-md">
                <Upload className="w-16 h-16 text-christmasRed mx-auto mb-4" />
                <CardTitle className="font-display text-title text-christmasRed text-center mb-2">
                  Easy Upload
                </CardTitle>
                <CardDescription className="font-body text-body text-charcoal/70 text-center">
                  Just drag your video file into the upload area or click to browse your files
                </CardDescription>
              </Card>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-christmasRed text-white rounded-full flex items-center justify-center font-display font-bold text-title">
                  2
                </div>
                <h2 className="font-display text-hero lg:text-hero-lg font-bold text-charcoal">Secure Payment</h2>
              </div>
              <p className="font-body text-body lg:text-body-lg text-charcoal/70 mb-6">
                Pay securely with Stripe for just £12.50. Your payment is processed safely and your video
                processing begins immediately after payment confirmation.
              </p>
              <ul className="space-y-2 font-body text-body text-charcoal/70">
                <li>• Secure payment via Stripe</li>
                <li>• One-time payment of £12.50</li>
                <li>• Instant processing after payment</li>
                <li>• No subscription required</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <Card className="p-8 bg-cream border-2 border-warmGold/20 shadow-frost max-w-md">
                <CreditCard className="w-16 h-16 text-christmasRed mx-auto mb-4" />
                <CardTitle className="font-display text-title text-christmasRed text-center mb-2">
                  Safe & Secure
                </CardTitle>
                <CardDescription className="font-body text-body text-charcoal/70 text-center">
                  Your payment is processed securely through Stripe with industry-standard encryption
                </CardDescription>
              </Card>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-christmasRed text-white rounded-full flex items-center justify-center font-display font-bold text-title">
                  3
                </div>
                <h2 className="font-display text-hero lg:text-hero-lg font-bold text-charcoal">AI Magic Happens</h2>
              </div>
              <p className="font-body text-body lg:text-body-lg text-charcoal/70 mb-6">
                Our advanced AI technology processes your video, seamlessly overlaying Santa Claus delivering
                a present to your doorstep. The entire process takes just a few minutes.
              </p>
              <ul className="space-y-2 font-body text-body text-charcoal/70">
                <li>• Advanced AI video processing</li>
                <li>• Realistic Santa overlay</li>
                <li>• Processing time: 2-5 minutes</li>
                <li>• High-quality 8-second video output</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <Card className="p-8 bg-cream border-2 border-warmGold/20 shadow-frost max-w-md">
                <Sparkles className="w-16 h-16 text-christmasRed mx-auto mb-4" />
                <CardTitle className="font-display text-title text-christmasRed text-center mb-2">
                  AI Processing
                </CardTitle>
                <CardDescription className="font-body text-body text-charcoal/70 text-center">
                  Our AI seamlessly integrates Santa into your footage for a magical result
                </CardDescription>
              </Card>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-christmasRed text-white rounded-full flex items-center justify-center font-display font-bold text-title">
                  4
                </div>
                <h2 className="font-display text-hero lg:text-hero-lg font-bold text-charcoal">Receive Your Magic</h2>
              </div>
              <p className="font-body text-body lg:text-body-lg text-charcoal/70 mb-6">
                Get your personalized Santa video delivered directly to your email within minutes.
                Download and share your magical Christmas memory with family and friends!
              </p>
              <ul className="space-y-2 font-body text-body text-charcoal/70">
                <li>• Email delivery within minutes</li>
                <li>• Secure download link</li>
                <li>• High-quality video file</li>
                <li>• Perfect for sharing on social media</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <Card className="p-8 bg-cream border-2 border-warmGold/20 shadow-frost max-w-md">
                <Mail className="w-16 h-16 text-christmasRed mx-auto mb-4" />
                <CardTitle className="text-xl font-heading text-christmasRed text-center mb-2">
                  Instant Delivery
                </CardTitle>
                <CardDescription className="text-charcoal/70 font-body text-center">
                  Your magical Santa video arrives in your inbox ready to share and enjoy
                </CardDescription>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-christmasRed to-evergreen rounded-2xl text-snowWhite text-center max-w-4xl">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Ready to Create Magic?
          </h2>
          <p className="text-lg font-body mb-6 text-snowWhite/90">
            Join thousands of families who&apos;ve already created unforgettable Christmas memories
          </p>
          <Link
            className={cn(
              buttonVariants({
                size: "lg",
                className: "bg-snowWhite text-christmasRed hover:bg-warmGold hover:text-charcoal shadow-gold text-lg px-8 py-4"
              })
            )}
            href="/upload"
          >
            Upload Your Video Now 🎬
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 w-full max-w-4xl">
          <h2 className="text-3xl font-heading font-bold text-charcoal text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-cream border-2 border-warmGold/20 shadow-frost">
              <h3 className="font-heading font-semibold text-christmasRed mb-2">
                How long does processing take?
              </h3>
              <p className="text-charcoal/70 font-body text-sm">
                Most videos are processed and delivered within 2-5 minutes. During peak times, it may take up to 10 minutes.
              </p>
            </Card>
            
            <Card className="p-6 bg-cream border-2 border-warmGold/20 shadow-frost">
              <h3 className="font-heading font-semibold text-christmasRed mb-2">
                What video formats are supported?
              </h3>
              <p className="text-charcoal/70 font-body text-sm">
                We support MP4, MOV, and AVI formats. The video should be clear and well-lit for best results.
              </p>
            </Card>
            
            <Card className="p-6 bg-cream border-2 border-warmGold/20 shadow-frost">
              <h3 className="font-heading font-semibold text-christmasRed mb-2">
                Is my video secure?
              </h3>
              <p className="text-charcoal/70 font-body text-sm">
                Yes! Your video is encrypted during upload and processing. We delete original files after 30 days.
              </p>
            </Card>
            
            <Card className="p-6 bg-cream border-2 border-warmGold/20 shadow-frost">
              <h3 className="font-heading font-semibold text-christmasRed mb-2">
                Can I get a refund?
              </h3>
              <p className="text-charcoal/70 font-body text-sm">
                We offer a 100% satisfaction guarantee. If you&apos;re not happy with your video, we&apos;ll refund your payment.
              </p>
            </Card>
          </div>
        </div>
      </MaxWidthWrapper>

      <Footer />
    </>
  );
}
