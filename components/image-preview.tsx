'use client';

import { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export default function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>(() => {
    return URL.createObjectURL(file);
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative bg-cream border-2 border-warmGold/20 rounded-xl p-6 shadow-frost">
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
        aria-label="Remove image"
      >
        <X className="w-4 h-4 text-charcoal" />
      </button>

      {/* Image preview */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-md">
          <Image
            src={imageUrl}
            alt="Uploaded doorbell photo"
            width={400}
            height={256}
            className="w-full h-auto max-h-64 object-contain rounded-lg border-2 border-warmGold/30 shadow-gold"
            unoptimized
          />
        </div>

        {/* File info */}
        <div className="text-center space-y-2">
          <h3 className="font-heading font-semibold text-christmasRed text-lg">
            📸 Photo Uploaded
          </h3>
          <div className="space-y-1">
            <p className="font-body text-charcoal font-medium">
              {file.name}
            </p>
            <p className="font-body text-charcoal/60 text-sm">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>

        {/* Change photo button */}
        <button
          onClick={onRemove}
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
              className: "border-2 border-evergreen text-evergreen hover:bg-evergreen hover:text-white"
            })
          )}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Change Photo
        </button>
      </div>
    </div>
  );
}