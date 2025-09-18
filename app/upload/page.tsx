"use client";

import { useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera, CheckCircle, AlertCircle } from "lucide-react";
import { SubtleSnow } from "@/components/animated-snow";
import ImagePreview from "@/components/image-preview";
import SceneAnalysisCard from "@/components/scene-analysis-card";
import AnalysisLoading from "@/components/analysis-loading";
import PromptSelector from "@/components/prompt-selector";
import ProcessTracker from "@/components/process-tracker";
import { SceneAnalysis, AnalysisResponse } from "@/types/scene-analysis";
import { VideoPrompt } from "@/types/video-prompts";
import { EnhancedAnalysisResponse } from "@/types/database";
import {
  generateVideoPrompts,
  generateMorePrompts,
} from "@/lib/prompt-generator";
import { useErrorHandling } from "@/hooks/use-error-handling";
import ErrorDisplay from "@/components/error-display";
import { createError, parseApiError } from "@/lib/error-handler";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Scene analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<SceneAnalysis | null>(
    null,
  );
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Prompt generation states
  const [videoPrompts, setVideoPrompts] = useState<VideoPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<VideoPrompt | null>(
    null,
  );
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [hasGeneratedPrompts, setHasGeneratedPrompts] = useState(false);

  // Payment flow states
  const [userEmail, setUserEmail] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Error handling
  const { error, clearError, handleError, executeWithRetry, isRetrying } =
    useErrorHandling();

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    clearError(); // Clear any previous errors

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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const analyzeScene = async () => {
    if (!file) return;

    clearError();
    setIsAnalyzing(true);

    try {
      const result = await executeWithRetry(
        async () => {
          const formData = new FormData();
          formData.append("image", file);

          const response = await fetch("/api/analyze-scene", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data: EnhancedAnalysisResponse = await response.json();

          if (!data.success) {
            throw parseApiError(data, "scene-analysis");
          }

          return data;
        },
        "scene-analysis",
        2,
      );

      // Success - update state
      if (result.analysis && result.analysisId) {
        setAnalysisResults(result.analysis);
        setAnalysisId(result.analysisId);
        setImageUrl(result.imageUrl || null);
        setHasAnalyzed(true);

        // Use prompts from server if available, otherwise generate locally
        if (result.prompts && result.prompts.length > 0) {
          setVideoPrompts(result.prompts);
          setHasGeneratedPrompts(true);
          // Auto-select the highest confidence prompt
          setSelectedPrompt(result.prompts[0]);
        } else {
          // Generate prompts using the API
          await generatePromptsFromAnalysis(result.analysisId);
        }
      }
    } catch (error) {
      // Error handling is managed by executeWithRetry
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = () => {
    setAnalysisResults(null);
    setAnalysisId(null);
    setImageUrl(null);
    setVideoPrompts([]);
    setSelectedPrompt(null);
    setHasGeneratedPrompts(false);
    clearError();
    analyzeScene();
  };

  const generatePromptsFromAnalysis = async (currentAnalysisId: string) => {
    if (!currentAnalysisId) {
      console.error("No analysis ID provided for prompt generation");
      return;
    }

    try {
      setIsGeneratingPrompts(true);

      const response = await fetch("/api/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: currentAnalysisId,
          maxPrompts: 5,
        }),
      });

      const result = await response.json();

      if (result.success && result.prompts) {
        setVideoPrompts(result.prompts);
        setHasGeneratedPrompts(true);

        // Auto-select the highest confidence prompt
        if (result.prompts.length > 0) {
          const highestConfidencePrompt = result.prompts.sort(
            (a: VideoPrompt, b: VideoPrompt) =>
              (b.confidence || 0) - (a.confidence || 0),
          )[0];
          setSelectedPrompt(highestConfidencePrompt);
        }
      } else {
        console.error("Failed to generate prompts:", result.error);
        handleError(createError.promptGenerationFailed(), "prompts");
      }
    } catch (error) {
      console.error("Prompt generation error:", error);
      handleError(createError.promptGenerationFailed(), "prompts");
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const handleGenerateMorePrompts = async (newPrompts?: any[]) => {
    if (!analysisId) {
      console.error("No analysis ID available for generating more prompts");
      return;
    }

    // If new prompts are provided directly (from API response), use them
    if (newPrompts) {
      setVideoPrompts((prev) => [...prev, ...newPrompts]);
      return;
    }

    try {
      setIsGeneratingPrompts(true);

      const response = await fetch("/api/prompts/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          additionalCount: 3,
        }),
      });

      const result = await response.json();

      if (result.success && result.newPrompts) {
        setVideoPrompts((prev) => [...prev, ...result.newPrompts]);
      } else {
        console.error("Failed to generate more prompts:", result.error);
      }
    } catch (error) {
      console.error("Error generating more prompts:", error);
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const handlePromptSelect = (prompt: VideoPrompt) => {
    setSelectedPrompt(prompt);
  };

  const handlePromptEdit = (promptId: string, newDescription: string) => {
    setVideoPrompts((prev) =>
      prev.map((p) =>
        p.id === promptId ? { ...p, description: newDescription } : p,
      ),
    );

    if (selectedPrompt?.id === promptId) {
      setSelectedPrompt((prev) =>
        prev ? { ...prev, description: newDescription } : null,
      );
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedPrompt) {
      handleError(
        createError.generic("Please select a video prompt first"),
        "payment",
      );
      return;
    }
    setShowEmailInput(true);
  };

  const handlePaymentSubmit = async () => {
    if (!userEmail || !selectedPrompt || !analysisId) {
      handleError(
        createError.generic("Missing required information for payment"),
        "payment",
      );
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      handleError(
        createError.generic("Please enter a valid email address"),
        "payment",
      );
      return;
    }

    setIsProcessingPayment(true);
    clearError();

    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          analysisId: analysisId,
          selectedPromptId: selectedPrompt.id,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create order");
      }

      // Store order ID for reference
      if (result.orderId) {
        sessionStorage.setItem("currentOrderId", result.orderId);
      }

      // Redirect to Stripe Checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
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

  const handleUpload = async () => {
    // This function is now deprecated in favor of handleProceedToPayment
    // Keep for backward compatibility if needed
    handleProceedToPayment();
  };

  const handleTestGeneration = async () => {
    if (!selectedPrompt || !analysisId) {
      handleError(
        createError.generic("Missing required information for test generation"),
        "test",
      );
      return;
    }

    clearError();
    setIsProcessingPayment(true);

    try {
      console.log("Starting test video generation...");

      // Create order without payment in test mode
      const orderResponse = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          analysisId: analysisId,
          selectedPromptId: selectedPrompt.id,
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
          analysisId: analysisId,
          promptId: selectedPrompt.id,
          videoDuration: 5,
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

      <div className="pb-16 pt-24">
        <MaxWidthWrapper>
          {/* Enhanced Header */}
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-christmasRed/10 px-6 py-3 font-body font-bold text-christmasRed shadow-glow">
              <span className="mr-2 text-xl">🎬</span>
              Step 1: Upload Your Image
            </div>

            <h1 className="animate-fade-up mb-6 font-heading text-title-sm font-bold text-charcoal md:text-title">
              Upload Your{" "}
              <span className="text-gradient text-glow">Doorbell Photo</span>
            </h1>
            <p className="animate-fade-up-delay-1 mx-auto max-w-3xl font-body text-body-lg text-charcoal/70">
              Upload a still image from your doorbell camera and we&apos;ll
              transform it into a magical Santa video for just{" "}
              <span className="text-glow-gold font-bold text-warmGold">
                £12.50
              </span>
            </p>
          </div>

          {/* Main Content Area with 80/20 Split */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* LEFT SIDE - 80% - Main Content */}
            <div className="lg:w-4/5">
              <div className="space-y-8">
                {/* Upload Card - Show only when no file or not analyzed */}
                {!file || (!hasAnalyzed && !isAnalyzing) ? (
                  <Card
                    variant="chunky"
                    className="animate-fade-up-delay-2 w-full p-8"
                  >
                    <div className="mb-6 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-christmasRed text-2xl text-white shadow-glow">
                        📷
                      </div>
                      <CardTitle className="mb-2 font-heading text-2xl text-christmasRed">
                        Choose Your Photo
                      </CardTitle>
                      <CardDescription className="font-body text-charcoal/70">
                        Drag and drop your image file here, or click to browse
                      </CardDescription>
                    </div>

                    {!file && (
                      <div
                        className={cn(
                          "group relative min-h-[400px] overflow-hidden rounded-[40px] border-[8px] border-dashed bg-gradient-to-br from-frostBlue/20 via-white to-cream p-12 transition-all duration-300",
                          dragActive
                            ? "scale-[1.02] border-electricGreen bg-gradient-to-br from-electricGreen/10 via-white to-warmGold/10"
                            : "border-christmasRed hover:scale-[1.02] hover:border-electricGreen hover:bg-gradient-to-br hover:from-electricGreen/10 hover:via-white hover:to-warmGold/10",
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {/* Animated Christmas Lights Border */}
                        <div className="pointer-events-none absolute inset-0">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute h-3 w-3 animate-pulse rounded-full"
                              style={{
                                background:
                                  i % 3 === 0
                                    ? "#FF0040"
                                    : i % 3 === 1
                                      ? "#00FF88"
                                      : "#FFD700",
                                top:
                                  i < 5
                                    ? "0"
                                    : i < 10
                                      ? "100%"
                                      : `${(i - 10) * 10}%`,
                                left:
                                  i < 5
                                    ? `${i * 20}%`
                                    : i < 10
                                      ? `${(i - 5) * 20}%`
                                      : i < 15
                                        ? "0"
                                        : "100%",
                                transform: "translate(-50%, -50%)",
                                animationDelay: `${i * 200}ms`,
                                boxShadow: `0 0 20px ${i % 3 === 0 ? "rgba(255,0,64,0.8)" : i % 3 === 1 ? "rgba(0,255,136,0.8)" : "rgba(255,215,0,0.8)"}`,
                              }}
                            />
                          ))}
                        </div>

                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileInput}
                          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        />

                        {/* Center Content */}
                        <div className="relative flex h-full flex-col items-center justify-center text-center">
                          <div className="mb-6 text-8xl">📹</div>
                          <h2 className="mb-4 font-heading text-4xl font-bold uppercase text-charcoal">
                            Drop Your Photo Here
                          </h2>
                          <p className="mb-8 font-body text-xl text-charcoal/70">
                            or click to browse
                          </p>

                          {/* Festive CTA */}
                          <div className="flex items-center gap-4 text-3xl">
                            <span>🎅</span>
                            <span>🎄</span>
                            <span>🎁</span>
                          </div>
                        </div>

                        {/* Hover State Overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-christmasRed/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    )}

                    {file && (
                      <div className="mt-6">
                        <ImagePreview
                          file={file}
                          onRemove={() => setFile(null)}
                        />

                        {/* Analyze Button - Directly below file preview */}
                        <div className="mt-6">
                          <Button
                            onClick={analyzeScene}
                            disabled={isAnalyzing}
                            variant="vibrant"
                            size="massive"
                            className="glow-pulse w-full"
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="mr-3 h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
                                Analysing Scene...
                              </>
                            ) : (
                              <>
                                <span className="mr-3 text-2xl">🔍</span>
                                Analyse Scene
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* File Requirements */}
                    <div className="mt-6 rounded-xl border border-warmGold/20 bg-gradient-to-r from-frostBlue/10 to-warmGold/10 p-6">
                      <h3 className="mb-4 flex items-center font-heading font-bold text-charcoal">
                        <span className="mr-2 text-christmasRed">📋</span>
                        Photo Requirements
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-warmGold">📄</span>
                          <span className="font-body text-charcoal/70">
                            JPG, PNG, WebP
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-evergreen">💾</span>
                          <span className="font-body text-charcoal/70">
                            Max 20MB
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-christmasRed">💡</span>
                          <span className="font-body text-charcoal/70">
                            Well-lit doorway
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-warmGold">👁️</span>
                          <span className="font-body text-charcoal/70">
                            Clear entrance view
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : null}

                {/* Analysis Loading State - Show when analyzing */}
                {isAnalyzing && <AnalysisLoading />}

                {/* Analysis Results and Prompt Selection - Show when analysis complete */}
                {hasAnalyzed && analysisResults && (
                  <div className="space-y-8">
                    <SceneAnalysisCard
                      analysis={analysisResults}
                      onReanalyze={handleReanalyze}
                      isAnalyzing={isAnalyzing}
                    />

                    {/* Prompt Generation Loading */}
                    {isGeneratingPrompts && (
                      <div className="rounded-lg border-2 border-frostBlue/20 bg-frostBlue/10 p-6 text-center">
                        <div className="mb-3 flex items-center justify-center space-x-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-christmasRed"></div>
                          <span className="font-heading font-semibold text-christmasRed">
                            Generating Video Prompts...
                          </span>
                        </div>
                        <p className="font-body text-sm text-charcoal/70">
                          🎬 Creating perfect Santa scenarios based on your
                          scene
                        </p>
                      </div>
                    )}

                    {/* Video Prompt Selector */}
                    {hasGeneratedPrompts && videoPrompts.length > 0 && (
                      <PromptSelector
                        prompts={videoPrompts}
                        selectedPrompt={selectedPrompt}
                        onSelect={handlePromptSelect}
                        onEdit={handlePromptEdit}
                        onGenerateMore={handleGenerateMorePrompts}
                        isGenerating={isGeneratingPrompts}
                        analysisId={analysisId || undefined}
                      />
                    )}

                    {/* Payment Section - Show when prompt is selected */}
                    {selectedPrompt && (
                      <div className="mt-12 space-y-6">
                        {!showEmailInput ? (
                          <div className="space-y-4 text-center">
                            <div className="rounded-lg border-2 border-warmGold/30 bg-warmGold/10 p-6">
                              <h3 className="mb-4 font-heading text-2xl font-bold text-christmasRed">
                                🎄 Ready to Create Your Santa Magic?
                              </h3>
                              <p className="mb-6 font-body text-lg text-charcoal/70">
                                You&apos;ve selected the perfect scene! Complete
                                your order to receive your magical 8-second
                                Santa video.
                              </p>
                              <div className="mb-6 rounded-lg border border-coolGray/20 bg-snowWhite p-4">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="font-heading font-semibold text-charcoal">
                                    Personalized Santa Video
                                  </span>
                                  <span className="font-heading text-xl font-bold text-christmasRed">
                                    £12.50
                                  </span>
                                </div>
                                <p className="font-body text-sm text-charcoal/70">
                                  8-second magical Santa video from your
                                  doorbell scene
                                </p>
                              </div>
                            </div>

                            <div className="mx-auto max-w-md space-y-3">
                              <Button
                                onClick={handleProceedToPayment}
                                variant="premium"
                                size="massive"
                                className="glow-pulse w-full"
                              >
                                ⭐ Continue to Payment - £12.50 ⭐
                              </Button>

                              {process.env.NEXT_PUBLIC_TEST_MODE === "true" && (
                                <Button
                                  onClick={handleTestGeneration}
                                  disabled={isProcessingPayment}
                                  variant="electric"
                                  size="chunky"
                                  className="w-full"
                                >
                                  {isProcessingPayment ? (
                                    <div className="flex items-center space-x-2">
                                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                                      <span>Starting Test Generation...</span>
                                    </div>
                                  ) : (
                                    "🧪 Test Video Generation (Dev Mode)"
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mx-auto max-w-md">
                            <div className="space-y-4 rounded-lg border-2 border-warmGold/30 bg-warmGold/10 p-6">
                              <h3 className="mb-4 font-heading text-xl font-semibold text-christmasRed">
                                🎄 Complete Your Order
                              </h3>

                              <div className="space-y-3">
                                <label
                                  htmlFor="email"
                                  className="block font-heading text-sm font-semibold text-charcoal"
                                >
                                  Email Address
                                </label>
                                <div className="group relative">
                                  <input
                                    id="email"
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) =>
                                      setUserEmail(e.target.value)
                                    }
                                    placeholder="Enter your email for Santa updates! 🎅"
                                    className="min-h-[60px] w-full rounded-2xl border-4 border-christmasRed bg-white px-6 font-body text-xl font-medium text-charcoal transition-all duration-200 placeholder:font-medium placeholder:text-charcoal/40 focus:scale-[1.02] focus:border-electricGreen focus:shadow-[0_0_40px_rgba(0,255,136,0.3)] disabled:opacity-50"
                                    disabled={isProcessingPayment}
                                  />
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl group-focus-within:animate-bounce">
                                    ✉️
                                  </div>
                                  <div className="absolute inset-0 -z-10 rounded-2xl bg-electricGreen/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                                </div>
                                <p className="font-body text-xs text-charcoal/60">
                                  We&apos;ll send your magical Santa video to
                                  this email address
                                </p>
                              </div>

                              <div className="rounded-lg border border-coolGray/20 bg-snowWhite p-4">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="font-heading font-semibold text-charcoal">
                                    Santa Video Magic
                                  </span>
                                  <span className="font-heading font-bold text-christmasRed">
                                    £12.50
                                  </span>
                                </div>
                                <p className="font-body text-sm text-charcoal/70">
                                  8-second personalized Santa video from your
                                  doorbell scene
                                </p>
                              </div>

                              <div className="flex space-x-3">
                                <Button
                                  onClick={() => setShowEmailInput(false)}
                                  disabled={isProcessingPayment}
                                  variant="outline"
                                  size="chunky"
                                  className="flex-1 border-4 border-coolGray/30 text-charcoal hover:scale-105 hover:bg-coolGray/10"
                                >
                                  ← Back
                                </Button>

                                <Button
                                  onClick={handlePaymentSubmit}
                                  disabled={!userEmail || isProcessingPayment}
                                  variant="premium"
                                  size="chunky"
                                  className="flex-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isProcessingPayment ? (
                                    <div className="flex items-center space-x-2">
                                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-charcoal"></div>
                                      <span>Processing...</span>
                                    </div>
                                  ) : (
                                    "💳 Pay Securely with Stripe →"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Show message when no prompt selected yet */}
                        {!selectedPrompt &&
                          hasGeneratedPrompts &&
                          videoPrompts.length > 0 && (
                            <div className="rounded-lg border-2 border-warmGold/30 bg-warmGold/10 p-4 text-center">
                              <h3 className="mb-2 font-heading text-lg font-semibold text-warmGold">
                                🎬 Choose Your Video Scene
                              </h3>
                              <p className="font-body text-charcoal/70">
                                Please select a video prompt above to continue
                                to payment
                              </p>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - 20% - Process Tracker */}
            <div className="lg:w-1/5">
              <ProcessTracker
                currentStep={
                  !file
                    ? "upload"
                    : !hasAnalyzed
                      ? "analyze"
                      : !selectedPrompt
                        ? "prompts"
                        : "payment"
                }
                hasAnalyzed={hasAnalyzed}
                hasSelectedPrompt={!!selectedPrompt}
                isAnalyzing={isAnalyzing}
                isGeneratingPrompts={isGeneratingPrompts}
              />
            </div>
          </div>

          {/* Process Preview - Show only during initial upload state on mobile */}
          <div className="mt-8 lg:hidden">
            {!hasAnalyzed && !isAnalyzing && (
              <div className="animate-fade-up-delay-3 w-full">
                <div className="mb-8 text-center">
                  <h3 className="mb-4 font-heading text-subtitle-sm font-bold text-charcoal">
                    What Happens Next?
                  </h3>
                  <p className="font-body text-charcoal/70">
                    Here&apos;s how we transform your photo into Santa magic
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 rounded-xl border border-warmGold/10 bg-cream/50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-christmasRed text-sm font-bold text-white shadow-glow">
                      1
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-charcoal">
                        AI Scene Analysis
                      </h4>
                      <p className="font-body text-sm text-charcoal/60">
                        We analyze your doorway for the perfect Santa placement
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 rounded-xl border border-warmGold/10 bg-cream/50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warmGold text-sm font-bold text-charcoal shadow-gold">
                      2
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-charcoal">
                        Choose Your Scene
                      </h4>
                      <p className="font-body text-sm text-charcoal/60">
                        Select from personalized Santa video options
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 rounded-xl border border-warmGold/10 bg-cream/50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-evergreen text-sm font-bold text-white shadow-glow">
                      3
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-charcoal">
                        Magic Creation
                      </h4>
                      <p className="font-body text-sm text-charcoal/60">
                        Our AI creates your personalized Santa video
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {uploadSuccess && (
            <div className="mb-8 mt-16 flex flex-col items-center">
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
                <h3 className="mb-2 font-heading text-xl font-semibold text-green-800">
                  Upload Successful!
                </h3>
                <p className="font-body text-green-700">
                  Your video has been uploaded. Redirecting to payment...
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-8">
              <ErrorDisplay
                error={error}
                onRetry={() => {
                  clearError();
                  if (error.context === "scene-analysis" && file) {
                    analyzeScene();
                  } else if (error.context === "prompts" && analysisId) {
                    generatePromptsFromAnalysis(analysisId);
                  }
                }}
                onDismiss={clearError}
                isRetrying={isRetrying}
              />
            </div>
          )}

          {/* Enhanced Trust Signals */}
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="card-tilt group border-2 border-warmGold/20 bg-cream p-8 text-center shadow-frost transition-all duration-300 hover:shadow-gold-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-christmasRed text-3xl text-white shadow-glow transition-transform group-hover:scale-110">
                🔒
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-christmasRed">
                Secure Upload
              </h3>
              <p className="font-body leading-relaxed text-charcoal/70">
                Your images are encrypted and processed securely with
                enterprise-grade protection
              </p>
            </Card>

            <Card className="card-tilt group border-2 border-warmGold/20 bg-cream p-8 text-center shadow-frost transition-all duration-300 hover:shadow-gold-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warmGold text-3xl text-charcoal shadow-gold transition-transform group-hover:scale-110">
                ⚡
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-christmasRed">
                Lightning Fast
              </h3>
              <p className="font-body leading-relaxed text-charcoal/70">
                Receive your personalized Santa video within minutes of upload
                and payment
              </p>
            </Card>

            <Card className="card-tilt group border-2 border-warmGold/20 bg-cream p-8 text-center shadow-frost transition-all duration-300 hover:shadow-gold-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-evergreen text-3xl text-white shadow-glow transition-transform group-hover:scale-110">
                🎁
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-christmasRed">
                Perfect Gift
              </h3>
              <p className="font-body leading-relaxed text-charcoal/70">
                Create magical Christmas memories that families will treasure
                for years to come
              </p>
            </Card>
          </div>
        </MaxWidthWrapper>
      </div>

      <Footer />
    </div>
  );
}
