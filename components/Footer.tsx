import Link from "next/link";
import { SubtleSnow } from "./animated-snow";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-evergreen via-christmasRed to-evergreen"></div>

      {/* Christmas Tree Silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-snowWhite"></div>
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-snowWhite ml-2"></div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-snowWhite ml-4"></div>
        </div>
        <div className="absolute bottom-0 right-1/4 transform translate-x-1/2">
          <div className="w-0 h-0 border-l-10 border-r-10 border-b-20 border-transparent border-b-snowWhite"></div>
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-snowWhite ml-2"></div>
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-snowWhite ml-4"></div>
        </div>
        <div className="absolute bottom-0 right-1/6">
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-snowWhite"></div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-snowWhite ml-2"></div>
        </div>
      </div>

      {/* Snow Accumulation Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-snowWhite/30 to-transparent"></div>

      {/* Subtle Snow Animation */}
      <SubtleSnow density="light" />

      {/* Content with Modern Glass Effect */}
      <div className="relative z-10 mx-auto w-full max-w-screen-xl p-6 md:py-16 text-snowWhite">
        <div className="glass-modern rounded-3xl p-8 md:p-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="group">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🎅</div>
                <div>
                  <span className="text-3xl font-heading font-bold text-snowWhite text-glow block">
                    Seasonal Santa
                  </span>
                  <span className="text-sm text-snowWhite/70 font-body">Doorbell Magic</span>
                </div>
              </div>
            </Link>
            <p className="text-snowWhite/80 font-body text-lg leading-relaxed mb-6">
              Bring the magic of Christmas to your doorstep with personalised Santa videos powered by cutting-edge AI technology. It&apos;s absolutely brilliant!
            </p>

            {/* Trust Badges */}
            <div className="flex space-x-4">
              <div className="bg-snowWhite/10 backdrop-blur px-3 py-2 rounded-full border border-snowWhite/20">
                <span className="text-xs font-body text-snowWhite/90">🔒 Secure Payments</span>
              </div>
              <div className="bg-snowWhite/10 backdrop-blur px-3 py-2 rounded-full border border-snowWhite/20">
                <span className="text-xs font-body text-snowWhite/90">⚡ Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-heading font-bold text-snowWhite mb-6 text-glow">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/how-it-works" className="text-snowWhite/80 hover:text-warmGold transition-all duration-300 font-body text-lg hover:translate-x-1 inline-block">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-snowWhite/80 hover:text-warmGold transition-all duration-300 font-body text-lg hover:translate-x-1 inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-snowWhite/80 hover:text-warmGold transition-all duration-300 font-body text-lg hover:translate-x-1 inline-block">
                  Upload Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Info */}
          <div>
            <h3 className="text-xl font-heading font-bold text-snowWhite mb-6 text-glow">Service Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <span className="text-warmGold">🇬🇧</span>
                <span className="text-snowWhite/80 font-body">UK Based Service</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-warmGold">💷</span>
                <span className="text-snowWhite/80 font-body font-bold">£12.50 per video</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-warmGold">⚡</span>
                <span className="text-snowWhite/80 font-body">Lightning Fast Delivery</span>
              </li>
            </ul>

            {/* CTA in Footer */}
            <div className="mt-6">
              <Link
                href="/upload"
                className="inline-flex items-center bg-warmGold text-charcoal font-bold px-4 py-3 rounded-xl hover:bg-warmGold/90 transition-all duration-300 shadow-gold group whitespace-nowrap sm:px-6 lg:px-8"
              >
                <span className="text-base mr-2 sm:text-lg">🎅</span>
                <span className="text-sm sm:text-base">See Santa Today!</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider with Christmas Pattern */}
        <div className="relative my-8">
          <hr className="border-snowWhite/20" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-christmasRed px-4">
            <span className="text-snowWhite text-2xl">❄️ 🎄 ❄️</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <span className="text-snowWhite/80 font-body mb-4 sm:mb-0">
            © {new Date().getFullYear()} Seasonal Santa. All Rights Reserved.
          </span>
          <div className="flex items-center space-x-6">
            <span className="text-snowWhite/60 font-body">🎄 Made with Christmas Magic</span>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-christmasRed rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-warmGold rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-evergreen rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
