import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-r from-evergreen to-christmasRed text-snowWhite">
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/">
              <span className="text-3xl font-heading font-bold text-snowWhite">🎅 Seasonal Santa</span>
            </Link>
            <p className="mt-4 text-snowWhite/80 font-body">
              Bring the magic of Christmas to your doorstep with personalized Santa videos.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-snowWhite mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/how-it-works" className="text-snowWhite/80 hover:text-warmGold transition-colors font-body">How It Works</Link></li>
              <li><Link href="/faq" className="text-snowWhite/80 hover:text-warmGold transition-colors font-body">FAQ</Link></li>
              <li><Link href="/upload" className="text-snowWhite/80 hover:text-warmGold transition-colors font-body">Upload Video</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-snowWhite mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-snowWhite/80 font-body">support@seasonalsanta.co.uk</li>
              <li className="text-snowWhite/80 font-body">UK Based Service</li>
              <li className="text-snowWhite/80 font-body">£12.50 per video</li>
            </ul>
          </div>
        </div>
        
        <hr className="my-8 border-snowWhite/20" />
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <span className="text-sm text-snowWhite/80 font-body">
            © {new Date().getFullYear()} Seasonal Santa. All Rights Reserved.
          </span>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="text-snowWhite/60 font-body text-sm">🎄 Made with Christmas Magic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
