"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SubtleSnow } from "@/components/animated-snow";
import Link from "next/link";

interface OrderData {
  orderId: string;
  email: string;
  status: string;
  videoUrl?: string;
  createdAt: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`/api/order/status?orderId=${orderId}`);
        const data = await response.json();

        if (data.success) {
          setOrderData(data);
        } else {
          setError(data.error || "Failed to load order data");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order data");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <SubtleSnow density="light" />
        <div className="text-white text-xl">Loading your Santa magic...</div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <SubtleSnow density="light" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-gradient-to-r from-red-500 to-green-500 px-6 py-3 text-white font-bold hover:from-red-600 hover:to-green-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <SubtleSnow density="light" />

      <div className="relative z-10 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Success Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 text-8xl animate-bounce">🎅</div>
            <h1 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
              Your Santa Video is Ready!
            </h1>
            <p className="text-xl text-gray-300">
              The magic of Christmas has been delivered ✨
            </p>
          </div>

          {/* Video Player */}
          {orderData.videoUrl && (
            <div className="mb-12 overflow-hidden rounded-2xl border-4 border-green-500/50 bg-gray-900 p-4 shadow-2xl">
              <video
                controls
                className="w-full rounded-lg"
                poster="/santa-placeholder.jpg"
              >
                <source src={orderData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {orderData.videoUrl && (
              <a
                href={orderData.videoUrl}
                download
                className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-red-500 to-green-500 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-green-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download Video</span>
              </a>
            )}

            <button
              onClick={() => {
                if (navigator.share && orderData.videoUrl) {
                  navigator.share({
                    title: "My Santa Doorbell Magic",
                    text: "Check out my magical Santa video!",
                    url: orderData.videoUrl,
                  });
                }
              }}
              className="flex items-center justify-center space-x-2 rounded-lg border-2 border-blue-500 bg-blue-500/10 px-6 py-4 font-bold text-blue-400 transition-all duration-300 hover:scale-105 hover:bg-blue-500/20"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </button>
          </div>

          {/* Order Info */}
          <div className="mb-12 rounded-xl border border-purple-400/20 bg-purple-900/20 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Order Details</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span>{orderData.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{new Date(orderData.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="capitalize text-green-400">{orderData.status}</span>
              </div>
            </div>
          </div>

          {/* Create Another */}
          <div className="rounded-2xl border-2 border-dashed border-green-500/30 bg-gray-900/50 p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Want to create another magical moment?
            </h3>
            <p className="mb-6 text-gray-400">
              Share the Christmas magic with family and friends!
            </p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-gradient-to-r from-red-500 to-green-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-green-600"
            >
              🎅 Create Another Video
            </Link>
          </div>

          {/* Social Sharing Section */}
          <div className="mt-12 text-center">
            <h3 className="mb-4 text-xl font-bold text-white">
              Share the Christmas Magic
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=I just created magical Santa doorbell footage! 🎅✨&url=${window.location.href}`, '_blank')}
                className="rounded-full bg-blue-400 p-3 text-white transition-all hover:scale-110"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                className="rounded-full bg-blue-600 p-3 text-white transition-all hover:scale-110"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
