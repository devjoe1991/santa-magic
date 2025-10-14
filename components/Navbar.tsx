"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";

const Navbar = () => {
  // Replace with your auth of choice, e.g. Clerk: const { userId } = auth();
  const isUserSignedIn = false;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "christmas-lights sticky inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "h-14 border-b border-warmGold/20 bg-white/95 shadow-2xl backdrop-blur-2xl sm:h-16"
          : "h-16 border-b border-transparent bg-white/30 backdrop-blur-xl sm:h-20",
      )}
    >
      <MaxWidthWrapper>
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20",
          )}
        >
          <Link
            href="/"
            className="group z-40 flex items-center justify-center gap-2"
          >
            <div className="relative">
              <span
                className={cn(
                  "text-4xl transition-all duration-300",
                  scrolled ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
                )}
              >
                🎅
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-glow font-heading font-bold text-christmasRed transition-all duration-300",
                  scrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl",
                )}
              >
                Seasonal Santa
              </span>
              <span className="-mt-1 font-body text-xs text-charcoal/60">
                Doorbell Magic
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1 sm:gap-4">
            {!isUserSignedIn ? (
              <MobileNav />
            ) : (
              <Link
                className={buttonVariants({
                  size: "sm",
                  className: "mr-3 sm:hidden",
                })}
                href="/dashboard"
              >
                Dashboard
              </Link>
            )}

            <div className="hidden items-center space-x-6 sm:flex">
              {!isUserSignedIn ? (
                <>
                  <Link
                    href="/how-it-works"
                    className="group relative px-3 py-2 font-body font-medium text-charcoal/80 transition-all duration-300 hover:text-christmasRed"
                  >
                    How It Works
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-christmasRed transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/faq"
                    className="group relative px-3 py-2 font-body font-medium text-charcoal/80 transition-all duration-300 hover:text-christmasRed"
                  >
                    FAQ
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-christmasRed transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    className={cn(
                      "btn-vibrant btn-magnetic group relative overflow-hidden whitespace-nowrap rounded-xl font-bold text-white transition-all duration-300",
                      scrolled
                        ? "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-2 lg:text-base"
                        : "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base lg:px-8 lg:py-3 lg:text-lg",
                    )}
                    href="/upload"
                  >
                    <span className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100" />
                    <span className="mr-1 text-sm sm:mr-2 sm:text-lg lg:text-xl">
                      🎅
                    </span>
                    <span className="relative z-10">See Santa Today!</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className={buttonVariants({
                      size: "sm",
                    })}
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>

            {/* User profile mockup below, e.g using Clerk: <UserButton afterSignOutUrl="/" /> */}
            {isUserSignedIn && (
              <div className="h-10 w-10 rounded-full border-2 border-black bg-emerald-600 shadow-lg"></div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
