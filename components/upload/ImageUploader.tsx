"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ImagePreview from "@/components/image-preview";
import UploadRequirements from "./UploadRequirements";

interface ImageUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onProceedToPayment: () => void;
  onTestGeneration?: () => void;
  isProcessing: boolean;
  error?: { message: string } | null;
  sceneContext?: string;
  onSceneContextChange?: (context: string) => void;
}

export default function ImageUploader({
  file,
  onFileSelect,
  onFileRemove,
  onProceedToPayment,
  onTestGeneration,
  isProcessing,
  error,
  sceneContext = "",
  onSceneContextChange,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

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
    // Basic client-side validation
    if (!selectedFile.type.startsWith("image/")) {
      return; // Let parent handle error
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      return; // Let parent handle error
    }

    onFileSelect(selectedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (file) {
    return (
      <Card variant="chunky" className="w-full p-6 sm:p-8">
        <div className="mb-4 text-center sm:mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-christmasRed text-xl text-white shadow-glow sm:h-16 sm:w-16 sm:text-2xl">
            📷
          </div>
          <CardTitle className="mb-2 font-heading text-xl text-christmasRed sm:text-2xl">
            Perfect! Ready to Create Magic
          </CardTitle>
          <CardDescription className="font-body text-sm text-charcoal/70 sm:text-base">
            Your photo is ready for Santa transformation
          </CardDescription>
        </div>

        <ImagePreview file={file} onRemove={onFileRemove} />

        {/* Scene Context Input - Optional */}
        <div className="mt-4 space-y-2 sm:mt-6">
          <label className="flex items-center gap-2 font-body text-sm font-medium text-charcoal">
            <span className="text-base">📝</span>
            Scene Context
            <span className="rounded-full bg-warmGold/20 px-2 py-0.5 text-xs font-normal text-warmGold">
              Optional
            </span>
          </label>
          <textarea
            value={sceneContext}
            onChange={(e) => onSceneContextChange?.(e.target.value)}
            placeholder="e.g., 'Camera is on back wall. Door is to the left. Don't show Santa coming from below camera as that's a wall.'"
            rows={2}
            maxLength={200}
            className="w-full rounded-lg border-2 border-warmGold/20 bg-snowWhite/50 p-3 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:border-warmGold/50 focus:outline-none focus:ring-2 focus:ring-warmGold/20 sm:text-base"
          />
          <p className="flex items-center gap-1 font-body text-xs text-charcoal/60">
            <span>💡</span>
            Help us position Santa correctly by describing your camera location (e.g., "Camera on ceiling", "Doorbell view")
          </p>
        </div>

        <div className="mt-4 space-y-3 sm:space-y-4">
          <Button
            onClick={onProceedToPayment}
            disabled={isProcessing}
            variant="vibrant"
            size="massive"
            className="glow-pulse w-full"
          >
            {isProcessing ? (
              <>
                <div className="mr-3 h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <span className="mr-3 text-2xl">🎅</span>
                Create Santa Video - £12.50
              </>
            )}
          </Button>

          {/* Test Mode Button - Only show in development */}
          {process.env.NEXT_PUBLIC_TEST_MODE === "true" && onTestGeneration && (
            <Button
              onClick={onTestGeneration}
              disabled={isProcessing}
              variant="electric"
              size="chunky"
              className="w-full"
            >
              {isProcessing ? (
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

        <UploadRequirements />
      </Card>
    );
  }

  return (
    <Card variant="chunky" className="w-full p-6 sm:p-8">
      <div className="mb-4 text-center sm:mb-6">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-christmasRed text-xl text-white shadow-glow sm:h-16 sm:w-16 sm:text-2xl">
          📷
        </div>
        <CardTitle className="mb-2 font-heading text-xl text-christmasRed sm:text-2xl">
          Choose Your Photo
        </CardTitle>
        <CardDescription className="font-body text-sm text-charcoal/70 sm:text-base">
          Upload a screenshot from your doorbell camera
        </CardDescription>
      </div>

      <div
        className={cn(
          "group relative min-h-[200px] overflow-hidden rounded-2xl border-4 border-dashed bg-gradient-to-br from-frostBlue/20 via-white to-cream p-4 transition-all duration-300 sm:min-h-[250px] sm:rounded-3xl sm:p-6",
          dragActive
            ? "border-electricGreen from-electricGreen/10 scale-[1.02] bg-gradient-to-br via-white to-warmGold/10"
            : "hover:border-electricGreen hover:from-electricGreen/10 border-christmasRed hover:scale-[1.02] hover:bg-gradient-to-br hover:via-white hover:to-warmGold/10",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        {/* Center Content */}
        <div className="relative flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 text-6xl sm:text-8xl">🚪</div>

          {/* British Christmas Knock Knock Joke */}
          <div className="mb-3 space-y-1">
            <h2 className="font-heading text-lg font-bold text-charcoal sm:text-xl">
              Knock, knock!
            </h2>
            <p className="font-body text-base font-semibold text-christmasRed sm:text-lg">
              Who&apos;s there?
            </p>
            <p className="font-body text-base font-bold text-warmGold sm:text-lg">
              Santa Claus!
            </p>
            <p className="font-body text-xs text-charcoal/70 sm:text-sm">
              Drop your doorbell screenshot here to see the magic
            </p>
          </div>

          {/* Festive CTA */}
          <div className="flex items-center gap-3 text-2xl sm:gap-4 sm:text-3xl">
            <span>🎅</span>
            <span>🎄</span>
            <span>🎁</span>
          </div>
        </div>

        {/* Hover State Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-christmasRed/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <UploadRequirements />
    </Card>
  );
}
