import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <MaxWidthWrapper className="mt-10 flex flex-col items-center justify-center text-center sm:mt-12">
        {/* Christmas Badge */}
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border-2 border-warmGold bg-cream px-7 py-2 shadow-gold backdrop-blur transition-all hover:border-christmasRed hover:bg-warmGold/10">
          <p className="text-sm font-semibold text-christmasRed">
            🎄 Magical Christmas Videos Available Now!
          </p>
        </div>

        {/* Main Heading */}
        <h1 className="max-w-4xl text-5xl font-heading font-bold md:text-6xl lg:text-7xl">
          <span className="text-christmasRed">Bring Santa</span> to Your{" "}
          <span className="text-evergreen">Doorstep</span> 🎅
        </h1>

        <p className="mt-5 max-w-prose text-lg text-charcoal sm:text-2xl font-body">
          Transform your doorbell footage into magical Christmas memories! Upload your video, 
          pay £12.50, and receive a personalized Santa video within minutes.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            className={cn(
              buttonVariants({
                size: "lg",
                className: "bg-christmasRed hover:bg-[#A71D23] text-white shadow-glow text-lg px-8 py-4",
              }),
            )}
            href={"/upload"}
          >
            Upload Your Video 🎬
          </Link>
          <Link
            className={cn(
              buttonVariants({
                size: "lg",
                variant: "outline",
                className: "border-2 border-evergreen text-evergreen hover:bg-evergreen hover:text-white text-lg px-8 py-4",
              }),
            )}
            href={"/how-it-works"}
          >
            See How It Works ✨
          </Link>
        </div>
      </MaxWidthWrapper>

      {/* Demo Video Section */}
      <div className="relative isolate bg-gradient-to-b from-frostBlue/20 to-snowWhite">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-christmasRed/20 to-warmGold/20 opacity-30 sm:left-[calc(50%-20rem)] sm:w-[72.1875rem] sm:translate-y-8"
            />
          </div>

          <div>
            <div className="mx-auto flex max-w-6xl justify-center px-6 lg:px-8">
              <div className="mt-8 flow-root sm:mt-16">
                <div className="-m-2 w-fit rounded-2xl bg-cream/80 p-4 ring-2 ring-warmGold/30 shadow-frost lg:-m-4 lg:rounded-3xl lg:p-6">
                  <div className="relative">
                    <video
                      src="/VIDEO-2024-12-12-15-26-57.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="rounded-xl bg-snowWhite p-2 shadow-2xl ring-2 ring-christmasRed/20 md:p-8 w-full max-w-4xl"
                      style={{ width: '955px', height: 'auto' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    {/* Video Label */}
                    <div className="absolute bottom-4 left-4 bg-christmasRed/90 text-white px-3 py-1 rounded-full text-sm font-body font-semibold">
                      🎬 Santa Doorbell Magic Demo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative right-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/3 rotate-[30deg] bg-gradient-to-tr from-evergreen/20 to-frostBlue/20 opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem] sm:translate-y-8"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <MaxWidthWrapper>
        <div className="mx-auto mt-20 flex max-w-5xl flex-col gap-20 sm:mt-40 sm:gap-40 ">
          {/* How It Works */}
          <div>
            <div className="mb-6 px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="mt-2 text-4xl font-heading font-bold text-charcoal sm:text-5xl">
                  Create Magic in 3 Simple Steps
                </h2>
                <p className="mt-4 text-lg text-charcoal/70 font-body">
                  Transform your doorbell footage into a magical Santa video in just minutes!
                </p>
              </div>
            </div>
            {/* steps */}

            <ol className="my-2 space-y-4 pt-2 md:flex md:space-x-6 md:space-y-0 md:px-8">
              <li className="md:flex-1">
                <div className="flex flex-col space-y-2 border-l-4 border-christmasRed py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-christmasRed font-body">
                    Step 1
                  </span>
                  <span className="text-xl font-semibold font-heading text-charcoal">
                    Upload Your Video
                  </span>
                  <span className="mt-2 text-charcoal/70 font-body">
                    Upload your doorbell footage (MP4/MOV, max 30 seconds)
                  </span>
                </div>
              </li>
              <li className="md:flex-1">
                <div className="flex flex-col space-y-2 border-l-4 border-christmasRed py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-christmasRed font-body">
                    Step 2
                  </span>
                  <span className="text-xl font-semibold font-heading text-charcoal">
                    Pay <span className="text-christmasRed">£12.50</span> &{" "}
                    <span className="text-evergreen">Relax</span>
                  </span>
                  <span className="mt-2 text-charcoal/70 font-body">
                    Secure payment via Stripe, then our AI works its magic
                  </span>
                </div>
              </li>
              <li className="md:flex-1">
                <div className="flex flex-col space-y-2 border-l-4 border-christmasRed py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-christmasRed font-body">
                    Step 3
                  </span>
                  <span className="text-xl font-semibold font-heading text-charcoal">
                    Receive Your Magic Video
                  </span>
                  <span className="mt-2 text-charcoal/70 font-body">
                    Get your personalized Santa video delivered to your email
                  </span>
                </div>
              </li>
            </ol>
          </div>

          {/* Features */}
          <div>
            <div className="mb-6 px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="mt-2 text-4xl font-heading font-bold text-charcoal sm:text-5xl">
                  Why Choose Santa Doorbell Magic?
                </h2>
                <p className="mt-4 text-lg text-charcoal/70 font-body">
                  Experience the magic of Christmas with our cutting-edge AI technology
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex flex-col gap-6 md:flex-row">
                <Card className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1 bg-cream border-2 border-warmGold/20 shadow-frost">
                  <div className="text-4xl mb-2">🎬</div>
                  <CardTitle className="text-christmasRed font-heading">AI-Powered Magic</CardTitle>
                  <CardDescription className="mb-3 text-center text-charcoal/70 font-body">
                    Advanced AI seamlessly overlays Santa into your footage
                  </CardDescription>
                </Card>
                <Card className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1 bg-cream border-2 border-warmGold/20 shadow-frost">
                  <div className="text-4xl mb-2">⚡</div>
                  <CardTitle className="text-christmasRed font-heading">Lightning Fast</CardTitle>
                  <CardDescription className="mb-3 text-center text-charcoal/70 font-body">
                    Receive your video within minutes of upload
                  </CardDescription>
                </Card>

                <Card className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1 bg-cream border-2 border-warmGold/20 shadow-frost">
                  <div className="text-4xl mb-2">🎁</div>
                  <CardTitle className="text-christmasRed font-heading">Perfect Gifts</CardTitle>
                  <CardDescription className="mb-3 text-center text-charcoal/70 font-body">
                    Create unforgettable Christmas memories to share
                  </CardDescription>
                </Card>
              </div>
            </div>
            <div className="mb-6 px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <p className="mt-4 text-lg text-charcoal/70 font-body">and much more magical features...</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <div className="mb-6 px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="mt-2 text-4xl font-heading font-bold text-charcoal sm:text-5xl">
                  Powered by Advanced Technology
                </h2>
                <p className="mt-4 text-lg text-charcoal/70 font-body">
                  Cutting-edge AI and cloud technology make the magic possible
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex flex-col gap-6 md:flex-row">
                <Card className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1 bg-cream border-2 border-warmGold/20 shadow-frost">
                  <div className="text-4xl mb-2">🤖</div>
                  <CardTitle className="text-christmasRed font-heading">Nano Banana AI</CardTitle>
                  <CardDescription className="mb-3 text-center text-charcoal/70 font-body">
                    Advanced video processing and Santa overlay technology
                  </CardDescription>
                </Card>
                <Card className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1 bg-cream border-2 border-warmGold/20 shadow-frost">
                  <div className="text-4xl mb-2">⚡</div>
                  <CardTitle className="text-christmasRed font-heading">Supabase</CardTitle>
                  <CardDescription className="mb-3 text-center text-charcoal/70 font-body">
                    Secure cloud storage and edge functions for processing
                  </CardDescription>
                </Card>

                <Card className="flex flex-col items-center justify-center gap-2 p-6 md:flex-1 bg-cream border-2 border-warmGold/20 shadow-frost">
                  <div className="text-4xl mb-2">💳</div>
                  <CardTitle className="text-christmasRed font-heading">Stripe</CardTitle>
                  <CardDescription className="mb-3 text-center text-charcoal/70 font-body">
                    Secure payment processing for seamless transactions
                  </CardDescription>
                </Card>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <div className="mb-6 px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="mt-2 text-4xl font-heading font-bold text-charcoal sm:text-5xl">
                  What Families Are Saying
                </h2>
                <p className="mt-4 text-lg text-charcoal/70 font-body">
                  Join thousands of families who&apos;ve created magical Christmas memories
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-cream border-2 border-warmGold/20 shadow-frost">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-2">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-charcoal/80 font-body mb-4">
                  &quot;Absolutely magical! My kids were amazed when they saw Santa at our door. 
                  The video quality is incredible and it arrived within 10 minutes!&quot;
                </p>
                <div className="font-semibold text-christmasRed font-heading">- Sarah M.</div>
              </Card>

              <Card className="p-6 bg-cream border-2 border-warmGold/20 shadow-frost">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-2">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-charcoal/80 font-body mb-4">
                  &quot;Perfect Christmas gift! The whole process was so easy and the result 
                  exceeded our expectations. Will definitely use again next year!&quot;
                </p>
                <div className="font-semibold text-christmasRed font-heading">- James L.</div>
              </Card>

              <Card className="p-6 bg-cream border-2 border-warmGold/20 shadow-frost">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-2">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-charcoal/80 font-body mb-4">
                  &quot;The AI technology is incredible - you can&apos;t tell it&apos;s not real! 
                  My family shared this video everywhere. Worth every penny!&quot;
                </p>
                <div className="font-semibold text-christmasRed font-heading">- Emma R.</div>
              </Card>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      <Footer />
    </>
  );
}
