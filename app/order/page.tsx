"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function OrderPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    service: "video",
    christmasTimestamp: false,
    file: null as File | null
  });

  const totalPrice = formData.christmasTimestamp ? "£13.50" : "£12.50";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white rounded-2xl shadow-xl p-8 overflow-hidden"
        >
          {/* Animated Border Beam */}
          <div className="absolute inset-0 rounded-2xl">
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "linear-gradient(90deg, transparent 0%, #ff0000 20%, #00ff00 30%, #ff0000 40%, transparent 60%)",
                backgroundSize: "200% 100%",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "xor",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                padding: "2px"
              }}
              animate={{
                backgroundPosition: ["-100% 0%", "100% 0%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              🎅 Create Your Santa Video
            </h1>

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
                  onChange={handleFileChange}
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
                    {formData.file ? formData.file.name : "Click to upload or drag and drop"}
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
                  value={formData.firstName}
                  onChange={handleInputChange}
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
                  value={formData.lastName}
                  onChange={handleInputChange}
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
                value={formData.service}
                onChange={handleInputChange}
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
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-red-500 to-green-500 text-white font-bold py-4 px-6 rounded-lg text-lg hover:from-red-600 hover:to-green-600 transition-all duration-300 shadow-lg"
            >
              🎅 Create Santa Video - {totalPrice}
            </motion.button>

            {/* Trust Markers */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center space-x-6 mb-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">PCI Compliant</span>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 text-xs text-green-700">
                <span>🔒 256-bit encryption</span>
                <span>•</span>
                <span>🛡️ Fraud protection</span>
                <span>•</span>
                <span>💳 Secure payments via Stripe</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Disclaimer:</strong> This service is for entertainment purposes only. No refunds are available once payment is processed. 
                Sometimes AI can make mistakes - in this case, we will remake your video for you free of charge. 
                By proceeding, you agree to these terms and conditions.
              </p>
            </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
