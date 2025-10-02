import { AuroraHero } from "@/components/hero-section";

export default function Home() {
  return (
    <div className="bg-black">
      <AuroraHero />
      
      {/* Scrolling Text Section - Overlapping Hero */}
      <section className="relative bg-gradient-to-r from-red-500 to-green-500 py-3 overflow-hidden transform -skew-y-3 -mt-8 z-20">
        <div className="flex animate-scroll">
          <div className="flex items-center space-x-12 whitespace-nowrap">
            <span className="text-2xl font-bold text-white font-serif drop-shadow-lg">🎄 Merry Christmas 🎄</span>
            <span className="text-2xl font-bold text-white font-serif drop-shadow-lg">🎄 Merry Christmas 🎄</span>
            <span className="text-2xl font-bold text-white font-serif drop-shadow-lg">🎄 Merry Christmas 🎄</span>
            <span className="text-2xl font-bold text-white font-serif drop-shadow-lg">🎄 Merry Christmas 🎄</span>
            <span className="text-2xl font-bold text-white font-serif drop-shadow-lg">🎄 Merry Christmas 🎄</span>
            <span className="text-2xl font-bold text-white font-serif drop-shadow-lg">🎄 Merry Christmas 🎄</span>
            <span className="text-2xl font-bold text-white font-serif drop-shadow-lg">🎄 Merry Christmas 🎄</span>
            <span className="text-2xl font-bold text-white font-serif drop-shadow-lg">🎄 Merry Christmas 🎄</span>
          </div>
        </div>
      </section>
      
      {/* Carousel Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            🎅 See the Magic in Action
          </h2>
          
          {/* Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 - Upload */}
            <div className="relative bg-gray-900 rounded-xl p-8 border border-blue-400/30 shadow-lg hover:border-blue-400/60 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-blue-400 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Step 1: Upload</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Simply upload your doorbell footage. Our AI will analyze the perfect moment for Santa's arrival.
                </p>
        </div>
      </div>

            {/* Step 2 - Wait */}
            <div className="relative bg-gray-900 rounded-xl p-8 border border-green-400/30 shadow-lg hover:border-green-400/60 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 via-blue-400/20 to-green-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-green-400 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Step 2: Wait</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Our AI works its magic behind the scenes. Processing typically takes just a few minutes.
                </p>
              </div>
      </div>

            {/* Step 3 - Receive */}
            <div className="relative bg-gray-900 rounded-xl p-8 border border-purple-400/30 shadow-lg hover:border-purple-400/60 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-purple-400 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Step 3: Receive</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Get your magical Santa video delivered directly to your email. Share the Christmas magic!
                </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            🎅 Order Now
          </h2>
          
          <div className="relative bg-white rounded-2xl shadow-xl p-8 overflow-hidden">
            {/* Animated Border Beam */}
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-green-500/20 to-red-500/20 animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <form className="space-y-6">
                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Your Doorbell Footage
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="video/*,image/*"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-lg font-medium text-gray-600">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        Video or image files (MP4, MOV, JPG, PNG)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Name Fields - Inline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    What service would you like?
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="video">1 Video - £12.50 (AI Generated Santa 10 seconds)</option>
                  </select>
                </div>

                {/* Christmas Time & Date Mark */}
                <div>
                  <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="christmasTimestamp"
                      className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">
                        Add Christmas time and date mark (25/12/2025 00:00:00)
                      </span>
                      <span className="block text-sm text-red-600 font-semibold">
                        +£1.00
                      </span>
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-green-500 text-white font-bold py-4 px-6 rounded-lg text-lg hover:from-red-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  🎅 Create Santa Video - £12.50
                </button>

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Disclaimer:</strong> This service is for entertainment purposes only. No refunds are available once payment is processed. 
                    Sometimes AI can make mistakes - in this case, we will remake your video for you free of charge. 
                    By proceeding, you agree to these terms and conditions.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}