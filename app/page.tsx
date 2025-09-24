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
// Removed diagonal sections for cleaner design

export default function Home() {
  return (
    <div>
      <Navbar />
      <AnimatedSnow count={30} />

      {/* Hero Section - Modern Enhanced Layout */}
      <div className="bg-gradient-to-br from-frostBlue/20 to-cream/50 pb-8 pt-4 sm:pb-16 sm:pt-0">
        <div className="mesh-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-christmasRed/5 via-transparent to-warmGold/5" />
          {/* Modern floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-red-200 to-pink-200 rounded-full blur-xl opacity-30 float-modern"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-green-200 to-blue-200 rounded-full blur-xl opacity-20 float-modern" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-lg opacity-25 float-modern" style={{animationDelay: '4s'}}></div>

          <MaxWidthWrapper className="relative z-10">
            <div className="flex flex-col items-center justify-between py-8 sm:py-16 lg:flex-row lg:py-20">
              {/* Left Content - Enhanced Mobile Typography */}
              <div className="flex-1 space-y-6 text-center lg:w-3/5 lg:space-y-8 lg:text-left">
                {/* Christmas Badge - Mobile Optimized */}
                <div className="animate-fade-up border-3 border-gradient-animate glass-frost mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full px-4 py-2 shadow-gold-lg backdrop-blur transition-all hover:scale-105 sm:px-8 sm:py-3 lg:mx-0">
                  <p className="text-glow text-sm font-bold text-christmasRed sm:text-base">
                    🎄 Magical Christmas Videos Available Now!
                  </p>
                </div>

                {/* Responsive Typography */}
                <div className="space-y-1 sm:space-y-2">
                  <h1 className="font-display text-4xl leading-none tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                    <span className="animate-fade-up text-gradient pulse-glow block">
                      BRING
                    </span>
                    <span className="animate-fade-up-delay-1 text-gradient block">
                      SANTA
                    </span>
                    <span className="animate-fade-up-delay-2 text-hero-glow block">
                      TO YOUR
                    </span>
                    <span className="animate-fade-up-delay-3 text-glow block text-christmasRed">
                      DOORSTEP
                    </span>
                  </h1>
                </div>

                <p className="animate-fade-up-delay-3 mt-6 max-w-2xl font-body text-base font-medium leading-relaxed text-charcoal sm:mt-8 sm:text-lg">
                  Transform your doorbell footage into{" "}
                  <span className="text-glow font-bold text-christmasRed">
                    magical Christmas memories!
                  </span>{" "}
                  Simply share your doorbell video, pay{" "}
                  <span className="text-glow-gold font-bold text-warmGold">
                    £12.50
                  </span>
                  , and watch Santa arrive at your doorstep in minutes!
                </p>

                {/* Enhanced CTA Buttons - Desktop Optimized */}
                <div className="animate-fade-up-delay-3 mt-8 flex w-full flex-col gap-4 sm:mt-12 sm:gap-6 sm:w-auto sm:flex-row">
                  <Link
                    className="btn-vibrant btn-magnetic glow-pulse group relative flex min-h-[56px] items-center justify-center overflow-hidden rounded-2xl px-4 py-4 text-sm font-bold text-white sm:min-h-[64px] sm:px-6 sm:py-6 sm:text-base lg:px-8 lg:text-lg"
                    href={"/upload"}
                  >
                    <span className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100" />
                    <span className="text-base sm:text-lg lg:text-xl">🎅</span>
                    <span className="relative z-10 ml-2 whitespace-nowrap">
                      See Santa Today!
                    </span>
                  </Link>
                  <Link
                    className="btn-electric btn-magnetic group relative flex min-h-[56px] items-center justify-center overflow-hidden rounded-2xl px-4 py-4 text-sm font-bold text-white sm:min-h-[64px] sm:px-6 sm:py-6 sm:text-base lg:px-8 lg:text-lg"
                    href={"/how-it-works"}
                  >
                    <span className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100" />
                    <span className="text-base sm:text-lg lg:text-xl">✨</span>
                    <span className="relative z-10 ml-2 whitespace-nowrap">How the Magic Works</span>
                  </Link>
                </div>

                {/* Trust Signals - Mobile Stacked */}
                <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap items-center justify-center gap-4 font-body text-sm text-charcoal/70 sm:mt-12 sm:gap-8 lg:justify-start">
                  <div className="flex items-center space-x-2">
                    <span className="text-christmasRed">⚡</span>
                    <span>Lightning fast delivery</span>
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

              {/* Right Visual Content - Mobile Optimized */}
              <div className="relative mt-8 flex-1 sm:mt-12 lg:mt-0 lg:w-2/5">
                <div className="animate-fade-up-delay-2 relative">
                  {/* Main Video Card - Modern Glass Effect */}
                  <div className="card-modern relative rounded-2xl border-2 border-warmGold/30 bg-cream/80 p-2 shadow-frost backdrop-blur sm:rounded-3xl sm:p-4">
                    <video
                      src="/VIDEO-2024-12-12-15-26-57.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full max-w-full rounded-xl shadow-2xl ring-2 ring-christmasRed/20 sm:rounded-2xl"
                      style={{ height: "auto" }}
                    >
                      Your browser does not support the video tag.
                    </video>

                    {/* Video Label - Mobile Responsive */}
                    <div className="absolute bottom-3 left-3 rounded-full bg-christmasRed/90 px-3 py-1 font-body text-xs font-semibold text-white shadow-glow sm:bottom-6 sm:left-6 sm:px-4 sm:py-2 sm:text-sm">
                      🎬 Santa Doorbell Magic Demo
                    </div>

                    {/* Floating Stats - Mobile Responsive */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 transform rounded-full bg-warmGold px-3 py-1 text-xs font-bold text-charcoal shadow-gold sm:-top-4 sm:px-4 sm:py-2">
                      1000+ Happy Families
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </div>

      {/* How It Works Section - Mobile Optimized */}
      <div className="bg-warmGold/10 py-12 sm:py-20">
        <SubtleSnow density="light" />
        <MaxWidthWrapper>
          <div>
            <div className="mb-8 text-center sm:mb-12">
              <h2 className="mb-4 font-heading text-2xl font-bold text-charcoal sm:mb-6 sm:text-3xl md:text-4xl">
                Create Christmas Magic in 3 Simple Steps
              </h2>
              <p className="mx-auto max-w-3xl font-body text-base text-charcoal/70 sm:text-lg">
                Transform your doorbell footage into a magical Santa visit in
                just minutes! Works with any doorbell, security, or indoor camera.
              </p>
            </div>

            {/* Enhanced Steps - Mobile Responsive */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="card-modern h-full rounded-xl border-2 border-warmGold/20 bg-cream p-6 shadow-frost sm:rounded-2xl sm:p-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-christmasRed text-xl text-white shadow-glow sm:mb-6 sm:h-16 sm:w-16 sm:text-2xl">
                    📸
                  </div>
                  <span className="mb-3 inline-block rounded-full bg-christmasRed/10 px-3 py-1 font-body text-xs font-bold text-christmasRed sm:mb-4 sm:text-sm">
                    Step 1
                  </span>
                  <h3 className="mb-2 font-heading text-lg font-bold text-charcoal sm:mb-3 sm:text-xl">
                    Share Your Doorbell Footage
                  </h3>
                  <p className="font-body text-sm text-charcoal/70 sm:text-base">
                    Simply share your doorbell video and
                    our AI analyses the perfect scene for Santa&apos;s arrival
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="card-modern h-full rounded-xl border-2 border-warmGold/20 bg-cream p-6 shadow-frost sm:rounded-2xl sm:p-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warmGold text-xl text-charcoal shadow-gold sm:mb-6 sm:h-16 sm:w-16 sm:text-2xl">
                    💳
                  </div>
                  <span className="mb-3 inline-block rounded-full bg-warmGold/10 px-3 py-1 font-body text-xs font-bold text-warmGold sm:mb-4 sm:text-sm">
                    Step 2
                  </span>
                  <h3 className="mb-2 font-heading text-lg font-bold text-charcoal sm:mb-3 sm:text-xl">
                    Pay £12.50 & Let the Magic Begin
                  </h3>
                  <p className="font-body text-sm text-charcoal/70 sm:text-base">
                    Secure payment via Stripe, then our advanced AI works its
                    Christmas magic behind the scenes
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="card-modern h-full rounded-xl border-2 border-warmGold/20 bg-cream p-6 shadow-frost sm:rounded-2xl sm:p-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-evergreen text-xl text-white shadow-glow sm:mb-6 sm:h-16 sm:w-16 sm:text-2xl">
                    🎅
                  </div>
                  <span className="mb-3 inline-block rounded-full bg-evergreen/10 px-3 py-1 font-body text-xs font-bold text-evergreen sm:mb-4 sm:text-sm">
                    Step 3
                  </span>
                  <h3 className="mb-2 font-heading text-lg font-bold text-charcoal sm:mb-3 sm:text-xl">
                    Watch Santa Arrive!
                  </h3>
                  <p className="font-body text-sm text-charcoal/70 sm:text-base">
                    Receive your magical Santa video via email
                    and watch the Christmas magic unfold!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Features Section - Enhanced with Trust Signals */}
      <div className="bg-cream py-16 sm:py-32">
        <MaxWidthWrapper>
          <div className="text-center">
            <h2 className="mb-4 font-heading text-2xl font-bold text-charcoal sm:mb-6 sm:text-3xl md:text-4xl">
              Why Choose Santa Doorbell Magic?
            </h2>
            <p className="mx-auto mb-8 max-w-3xl font-body text-base text-charcoal/70 sm:mb-16 sm:text-lg">
              Experience the magic of Christmas with our cutting-edge AI
              technology
            </p>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              <Card className="flex flex-col items-center justify-center gap-3 border-2 border-warmGold/20 bg-cream p-6 shadow-frost sm:gap-4 sm:p-8">
                <div className="mb-2 text-4xl sm:mb-4 sm:text-5xl">🎬</div>
                <CardTitle className="mb-2 font-heading text-lg text-christmasRed sm:text-xl">
                  AI-Powered Magic
                </CardTitle>
                <CardDescription className="text-center font-body text-sm text-charcoal/70 sm:text-base">
                  Advanced AI seamlessly overlays Santa into your footage with
                  incredible realism
                </CardDescription>
              </Card>

              <Card className="flex flex-col items-center justify-center gap-3 border-2 border-warmGold/20 bg-cream p-6 shadow-frost sm:gap-4 sm:p-8">
                <div className="mb-2 text-4xl sm:mb-4 sm:text-5xl">⚡</div>
                <CardTitle className="mb-2 font-heading text-lg text-christmasRed sm:text-xl">
                  Lightning Fast
                </CardTitle>
                <CardDescription className="text-center font-body text-sm text-charcoal/70 sm:text-base">
                  Receive your personalized video within minutes of upload and
                  payment
                </CardDescription>
              </Card>

              <Card className="flex flex-col items-center justify-center gap-3 border-2 border-warmGold/20 bg-cream p-6 shadow-frost sm:gap-4 sm:p-8">
                <div className="mb-2 text-4xl sm:mb-4 sm:text-5xl">🎁</div>
                <CardTitle className="mb-2 font-heading text-lg text-christmasRed sm:text-xl">
                  Perfect Gifts
                </CardTitle>
                <CardDescription className="text-center font-body text-sm text-charcoal/70 sm:text-base">
                  Create unforgettable Christmas memories that families will
                  treasure forever
                </CardDescription>
              </Card>
            </div>

            {/* Trust Signals Section */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4 sm:gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-2xl sm:text-3xl">🔒</div>
                <p className="font-body text-xs font-semibold text-charcoal sm:text-sm">Secure Payment</p>
                <p className="font-body text-xs text-charcoal/60 sm:text-sm">Stripe Protected</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-2xl sm:text-3xl">🇬🇧</div>
                <p className="font-body text-xs font-semibold text-charcoal sm:text-sm">UK Based</p>
                <p className="font-body text-xs text-charcoal/60 sm:text-sm">UK Based</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-2xl sm:text-3xl">⚡</div>
                <p className="font-body text-xs font-semibold text-charcoal sm:text-sm">Lightning Fast</p>
                <p className="font-body text-xs text-charcoal/60 sm:text-sm">Quick Delivery</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-2xl sm:text-3xl">⭐</div>
                <p className="font-body text-xs font-semibold text-charcoal sm:text-sm">5-Star Rated</p>
                <p className="font-body text-xs text-charcoal/60 sm:text-sm">1000+ Families</p>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Testimonials Section - Mobile Optimized */}
      <div className="bg-evergreen/5 py-12 sm:py-20">
        <SubtleSnow density="medium" />
        <MaxWidthWrapper>
          <div>
            <div className="mb-8 text-center sm:mb-16">
              <h2 className="mb-4 font-heading text-2xl font-bold text-charcoal sm:mb-6 sm:text-3xl md:text-4xl">
                What Families Are Saying
              </h2>
              <p className="mx-auto max-w-3xl font-body text-base text-charcoal/70 sm:text-lg">
                Join thousands of families who&apos;ve created magical Christmas
                memories
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              <Card className="border-2 border-warmGold/20 bg-cream p-6 shadow-frost sm:p-8">
                <div className="mb-4 flex items-center sm:mb-6">
                  <div className="text-xl text-warmGold sm:text-2xl">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="mb-4 font-body text-sm leading-relaxed text-charcoal/80 sm:mb-6 sm:text-base">
                  &quot;Absolutely magical! My kids were amazed when they saw
                  Santa at our door. The video quality is incredible and it
                  arrived within 10 minutes!&quot;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-christmasRed font-bold text-white sm:mr-4 sm:h-12 sm:w-12">
                    S
                  </div>
                  <div>
                    <div className="font-heading text-sm font-semibold text-christmasRed sm:text-base">
                      Sarah M.
                    </div>
                    <div className="font-body text-xs text-charcoal/60 sm:text-sm">
                      Mother of 3, London
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-2 border-warmGold/20 bg-cream p-6 shadow-frost sm:p-8">
                <div className="mb-4 flex items-center sm:mb-6">
                  <div className="text-xl text-warmGold sm:text-2xl">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="mb-4 font-body text-sm leading-relaxed text-charcoal/80 sm:mb-6 sm:text-base">
                  &quot;Perfect Christmas gift! The whole process was so easy
                  and the result exceeded our expectations. Will definitely use
                  again next year!&quot;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-evergreen font-bold text-white sm:mr-4 sm:h-12 sm:w-12">
                    J
                  </div>
                  <div>
                    <div className="font-heading text-sm font-semibold text-christmasRed sm:text-base">
                      James L.
                    </div>
                    <div className="font-body text-xs text-charcoal/60 sm:text-sm">
                      Father, Manchester
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-2 border-warmGold/20 bg-cream p-6 shadow-frost sm:p-8">
                <div className="mb-4 flex items-center sm:mb-6">
                  <div className="text-xl text-warmGold sm:text-2xl">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="mb-4 font-body text-sm leading-relaxed text-charcoal/80 sm:mb-6 sm:text-base">
                  &quot;The AI technology is incredible - you can&apos;t tell
                  it&apos;s not real! My family shared this video everywhere.
                  Worth every penny!&quot;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-warmGold font-bold text-charcoal sm:mr-4 sm:h-12 sm:w-12">
                    E
                  </div>
                  <div>
                    <div className="font-heading text-sm font-semibold text-christmasRed sm:text-base">
                      Emma R.
                    </div>
                    <div className="font-body text-xs text-charcoal/60 sm:text-sm">
                      Teacher, Birmingham
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Final CTA - Desktop Optimized */}
            <div className="mt-12 text-center sm:mt-16">
              <Link
                className="btn-vibrant btn-magnetic glow-pulse group relative inline-flex min-h-[56px] items-center justify-center overflow-hidden rounded-2xl px-4 py-4 text-sm font-bold text-white sm:min-h-[64px] sm:px-8 sm:py-6 sm:text-base lg:px-12 lg:text-lg"
                href={"/upload"}
              >
                <span className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100" />
                <span className="mr-2 text-base sm:mr-3 sm:text-lg lg:text-xl">🎅</span>
                <span className="relative z-10 whitespace-nowrap">
                  See Santa Today - It&apos;s Brilliant!
                </span>
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      <Footer />
    </div>
  );
}
