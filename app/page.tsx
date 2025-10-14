"use client";

import { AuroraHero } from "@/components/hero-section";
import { useState } from "react";
import { useErrorHandling } from "@/hooks/use-error-handling";
import ErrorDisplay from "@/components/error-display";
import { createError } from "@/lib/error-handler";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedQuality, setSelectedQuality] = useState<"720p" | "1080p">("720p");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Error handling
  const { error, clearError, handleError, isRetrying } = useErrorHandling();

  // Calculate price based on quality
  const price = selectedQuality === "720p" ? "£6.99" : "£9.99";

  const handleFileSelect = (selectedFile: File) => {
    clearError();

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      handleError(createError.invalidImageFormat(), "upload");
      return;
    }

    // Validate file size (max 20MB)
    if (selectedFile.size > 20 * 1024 * 1024) {
      handleError(createError.imageTooBig("20MB"), "upload");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileRemove = () => {
    setFile(null);
    clearError();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      handleError(createError.generic("Please enter your full name"), "upload");
      return;
    }

    if (!email) {
      handleError(createError.generic("Please enter your email address"), "upload");
      return;
    }

    if (!file) {
      handleError(createError.generic("Please upload a doorbell screenshot first"), "upload");
      return;
    }

    setIsProcessing(true);
    clearError();

    try {
      console.log("Starting scene analysis and order creation...");

      // First, analyze the scene and create the order
      const formData = new FormData();
      formData.append("image", file);

      const analysisResponse = await fetch("/api/analyze-scene", {
        method: "POST",
        body: formData,
      });

      if (!analysisResponse.ok) {
        throw new Error(`Analysis failed: ${analysisResponse.statusText}`);
      }

      const analysisData = await analysisResponse.json();

      if (!analysisData.success) {
        throw new Error(analysisData.error || "Scene analysis failed");
      }

      // Use the best prompt automatically
      const bestPrompt = analysisData.prompts?.[0];
      if (!bestPrompt) {
        throw new Error("No suitable video prompts generated");
      }

      // Create order with analysis data
      const orderResponse = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          analysisId: analysisData.analysisId,
          selectedPromptId: bestPrompt.id,
          quality: selectedQuality,
          price: selectedQuality === "720p" ? 6.99 : 9.99,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.error || "Failed to create order");
      }

      // Store order ID and redirect to payment
      if (orderResult.orderId) {
        sessionStorage.setItem("currentOrderId", orderResult.orderId);
      }

      if (orderResult.checkoutUrl) {
        window.location.href = orderResult.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      handleError(
        createError.generic(
          error instanceof Error
            ? error.message
            : "Failed to process your order. Please try again.",
        ),
        "upload",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestGeneration = async () => {
    if (!file) {
      handleError(createError.generic("No file selected"), "test");
      return;
    }

    setIsProcessing(true);
    clearError();

    try {
      console.log("Starting test video generation...");

      // First, analyze the scene
      const formData = new FormData();
      formData.append("image", file);

      const analysisResponse = await fetch("/api/analyze-scene", {
        method: "POST",
        body: formData,
      });

      if (!analysisResponse.ok) {
        throw new Error(`Analysis failed: ${analysisResponse.statusText}`);
      }

      const analysisData = await analysisResponse.json();

      if (!analysisData.success) {
        throw new Error(analysisData.error || "Scene analysis failed");
      }

      // Use the best prompt automatically
      const bestPrompt = analysisData.prompts?.[0];
      if (!bestPrompt) {
        throw new Error("No suitable video prompts generated");
      }

      // Create order without payment in test mode
      const orderResponse = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          analysisId: analysisData.analysisId,
          selectedPromptId: bestPrompt.id,
          testMode: true,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.error || "Failed to create test order");
      }

      console.log("Test order created:", orderResult.orderId);

      // Directly trigger video processing
      const processResponse = await fetch("/api/process-video-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderResult.orderId,
          analysisId: analysisData.analysisId,
          promptId: bestPrompt.id,
          videoDuration: 10,
        }),
      });

      const processResult = await processResponse.json();

      if (!processResult.success) {
        throw new Error(
          processResult.details || "Failed to start video processing",
        );
      }

      console.log("Video processing started for test order");

      // Store order ID and redirect to processing page
      sessionStorage.setItem("currentOrderId", orderResult.orderId);
      window.location.href = `/processing?orderId=${orderResult.orderId}`;
    } catch (error) {
      console.error("Test generation failed:", error);
      handleError(
        createError.generic(
          error instanceof Error
            ? error.message
            : "Test generation failed. Please try again.",
        ),
        "test",
      );
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="bg-black">
      <AuroraHero />

      {/* Scrolling Text Section - Overlapping Hero */}
      <section className="relative z-20 -mt-8 -skew-y-3 transform overflow-hidden bg-gradient-to-r from-red-500 to-green-500 py-3">
        <div className="animate-scroll flex">
          <div className="flex items-center space-x-12 whitespace-nowrap">
            <span className="font-serif text-2xl font-bold text-white drop-shadow-lg">
              🎄 Merry Christmas 🎄
            </span>
            <span className="font-serif text-2xl font-bold text-white drop-shadow-lg">
              🎄 Merry Christmas 🎄
            </span>
            <span className="font-serif text-2xl font-bold text-white drop-shadow-lg">
              🎄 Merry Christmas 🎄
            </span>
            <span className="font-serif text-2xl font-bold text-white drop-shadow-lg">
              🎄 Merry Christmas 🎄
            </span>
            <span className="font-serif text-2xl font-bold text-white drop-shadow-lg">
              🎄 Merry Christmas 🎄
            </span>
            <span className="font-serif text-2xl font-bold text-white drop-shadow-lg">
              🎄 Merry Christmas 🎄
            </span>
            <span className="font-serif text-2xl font-bold text-white drop-shadow-lg">
              🎄 Merry Christmas 🎄
            </span>
            <span className="font-serif text-2xl font-bold text-white drop-shadow-lg">
              🎄 Merry Christmas 🎄
            </span>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="bg-black py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            🎅 See the Magic in Action
          </h2>

          {/* Step Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 - Upload */}
            <div className="relative rounded-xl border border-blue-400/30 bg-gray-900 p-8 shadow-lg transition-all duration-300 hover:border-blue-400/60">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-400">
                  <svg
                    className="h-8 w-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-center text-2xl font-bold text-white">
                  Step 1: Upload
                </h3>
                <p className="text-center leading-relaxed text-gray-300">
                  Upload a screenshot from your doorbell camera. Our AI will analyze the
                  perfect spot for Santa&apos;s arrival.
                </p>
              </div>
            </div>

            {/* Step 2 - Wait */}
            <div className="relative rounded-xl border border-green-400/30 bg-gray-900 p-8 shadow-lg transition-all duration-300 hover:border-green-400/60">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 via-blue-400/20 to-green-400/20 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-400">
                  <svg
                    className="h-8 w-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-center text-2xl font-bold text-white">
                  Step 2: Wait
                </h3>
                <p className="text-center leading-relaxed text-gray-300">
                  Our AI works its magic behind the scenes. Processing typically
                  takes just a few minutes.
                </p>
              </div>
            </div>

            {/* Step 3 - Receive */}
            <div className="relative rounded-xl border border-purple-400/30 bg-gray-900 p-8 shadow-lg transition-all duration-300 hover:border-purple-400/60">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-purple-400">
                  <svg
                    className="h-8 w-8 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-center text-2xl font-bold text-white">
                  Step 3: Receive
                </h3>
                <p className="text-center leading-relaxed text-gray-300">
                  Get your magical Santa video delivered directly to your email.
                  Share the Christmas magic!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            🎅 Create Your Santa Video
          </h2>

          <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
            {/* Animated Border Beam */}
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-red-500/20 via-green-500/20 to-red-500/20"></div>
            </div>

            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields - Inline */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your first name"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your last name"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                    required
                    disabled={isProcessing}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    We&apos;ll send your magical Santa video to this email address
                  </p>
                </div>

                {/* Video Quality Selection */}
                <div>
                  <label
                    htmlFor="quality"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Video Quality
                  </label>
                  <select
                    id="quality"
                    name="quality"
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value as "720p" | "1080p")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    disabled={isProcessing}
                  >
                    <option value="720p">720p Video (10 seconds) - £6.99</option>
                    <option value="1080p">1080p Video (10 seconds) - £9.99</option>
                  </select>
                </div>

                {/* Compact File Upload Section */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload Your Doorbell Screenshot
                  </label>

                  {!file ? (
                    <div
                      className={`relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed p-6 text-center transition-all duration-300 ${
                        dragActive
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-green-50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileInput}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        disabled={isProcessing}
                      />

                      <div className="flex flex-col items-center">
                        <div className="mb-3 text-4xl">📷</div>
                        <p className="mb-1 text-sm font-medium text-gray-700">
                          Drag & drop or click to browse
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG, WebP - Max 20MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg border-2 border-green-500 bg-green-50 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">✅</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleFileRemove}
                        className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-600"
                        disabled={isProcessing}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing || !file}
                  className="w-full rounded-lg bg-gradient-to-r from-red-500 to-green-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-green-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      <span>Creating your Santa magic...</span>
                    </div>
                  ) : (
                    `🎅 Create Santa Video - ${price}`
                  )}
                </button>

                {/* Test Mode Button */}
                {process.env.NEXT_PUBLIC_TEST_MODE === "true" && file && (
                  <button
                    type="button"
                    onClick={handleTestGeneration}
                    disabled={isProcessing}
                    className="w-full rounded-lg border-2 border-green-500 bg-green-500/10 px-6 py-3 text-sm font-bold text-green-600 transition-all duration-300 hover:scale-105 hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-green-600"></div>
                        <span>Starting Test Generation...</span>
                      </div>
                    ) : (
                      "🧪 Test Video Generation (Dev Mode)"
                    )}
                  </button>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mt-4">
                    <ErrorDisplay
                      error={error}
                      onRetry={() => {
                        clearError();
                      }}
                      onDismiss={clearError}
                      isRetrying={isRetrying}
                    />
                  </div>
                )}

                {/* Trust Markers */}
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-center justify-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        SSL Secured
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        PCI Compliant
                      </span>
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
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs leading-relaxed text-gray-600">
                    <strong>Disclaimer:</strong> This service is for
                    entertainment purposes only. No refunds are available once
                    payment is processed. Sometimes AI can make mistakes - in
                    this case, we will remake your video for you free of charge.
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
