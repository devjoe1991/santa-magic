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

      {/* Hero Section - Clean Layout */}
      <div className="bg-gradient-to-br from-frostBlue/20 to-cream/50 pb-16 pt-0">
        <div className="mesh-gradient relative">
          <div className="absolute inset-0 bg-gradient-to-br from-christmasRed/5 via-transparent to-warmGold/5" />

          <MaxWidthWrapper className="relative z-10">
            <div className="flex flex-col items-center justify-between py-16 lg:flex-row lg:py-20">
              {/* Left Content - 60% */}
              <div className="flex-1 space-y-8 text-center lg:w-3/5 lg:text-left">
                {/* Christmas Badge */}
                <div className="animate-fade-up border-3 border-gradient-animate glass-frost mx-auto mb-6 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full px-8 py-3 shadow-gold-lg backdrop-blur transition-all hover:scale-105 lg:mx-0">
                  <p className="text-glow text-base font-bold text-christmasRed">
                    🎄 Magical Christmas Videos Available Now!
                  </p>
                </div>

                {/* Massive Staggered Heading */}
                <div className="space-y-2">
                  <h1 className="font-display text-display-sm leading-none tracking-tight md:text-display">
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

                <p className="animate-fade-up-delay-3 mt-8 max-w-2xl font-body text-body-lg font-medium leading-relaxed text-charcoal">
                  Transform your security camera photo into{" "}
                  <span className="text-glow font-bold text-christmasRed">
                    magical Christmas memories!
                  </span>{" "}
                  Upload your photo, pay{" "}
                  <span className="text-glow-gold font-bold text-warmGold">
                    £12.50
                  </span>
                  , and receive a personalized Santa video within minutes.
                </p>

                {/* Enhanced CTA Buttons */}
                <div className="animate-fade-up-delay-3 mt-12 flex w-full flex-col gap-6 sm:w-auto sm:flex-row">
                  <Link
                    className="btn-vibrant btn-magnetic glow-pulse group relative flex min-h-[64px] items-center justify-center overflow-hidden rounded-2xl px-12 py-6 text-button-lg font-bold text-white"
                    href={"/upload"}
                  >
                    <span className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100" />
                    <span className="text-xl">📸</span>
                    <span className="relative z-10 ml-2">
                      Upload Your Photo
                    </span>
                  </Link>
                  <Link
                    className="btn-electric btn-magnetic group relative flex min-h-[64px] items-center justify-center overflow-hidden rounded-2xl px-12 py-6 text-button-lg font-bold text-white"
                    href={"/how-it-works"}
                  >
                    <span className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100" />
                    <span className="text-xl">✨</span>
                    <span className="relative z-10 ml-2">See How It Works</span>
                  </Link>
                </div>

                {/* Floating Trust Signals */}
                <div className="animate-fade-up-delay-3 mt-12 flex items-center justify-center space-x-8 font-body text-sm text-charcoal/70 lg:justify-start">
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
              <div className="relative mt-12 flex-1 lg:mt-0 lg:w-2/5">
                <div className="animate-fade-up-delay-2 relative">
                  {/* Main Video Card */}
                  <div className="relative rounded-3xl border-2 border-warmGold/30 bg-cream/80 p-4 shadow-frost backdrop-blur">
                    <video
                      src="/VIDEO-2024-12-12-15-26-57.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full max-w-full rounded-2xl shadow-2xl ring-2 ring-christmasRed/20"
                      style={{ height: "auto" }}
                    >
                      Your browser does not support the video tag.
                    </video>

                    {/* Video Label with Glow */}
                    <div className="absolute bottom-6 left-6 rounded-full bg-christmasRed/90 px-4 py-2 font-body text-sm font-semibold text-white shadow-glow">
                      🎬 Santa Doorbell Magic Demo
                    </div>

                    {/* Floating Stats */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-warmGold px-4 py-2 text-xs font-bold text-charcoal shadow-gold">
                      1000+ Happy Families
                    </div>
                  </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
                  <div className="flex h-10 w-6 justify-center rounded-full border-2 border-christmasRed/50">
                    <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-christmasRed"></div>
                  </div>
                  <p className="mt-2 font-body text-xs text-christmasRed/70">
                    Scroll
                  </p>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-warmGold/10 py-20">
        <SubtleSnow density="light" />
        <MaxWidthWrapper>
          <div>
            <div className="mb-12 text-center">
              <h2 className="mb-6 font-heading text-title-sm font-bold text-charcoal md:text-title">
                Create Magic in 3 Simple Steps
              </h2>
              <p className="mx-auto max-w-3xl font-body text-body-lg text-charcoal/70">
                Transform your security camera photo into a magical Santa video in
                just minutes! Works with doorbell, security, and indoor cameras.
              </p>
            </div>

            {/* Enhanced Steps */}
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="h-full rounded-2xl border-2 border-warmGold/20 bg-cream p-8 shadow-frost">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-christmasRed text-2xl text-white shadow-glow">
                    📸
                  </div>
                  <span className="mb-4 inline-block rounded-full bg-christmasRed/10 px-3 py-1 font-body text-sm font-bold text-christmasRed">
                    Step 1
                  </span>
                  <h3 className="mb-3 font-heading text-xl font-bold text-charcoal">
                    Upload Your Photo
                  </h3>
                  <p className="font-body text-charcoal/70">
                    Upload a photo from any security camera and
                    our AI analyses the perfect scene
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="h-full rounded-2xl border-2 border-warmGold/20 bg-cream p-8 shadow-frost">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warmGold text-2xl text-charcoal shadow-gold">
                    💳
                  </div>
                  <span className="mb-4 inline-block rounded-full bg-warmGold/10 px-3 py-1 font-body text-sm font-bold text-warmGold">
                    Step 2
                  </span>
                  <h3 className="mb-3 font-heading text-xl font-bold text-charcoal">
                    Pay £12.50 & Relax
                  </h3>
                  <p className="font-body text-charcoal/70">
                    Secure payment via Stripe, then our advanced AI works its
                    Christmas magic in the background
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="h-full rounded-2xl border-2 border-warmGold/20 bg-cream p-8 shadow-frost">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-evergreen text-2xl text-white shadow-glow">
                    🎅
                  </div>
                  <span className="mb-4 inline-block rounded-full bg-evergreen/10 px-3 py-1 font-body text-sm font-bold text-evergreen">
                    Step 3
                  </span>
                  <h3 className="mb-3 font-heading text-xl font-bold text-charcoal">
                    Receive Your Magic Video
                  </h3>
                  <p className="font-body text-charcoal/70">
                    Get your personalized Santa video delivered to your email
                    within minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Features Section */}
      <div className="bg-cream py-32">
        <MaxWidthWrapper>
          <div className=" text-center">
            <h2 className="mb-6 font-heading text-title-sm font-bold text-charcoal md:text-title">
              Why Choose Santa Doorbell Magic?
            </h2>
            <p className="mx-auto mb-16 max-w-3xl font-body text-body-lg text-charcoal/70">
              Experience the magic of Christmas with our cutting-edge AI
              technology
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="flex flex-col items-center justify-center gap-4 border-2 border-warmGold/20 bg-cream p-8 shadow-frost">
                <div className="mb-4 text-5xl">🎬</div>
                <CardTitle className="mb-2 font-heading text-xl text-christmasRed">
                  AI-Powered Magic
                </CardTitle>
                <CardDescription className="text-center font-body text-charcoal/70">
                  Advanced AI seamlessly overlays Santa into your footage with
                  incredible realism
                </CardDescription>
              </Card>

              <Card className="flex flex-col items-center justify-center gap-4 border-2 border-warmGold/20 bg-cream p-8 shadow-frost">
                <div className="mb-4 text-5xl">⚡</div>
                <CardTitle className="mb-2 font-heading text-xl text-christmasRed">
                  Lightning Fast
                </CardTitle>
                <CardDescription className="text-center font-body text-charcoal/70">
                  Receive your personalized video within minutes of upload and
                  payment
                </CardDescription>
              </Card>

              <Card className="flex flex-col items-center justify-center gap-4 border-2 border-warmGold/20 bg-cream p-8 shadow-frost">
                <div className="mb-4 text-5xl">🎁</div>
                <CardTitle className="mb-2 font-heading text-xl text-christmasRed">
                  Perfect Gifts
                </CardTitle>
                <CardDescription className="text-center font-body text-charcoal/70">
                  Create unforgettable Christmas memories that families will
                  treasure forever
                </CardDescription>
              </Card>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Testimonials Section */}
      <div className="bg-evergreen/5 py-20">
        <SubtleSnow density="medium" />
        <MaxWidthWrapper>
          <div>
            <div className="mb-16 text-center">
              <h2 className="mb-6 font-heading text-title-sm font-bold text-charcoal md:text-title">
                What Families Are Saying
              </h2>
              <p className="mx-auto max-w-3xl font-body text-body-lg text-charcoal/70">
                Join thousands of families who&apos;ve created magical Christmas
                memories
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="border-2 border-warmGold/20 bg-cream p-8 shadow-frost">
                <div className="mb-6 flex items-center">
                  <div className="text-2xl text-warmGold">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="mb-6 font-body text-lg leading-relaxed text-charcoal/80">
                  &quot;Absolutely magical! My kids were amazed when they saw
                  Santa at our door. The video quality is incredible and it
                  arrived within 10 minutes!&quot;
                </p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-christmasRed font-bold text-white">
                    S
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-christmasRed">
                      Sarah M.
                    </div>
                    <div className="font-body text-sm text-charcoal/60">
                      Mother of 3, London
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-2 border-warmGold/20 bg-cream p-8 shadow-frost">
                <div className="mb-6 flex items-center">
                  <div className="text-2xl text-warmGold">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="mb-6 font-body text-lg leading-relaxed text-charcoal/80">
                  &quot;Perfect Christmas gift! The whole process was so easy
                  and the result exceeded our expectations. Will definitely use
                  again next year!&quot;
                </p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-evergreen font-bold text-white">
                    J
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-christmasRed">
                      James L.
                    </div>
                    <div className="font-body text-sm text-charcoal/60">
                      Father, Manchester
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-2 border-warmGold/20 bg-cream p-8 shadow-frost">
                <div className="mb-6 flex items-center">
                  <div className="text-2xl text-warmGold">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="mb-6 font-body text-lg leading-relaxed text-charcoal/80">
                  &quot;The AI technology is incredible - you can&apos;t tell
                  it&apos;s not real! My family shared this video everywhere.
                  Worth every penny!&quot;
                </p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-warmGold font-bold text-charcoal">
                    E
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-christmasRed">
                      Emma R.
                    </div>
                    <div className="font-body text-sm text-charcoal/60">
                      Teacher, Birmingham
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Final CTA */}
            <div className="mt-16 text-center">
              <Link
                className="btn-vibrant btn-magnetic glow-pulse group relative inline-flex min-h-[64px] items-center justify-center overflow-hidden rounded-2xl px-16 py-6 text-button-lg font-bold text-white"
                href={"/upload"}
              >
                <span className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100" />
                <span className="mr-3 text-xl">🎅</span>
                <span className="relative z-10">
                  Create Your Santa Magic Today
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
