"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SubtleSnow } from "@/components/animated-snow";

function ProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState<string>("processing");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Analyzing your doorbell scene...");

  useEffect(() => {
    if (!orderId) {
      // No order ID, redirect to home
      router.push("/");
      return;
    }

    // Poll for order status
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/order/status?orderId=${orderId}`);
        const data = await response.json();

        if (data.success) {
          setStatus(data.status);

          // Update progress and message based on status
          switch (data.status) {
            case "pending":
              setProgress(10);
              setMessage("Preparing your magical transformation...");
              break;
            case "processing":
              setProgress(50);
              setMessage("Santa is on his way! Creating your video...");
              break;
            case "completed":
              setProgress(100);
              setMessage("Your Santa magic is ready!");
              // Redirect to results page
              setTimeout(() => {
                router.push(`/result/${orderId}`);
              }, 2000);
              clearInterval(pollInterval);
              break;
            case "failed":
              setProgress(0);
              setMessage("Oops! Something went wrong. Please contact support.");
              clearInterval(pollInterval);
              break;
          }
        }
      } catch (error) {
        console.error("Error polling order status:", error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-black">
      <SubtleSnow density="medium" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-3xl border border-green-500/30 bg-gray-900 p-8 shadow-2xl sm:p-12">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-green-500/10 to-red-500/10 animate-pulse"></div>

            <div className="relative z-10 text-center">
              {/* Santa Icon with Animation */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20"></div>
                  <div className="relative text-8xl animate-bounce">🎅</div>
                </div>
              </div>

              {/* Title */}
              <h1 className="mb-4 font-serif text-3xl font-bold text-white sm:text-4xl">
                Creating Your Santa Magic
              </h1>

              {/* Status Message */}
              <p className="mb-8 text-lg text-gray-300">{message}</p>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="relative h-4 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 animate-pulse bg-white/20"></div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-400">{progress}% Complete</p>
              </div>

              {/* Processing Steps */}
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${progress >= 10 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  <span className={`text-sm ${progress >= 10 ? 'text-white' : 'text-gray-500'}`}>
                    Scene analysis complete
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${progress >= 50 ? 'bg-green-500 animate-pulse' : progress >= 10 ? 'bg-yellow-500 animate-pulse' : 'bg-gray-600'}`}></div>
                  <span className={`text-sm ${progress >= 50 ? 'text-white' : progress >= 10 ? 'text-yellow-400' : 'text-gray-500'}`}>
                    Generating Santa video
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  <span className={`text-sm ${progress >= 100 ? 'text-white' : 'text-gray-500'}`}>
                    Preparing delivery
                  </span>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="mt-12 rounded-xl border border-blue-400/20 bg-blue-900/20 p-4">
                <p className="text-sm text-blue-300">
                  <span className="font-bold">🎄 Did you know?</span> Santa&apos;s sleigh can travel at
                  approximately 650 miles per second to deliver presents to all children worldwide!
                </p>
              </div>

              {/* Warning for failed state */}
              {status === "failed" && (
                <div className="mt-8 rounded-xl border border-red-400/20 bg-red-900/20 p-4">
                  <p className="text-sm text-red-300">
                    <span className="font-bold">⚠️ Something went wrong</span>
                    <br />
                    Please contact our support team with your order ID: {orderId}
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white transition-all hover:bg-red-600"
                  >
                    Return to Home
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>This usually takes 2-5 minutes. Please don&apos;t close this page.</p>
            <p className="mt-2">Order ID: {orderId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <ProcessingContent />
    </Suspense>
  );
}
