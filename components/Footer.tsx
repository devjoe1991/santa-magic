import Link from "next/link";
import { SubtleSnow } from "./animated-snow";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-evergreen via-christmasRed to-evergreen"></div>

      {/* Christmas Tree Silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <div className="absolute bottom-0 left-1/4 -translate-x-1/2 transform">
          <div className="border-b-16 h-0 w-0 border-l-8 border-r-8 border-transparent border-b-snowWhite"></div>
          <div className="border-l-6 border-r-6 border-b-12 ml-2 h-0 w-0 border-transparent border-b-snowWhite"></div>
          <div className="ml-4 h-0 w-0 border-b-8 border-l-4 border-r-4 border-transparent border-b-snowWhite"></div>
        </div>
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 transform">
          <div className="border-l-10 border-r-10 border-b-20 h-0 w-0 border-transparent border-b-snowWhite"></div>
          <div className="border-b-16 ml-2 h-0 w-0 border-l-8 border-r-8 border-transparent border-b-snowWhite"></div>
          <div className="border-l-6 border-r-6 border-b-12 ml-4 h-0 w-0 border-transparent border-b-snowWhite"></div>
        </div>
        <div className="right-1/6 absolute bottom-0">
          <div className="border-l-6 border-r-6 border-b-12 h-0 w-0 border-transparent border-b-snowWhite"></div>
          <div className="ml-2 h-0 w-0 border-b-8 border-l-4 border-r-4 border-transparent border-b-snowWhite"></div>
        </div>
      </div>

      {/* Snow Accumulation Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-snowWhite/30 to-transparent"></div>

      {/* Subtle Snow Animation */}
      <SubtleSnow density="light" />

      {/* Content with Modern Glass Effect */}
      <div className="relative z-10 mx-auto w-full max-w-screen-xl p-6 text-snowWhite md:py-16">
        <div className="glass-modern rounded-3xl p-8 md:p-12">
          {/* Main Footer Content */}
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="group">
                <div className="mb-6 flex items-center gap-3">
                  <div className="text-4xl">🎅</div>
                  <div>
                    <span className="text-glow block font-display text-hero font-bold text-snowWhite">
                      Seasonal Santa
                    </span>
                    <span className="font-body text-small text-snowWhite/70">
                      Doorbell Magic
                    </span>
                  </div>
                </div>
              </Link>
              <p className="mb-6 font-body text-body leading-relaxed text-snowWhite/80">
                Bring the magic of Christmas to your doorstep with personalised
                Santa videos powered by cutting-edge AI technology. It&apos;s
                absolutely brilliant!
              </p>

              {/* Trust Badges */}
              <div className="flex space-x-4">
                <div className="rounded-full border border-snowWhite/20 bg-snowWhite/10 px-3 py-2 backdrop-blur">
                  <span className="font-body text-small text-snowWhite/90">
                    🔒 Secure Payments
                  </span>
                </div>
                <div className="rounded-full border border-snowWhite/20 bg-snowWhite/10 px-3 py-2 backdrop-blur">
                  <span className="font-body text-small text-snowWhite/90">
                    ⚡ Fast Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-glow mb-6 font-display text-title font-bold text-snowWhite">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/how-it-works"
                    className="inline-block font-body text-body text-snowWhite/80 transition-all duration-300 hover:translate-x-1 hover:text-warmGold"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="inline-block font-body text-body text-snowWhite/80 transition-all duration-300 hover:translate-x-1 hover:text-warmGold"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/upload"
                    className="inline-block font-body text-body text-snowWhite/80 transition-all duration-300 hover:translate-x-1 hover:text-warmGold"
                  >
                    Upload Video
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service Info */}
            <div>
              <h3 className="text-glow mb-6 font-display text-title font-bold text-snowWhite">
                Service Info
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <span className="text-warmGold">🇬🇧</span>
                  <span className="font-body text-snowWhite/80">
                    UK Based Service
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-warmGold">💷</span>
                  <span className="font-body font-bold text-snowWhite/80">
                    £12.50 per video
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-warmGold">⚡</span>
                  <span className="font-body text-snowWhite/80">
                    Lightning Fast Delivery
                  </span>
                </li>
              </ul>

              {/* CTA in Footer */}
              <div className="mt-6">
                <Link
                  href="/upload"
                  className="group inline-flex items-center whitespace-nowrap rounded-xl bg-warmGold px-4 py-3 font-display font-bold text-charcoal shadow-gold transition-all duration-300 hover:bg-warmGold/90 sm:px-6 lg:px-8"
                >
                  <span className="mr-2 text-body-sm sm:text-body">🎅</span>
                  <span className="text-body-sm sm:text-body">See Santa Today!</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Divider with Christmas Pattern */}
          <div className="relative my-8">
            <hr className="border-snowWhite/20" />
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform bg-christmasRed px-4">
              <span className="text-2xl text-snowWhite">❄️ 🎄 ❄️</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <span className="mb-4 font-body text-body-sm text-snowWhite/80 sm:mb-0">
              © {new Date().getFullYear()} Seasonal Santa. All Rights Reserved.
            </span>
            <div className="flex items-center space-x-6">
              <span className="font-body text-body-sm text-snowWhite/60">
                🎄 Made with Christmas Magic
              </span>
              <div className="flex space-x-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-christmasRed"></div>
                <div
                  className="h-2 w-2 animate-pulse rounded-full bg-warmGold"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="h-2 w-2 animate-pulse rounded-full bg-evergreen"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
