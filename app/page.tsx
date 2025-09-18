"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AnimatedSnow, { SubtleSnow } from "@/components/animated-snow";
import { HeroDiagonalSection, FeatureDiagonalSection, TestimonialDiagonalSection } from "@/components/diagonal-section";

export default function Home() {
  return (
    <div>
      <Navbar />
      <AnimatedSnow count={30} />

      {/* Hero Section - Asymmetric Split Screen */}
      <HeroDiagonalSection>
        <div className="relative mesh-gradient">
          <div className="absolute inset-0 bg-gradient-to-br from-christmasRed/5 via-transparent to-warmGold/5" />

          <MaxWidthWrapper className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between py-16 lg:py-20">

              {/* Left Content - 60% */}
              <div className="flex-1 lg:w-3/5 text-center lg:text-left space-y-8">
                {/* Christmas Badge */}
                <div className="animate-fade-up mx-auto lg:mx-0 mb-6 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border-3 border-gradient-animate glass-frost px-8 py-3 shadow-gold-lg backdrop-blur transition-all hover:scale-105">
                  <p className="text-base font-bold text-christmasRed text-glow">
                    🎄 Magical Christmas Videos Available Now!
                  </p>
                </div>

                {/* Massive Staggered Heading */}
                <div className="space-y-2">
                  <h1 className="text-display-sm md:text-display font-display tracking-tight leading-none">
                    <span className="animate-fade-up text-gradient pulse-glow block">BRING</span>
                    <span className="animate-fade-up-delay-1 text-gradient block">SANTA</span>
                    <span className="animate-fade-up-delay-2 text-hero-glow block">TO YOUR</span>
                    <span className="animate-fade-up-delay-3 text-christmasRed text-glow block">
                      DOORSTEP
                    </span>
                  </h1>
                </div>

                <p className="animate-fade-up-delay-3 mt-8 max-w-2xl text-body-lg text-charcoal font-body font-medium leading-relaxed">
                  Transform your doorbell footage into <span className="text-christmasRed font-bold text-glow">magical Christmas memories!</span> Upload your video,
                  pay <span className="text-warmGold font-bold text-glow-gold">£12.50</span>, and receive a personalized Santa video within minutes.
                </p>

                {/* Enhanced CTA Buttons */}
                <div className="animate-fade-up-delay-3 mt-12 flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                  <Link
                    className="btn-vibrant btn-magnetic text-white text-button-lg font-bold px-12 py-6 rounded-2xl min-h-[64px] flex items-center justify-center glow-pulse group relative overflow-hidden"
                    href={"/upload"}
                  >
                    <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                    <span className="text-xl">🎬</span>
                    <span className="ml-2 relative z-10">Upload Your Video</span>
                  </Link>
                  <Link
                    className="btn-electric btn-magnetic text-white text-button-lg font-bold px-12 py-6 rounded-2xl min-h-[64px] flex items-center justify-center group relative overflow-hidden"
                    href={"/how-it-works"}
                  >
                    <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                    <span className="text-xl">✨</span>
                    <span className="ml-2 relative z-10">See How It Works</span>
                  </Link>
                </div>

                {/* Floating Trust Signals */}
                <div className="animate-fade-up-delay-3 flex items-center justify-center lg:justify-start space-x-8 mt-12 text-sm text-charcoal/70 font-body">
                  <div className="flex items-center space-x-2">
                    <span className="text-christmasRed">⚡</span>
                    <span>2 min delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-warmGold">🔒</span>
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-evergreen">🎄</span>
                    <span>UK based</span>
                  </div>
                </div>
              </div>

              {/* Right Visual Content - 40% */}
              <div className="flex-1 lg:w-2/5 mt-12 lg:mt-0 relative">
                <div className="animate-fade-up-delay-2 relative">
                  {/* Main Video Card */}
                  <div className="relative bg-cream/80 backdrop-blur p-4 rounded-3xl shadow-frost border-2 border-warmGold/30">
                    <video
                      src="/VIDEO-2024-12-12-15-26-57.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="rounded-2xl w-full max-w-full shadow-2xl ring-2 ring-christmasRed/20"
                      style={{ height: 'auto' }}
                    >
                      Your browser does not support the video tag.
                    </video>

                    {/* Video Label with Glow */}
                    <div className="absolute bottom-6 left-6 bg-christmasRed/90 text-white px-4 py-2 rounded-full text-sm font-body font-semibold shadow-glow">
                      🎬 Santa Doorbell Magic Demo
                    </div>

                    {/* Floating Stats */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-warmGold text-charcoal px-4 py-2 rounded-full text-xs font-bold shadow-gold">
                      1000+ Happy Families
                    </div>
                  </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="w-6 h-10 border-2 border-christmasRed/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-christmasRed rounded-full mt-2 animate-pulse"></div>
                  </div>
                  <p className="text-xs text-christmasRed/70 mt-2 font-body">Scroll</p>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </HeroDiagonalSection>

      {/* How It Works Section */}
      <FeatureDiagonalSection>
        <SubtleSnow density="light" />
        <MaxWidthWrapper>
          <div className=" py-20">
            <div className="mb-12 text-center">
              <h2 className="text-title-sm md:text-title font-heading font-bold text-charcoal mb-6">
                Create Magic in 3 Simple Steps
              </h2>
              <p className="text-body-lg text-charcoal/70 font-body max-w-3xl mx-auto">
                Transform your doorbell footage into a magical Santa video in just minutes!
              </p>
            </div>

            {/* Enhanced Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="card-tilt text-center group">
                <div className="bg-cream border-2 border-warmGold/20 shadow-frost rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-gold-lg">
                  <div className="w-16 h-16 bg-christmasRed rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl shadow-glow group-hover:scale-110 transition-transform">
                    🎬
                  </div>
                  <span className="inline-block bg-christmasRed/10 text-christmasRed px-3 py-1 rounded-full text-sm font-bold font-body mb-4">
                    Step 1
                  </span>
                  <h3 className="text-xl font-heading font-bold text-charcoal mb-3">
                    Upload Your Video
                  </h3>
                  <p className="text-charcoal/70 font-body">
                    Upload your doorbell footage (MP4/MOV, max 30 seconds) and our AI analyzes the perfect scene
                  </p>
                </div>
              </div>

              <div className="card-tilt text-center group">
                <div className="bg-cream border-2 border-warmGold/20 shadow-frost rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-gold-lg">
                  <div className="w-16 h-16 bg-warmGold rounded-full flex items-center justify-center mx-auto mb-6 text-charcoal text-2xl shadow-gold group-hover:scale-110 transition-transform">
                    💳
                  </div>
                  <span className="inline-block bg-warmGold/10 text-warmGold px-3 py-1 rounded-full text-sm font-bold font-body mb-4">
                    Step 2
                  </span>
                  <h3 className="text-xl font-heading font-bold text-charcoal mb-3">
                    Pay £12.50 & Relax
                  </h3>
                  <p className="text-charcoal/70 font-body">
                    Secure payment via Stripe, then our advanced AI works its Christmas magic in the background
                  </p>
                </div>
              </div>

              <div className="card-tilt text-center group">
                <div className="bg-cream border-2 border-warmGold/20 shadow-frost rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-gold-lg">
                  <div className="w-16 h-16 bg-evergreen rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl shadow-glow group-hover:scale-110 transition-transform">
                    🎅
                  </div>
                  <span className="inline-block bg-evergreen/10 text-evergreen px-3 py-1 rounded-full text-sm font-bold font-body mb-4">
                    Step 3
                  </span>
                  <h3 className="text-xl font-heading font-bold text-charcoal mb-3">
                    Receive Your Magic Video
                  </h3>
                  <p className="text-charcoal/70 font-body">
                    Get your personalized Santa video delivered to your email within minutes
                  </p>
                </div>
              </div>
            </div>

          </div>
        </MaxWidthWrapper>
      </FeatureDiagonalSection>

      {/* Features Section */}
      <div className="bg-cream py-32">
        <MaxWidthWrapper>
          <div className=" text-center">
            <h2 className="text-title-sm md:text-title font-heading font-bold text-charcoal mb-6">
              Why Choose Santa Doorbell Magic?
            </h2>
            <p className="text-body-lg text-charcoal/70 font-body max-w-3xl mx-auto mb-16">
              Experience the magic of Christmas with our cutting-edge AI technology
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-tilt flex flex-col items-center justify-center gap-4 p-8 bg-cream border-2 border-warmGold/20 shadow-frost hover:shadow-gold-lg transition-all duration-300">
                <div className="text-5xl mb-4">🎬</div>
                <CardTitle className="text-christmasRed font-heading text-xl mb-2">AI-Powered Magic</CardTitle>
                <CardDescription className="text-center text-charcoal/70 font-body">
                  Advanced AI seamlessly overlays Santa into your footage with incredible realism
                </CardDescription>
              </Card>

              <Card className="card-tilt flex flex-col items-center justify-center gap-4 p-8 bg-cream border-2 border-warmGold/20 shadow-frost hover:shadow-gold-lg transition-all duration-300">
                <div className="text-5xl mb-4">⚡</div>
                <CardTitle className="text-christmasRed font-heading text-xl mb-2">Lightning Fast</CardTitle>
                <CardDescription className="text-center text-charcoal/70 font-body">
                  Receive your personalized video within minutes of upload and payment
                </CardDescription>
              </Card>

              <Card className="card-tilt flex flex-col items-center justify-center gap-4 p-8 bg-cream border-2 border-warmGold/20 shadow-frost hover:shadow-gold-lg transition-all duration-300">
                <div className="text-5xl mb-4">🎁</div>
                <CardTitle className="text-christmasRed font-heading text-xl mb-2">Perfect Gifts</CardTitle>
                <CardDescription className="text-center text-charcoal/70 font-body">
                  Create unforgettable Christmas memories that families will treasure forever
                </CardDescription>
              </Card>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Testimonials Section */}
      <TestimonialDiagonalSection>
        <SubtleSnow density="medium" />
        <MaxWidthWrapper>
          <div className=" py-20">
            <div className="text-center mb-16">
              <h2 className="text-title-sm md:text-title font-heading font-bold text-charcoal mb-6">
                What Families Are Saying
              </h2>
              <p className="text-body-lg text-charcoal/70 font-body max-w-3xl mx-auto">
                Join thousands of families who&apos;ve created magical Christmas memories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-tilt p-8 bg-cream border-2 border-warmGold/20 shadow-frost hover:shadow-gold-lg transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="text-2xl text-warmGold">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-charcoal/80 font-body mb-6 text-lg leading-relaxed">
                  &quot;Absolutely magical! My kids were amazed when they saw Santa at our door.
                  The video quality is incredible and it arrived within 10 minutes!&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-christmasRed rounded-full flex items-center justify-center text-white font-bold mr-4">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-christmasRed font-heading">Sarah M.</div>
                    <div className="text-sm text-charcoal/60 font-body">Mother of 3, London</div>
                  </div>
                </div>
              </Card>

              <Card className="card-tilt p-8 bg-cream border-2 border-warmGold/20 shadow-frost hover:shadow-gold-lg transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="text-2xl text-warmGold">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-charcoal/80 font-body mb-6 text-lg leading-relaxed">
                  &quot;Perfect Christmas gift! The whole process was so easy and the result
                  exceeded our expectations. Will definitely use again next year!&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-evergreen rounded-full flex items-center justify-center text-white font-bold mr-4">
                    J
                  </div>
                  <div>
                    <div className="font-semibold text-christmasRed font-heading">James L.</div>
                    <div className="text-sm text-charcoal/60 font-body">Father, Manchester</div>
                  </div>
                </div>
              </Card>

              <Card className="card-tilt p-8 bg-cream border-2 border-warmGold/20 shadow-frost hover:shadow-gold-lg transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="text-2xl text-warmGold">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-charcoal/80 font-body mb-6 text-lg leading-relaxed">
                  &quot;The AI technology is incredible - you can&apos;t tell it&apos;s not real!
                  My family shared this video everywhere. Worth every penny!&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-warmGold rounded-full flex items-center justify-center text-charcoal font-bold mr-4">
                    E
                  </div>
                  <div>
                    <div className="font-semibold text-christmasRed font-heading">Emma R.</div>
                    <div className="text-sm text-charcoal/60 font-body">Teacher, Birmingham</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Final CTA */}
            <div className="text-center mt-16">
              <Link
                className="btn-vibrant btn-magnetic text-white text-button-lg font-bold px-16 py-6 rounded-2xl min-h-[64px] inline-flex items-center justify-center glow-pulse group relative overflow-hidden"
                href={"/upload"}
              >
                <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                <span className="text-xl mr-3">🎅</span>
                <span className="relative z-10">Create Your Santa Magic Today</span>
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </TestimonialDiagonalSection>

      <Footer />
    </div>
  );
}
