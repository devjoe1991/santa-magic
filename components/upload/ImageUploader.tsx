'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ImagePreview from '@/components/image-preview';
import UploadRequirements from './UploadRequirements';

interface ImageUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onProceedToPayment: () => void;
  onTestGeneration?: () => void;
  isProcessing: boolean;
  error?: { message: string } | null;
}

export default function ImageUploader({
  file,
  onFileSelect,
  onFileRemove,
  onProceedToPayment,
  onTestGeneration,
  isProcessing,
  error
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
    if (!selectedFile.type.startsWith('image/')) {
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
      <Card variant="chunky" className="w-full p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-christmasRed text-2xl text-white shadow-glow">
            📷
          </div>
          <CardTitle className="mb-2 font-heading text-2xl text-christmasRed">
            Perfect! Ready to Create Magic
          </CardTitle>
          <CardDescription className="font-body text-charcoal/70">
            Your photo is ready for Santa transformation
          </CardDescription>
        </div>

        <ImagePreview file={file} onRemove={onFileRemove} />

        <div className="mt-6 space-y-4">
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
          {process.env.NEXT_PUBLIC_TEST_MODE === 'true' && onTestGeneration && (
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
    <Card variant="chunky" className="w-full p-8">
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

      <UploadRequirements />
    </Card>
  );
}