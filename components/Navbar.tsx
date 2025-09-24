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
        "sticky inset-x-0 top-0 z-50 transition-all duration-300 christmas-lights",
        scrolled
          ? "h-14 bg-white/95 backdrop-blur-2xl border-b border-warmGold/20 shadow-2xl sm:h-16"
          : "h-16 bg-white/30 backdrop-blur-xl border-b border-transparent sm:h-20"
      )}
    >
      <MaxWidthWrapper>
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        )}>
          <Link
            href="/"
            className="flex z-40 justify-center items-center gap-2 group"
          >
            <div className="relative">
              <span
                className={cn(
                  "text-4xl transition-all duration-300",
                  scrolled ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
                )}
              >
                🎅
              </span>
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-heading font-bold text-christmasRed text-glow transition-all duration-300",
                scrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
              )}>
                Seasonal Santa
              </span>
              <span className="text-xs text-charcoal/60 font-body -mt-1">Doorbell Magic</span>
            </div>
          </Link>
          <div className="flex gap-1 sm:gap-4 items-center">
            {!isUserSignedIn ? (
              <MobileNav />
            ) : (
              <Link
                className={buttonVariants({
                  size: "sm",
                  className: "sm:hidden mr-3",
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
                    className="relative group px-3 py-2 text-charcoal/80 hover:text-christmasRed font-body font-medium transition-all duration-300"
                  >
                    How It Works
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-christmasRed transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/faq"
                    className="relative group px-3 py-2 text-charcoal/80 hover:text-christmasRed font-body font-medium transition-all duration-300"
                  >
                    FAQ
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-christmasRed transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    className={cn(
                      "btn-vibrant btn-magnetic text-white font-bold rounded-xl transition-all duration-300 group relative overflow-hidden whitespace-nowrap",
                      scrolled
                        ? "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-2 lg:text-base"
                        : "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base lg:px-8 lg:py-3 lg:text-lg"
                    )}
                    href="/upload"
                  >
                    <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                    <span className="text-sm mr-1 sm:text-lg sm:mr-2 lg:text-xl">🎅</span>
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
              <div className="bg-emerald-600 border-2 border-black shadow-lg rounded-full w-10 h-10"></div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
