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
          ? "h-16 bg-white/95 backdrop-blur-xl border-b border-warmGold/20 shadow-frost"
          : "h-20 bg-white/40 backdrop-blur-lg border-b border-transparent"
      )}
    >
      <MaxWidthWrapper>
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          scrolled ? "h-16" : "h-20"
        )}>
          <Link
            href="/"
            className="flex z-40 justify-center items-center gap-2 group"
          >
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Santa Doorbell Magic logo"
                width={50}
                height={50}
                quality={100}
                className={cn(
                  "transition-all duration-300",
                  scrolled ? "w-8 h-8" : "w-10 h-10"
                )}
              />
              {/* Santa Hat Decoration */}
              <div className="absolute -top-1 -right-1 text-xs animate-bounce">🎅</div>
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-heading font-bold text-christmasRed text-glow transition-all duration-300",
                scrolled ? "text-xl" : "text-2xl"
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
                      "btn-vibrant btn-magnetic text-white font-bold rounded-xl transition-all duration-300 group relative overflow-hidden",
                      scrolled
                        ? "px-4 py-2 text-sm"
                        : "px-6 py-3 text-base"
                    )}
                    href="/upload"
                  >
                    <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                    <span className="text-lg mr-2">🎬</span>
                    <span className="relative z-10">Upload Video</span>
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
