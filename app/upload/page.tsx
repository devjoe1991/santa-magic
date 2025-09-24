"use client";

import { useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SubtleSnow } from "@/components/animated-snow";
import ImageUploader from "@/components/upload/ImageUploader";
import PaymentFlow from "@/components/upload/PaymentFlow";
import TrustSignals from "@/components/upload/TrustSignals";
import SimpleProcessTracker from "@/components/upload/SimpleProcessTracker";
import { useErrorHandling } from "@/hooks/use-error-handling";
import ErrorDisplay from "@/components/error-display";
import { createError } from "@/lib/error-handler";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Error handling
  const { error, clearError, handleError, isRetrying } = useErrorHandling();

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
    setShowPaymentFlow(false);
    clearError();
  };

  const handleProceedToPayment = () => {
    if (!file) {
      handleError(
        createError.generic("Please select a file first"),
        "upload",
      );
      return;
    }
    setShowPaymentFlow(true);
  };

  const handleBackToUpload = () => {
    setShowPaymentFlow(false);
  };

  const handlePaymentSubmit = async (email: string) => {
    if (!file) {
      handleError(
        createError.generic("No file selected"),
        "payment",
      );
      return;
    }

    setIsProcessingPayment(true);
    clearError();

    try {
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
          email: email,
          analysisId: analysisData.analysisId,
          selectedPromptId: bestPrompt.id,
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
      console.error("Payment initiation failed:", error);
      handleError(
        createError.generic(
          error instanceof Error
            ? error.message
            : "Failed to process payment. Please try again.",
        ),
        "payment",
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleTestGeneration = async () => {
    if (!file) {
      handleError(
        createError.generic("No file selected"),
        "test",
      );
      return;
    }

    setIsProcessingPayment(true);
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

      // Store order ID and redirect to status page
      sessionStorage.setItem("currentOrderId", orderResult.orderId);
      window.location.href = `/order-status/${orderResult.orderId}`;
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
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-frostBlue/10 to-cream">
      <Navbar />
      <SubtleSnow density="light" />

      <div className="pb-8 pt-16 sm:pb-12 sm:pt-20">
        <MaxWidthWrapper>
          {/* Ultra-Compact Header */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="mb-4 inline-flex items-center rounded-full bg-christmasRed/10 px-4 py-2 font-body text-sm font-bold text-christmasRed shadow-glow sm:px-6 sm:py-3 sm:text-base">
              <span className="mr-2 text-lg sm:text-xl">🎬</span>
              Create Your Santa Magic
            </div>

            <h1 className="animate-fade-up mb-3 font-heading text-2xl font-bold text-charcoal sm:text-3xl md:text-4xl">
              Upload Your{" "}
              <span className="text-gradient text-glow">Camera Photo</span>
            </h1>
            <p className="animate-fade-up-delay-1 mx-auto max-w-xl font-body text-sm text-charcoal/70 sm:text-base">
              Transform your doorbell footage into magical Santa video for just{" "}
              <span className="text-glow-gold font-bold text-warmGold">£12.50</span>
            </p>
          </div>

          {/* Main Content Area - Optimized Layout */}
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* LEFT SIDE - Main Content */}
            <div className="flex-1 lg:w-3/4">
              <div className="space-y-6">
                {!showPaymentFlow ? (
                  <ImageUploader
                    file={file}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    onProceedToPayment={handleProceedToPayment}
                    onTestGeneration={handleTestGeneration}
                    isProcessing={isProcessingPayment}
                    error={error}
                  />
                ) : (
                  <PaymentFlow
                    onSubmit={handlePaymentSubmit}
                    isProcessing={isProcessingPayment}
                    onBack={handleBackToUpload}
                  />
                )}
              </div>
            </div>

            {/* RIGHT SIDE - Process Tracker */}
            <div className="lg:w-1/4">
              <SimpleProcessTracker
                currentStep={showPaymentFlow ? "payment" : "upload"}
                hasFile={!!file}
                isProcessing={isProcessingPayment}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-8">
              <ErrorDisplay
                error={error}
                onRetry={() => {
                  clearError();
                  // Since we're streamlining, just clear the error
                }}
                onDismiss={clearError}
                isRetrying={isRetrying}
              />
            </div>
          )}

          {/* Enhanced Trust Signals */}
          <TrustSignals />
        </MaxWidthWrapper>
      </div>

      <Footer />
    </div>
  );
}