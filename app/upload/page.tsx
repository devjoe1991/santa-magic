"use client";

import { useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
    // Validate file type
    if (!selectedFile.type.startsWith('video/')) {
      alert('Please select a video file (MP4, MOV, etc.)');
      return;
    }
    
    // Validate file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
    }, 2000);
  };

  return (
    <>
      <Navbar />
      
      <MaxWidthWrapper className="mt-10 flex flex-col items-center justify-center text-center sm:mt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-charcoal sm:text-5xl">
            Upload Your <span className="text-christmasRed">Doorbell Video</span>
          </h1>
          <p className="mt-4 text-lg text-charcoal/70 font-body max-w-2xl">
            Upload your doorbell footage and we&apos;ll transform it into a magical Santa video for just £12.50
          </p>
        </div>

        {/* Upload Area */}
        <Card className="w-full max-w-2xl p-8 bg-cream border-2 border-warmGold/20 shadow-frost">
          <CardTitle className="text-2xl font-heading text-christmasRed mb-4">
            Choose Your Video
          </CardTitle>
          <CardDescription className="text-charcoal/70 font-body mb-6">
            Drag and drop your video file here, or click to browse
          </CardDescription>

          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
              dragActive 
                ? "border-christmasRed bg-christmasRed/5" 
                : "border-coolGray hover:border-christmasRed/50",
              file ? "border-green-500 bg-green-50" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              {file ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-8 h-8" />
                  <span className="font-body font-semibold">{file.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-christmasRed" />
                  <div className="text-center">
                    <p className="text-lg font-body font-semibold text-charcoal">
                      Drop your video here
                    </p>
                    <p className="text-sm text-charcoal/60 font-body">
                      or click to browse files
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* File Requirements */}
          <div className="mt-6 p-4 bg-lightFrost rounded-lg">
            <h3 className="font-heading font-semibold text-charcoal mb-2">File Requirements:</h3>
            <ul className="text-sm text-charcoal/70 font-body space-y-1">
              <li>• Video formats: MP4, MOV, AVI</li>
              <li>• Maximum file size: 100MB</li>
              <li>• Recommended duration: 5-30 seconds</li>
              <li>• Best results with clear, well-lit footage</li>
            </ul>
          </div>

          {/* Upload Button */}
          <div className="mt-8">
            {file && !uploadSuccess && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={cn(
                  buttonVariants({
                    size: "lg",
                    className: "w-full bg-christmasRed hover:bg-[#A71D23] text-white shadow-glow text-lg py-4"
                  })
                )}
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Continue to Payment - £12.50"
                )}
              </button>
            )}

            {uploadSuccess && (
              <div className="text-center p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-green-800 mb-2">
                  Upload Successful!
                </h3>
                <p className="text-green-700 font-body">
                  Your video has been uploaded. Redirecting to payment...
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Trust Signals */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Card className="p-6 bg-snowWhite border-2 border-warmGold/20 shadow-frost text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-heading font-semibold text-christmasRed mb-2">Secure Upload</h3>
            <p className="text-charcoal/70 font-body text-sm">
              Your video is encrypted and processed securely
            </p>
          </Card>
          
          <Card className="p-6 bg-snowWhite border-2 border-warmGold/20 shadow-frost text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-heading font-semibold text-christmasRed mb-2">Fast Processing</h3>
            <p className="text-charcoal/70 font-body text-sm">
              Receive your video within minutes
            </p>
          </Card>
          
          <Card className="p-6 bg-snowWhite border-2 border-warmGold/20 shadow-frost text-center">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="font-heading font-semibold text-christmasRed mb-2">Perfect Gift</h3>
            <p className="text-charcoal/70 font-body text-sm">
              Create magical Christmas memories
            </p>
          </Card>
        </div>
      </MaxWidthWrapper>

      <Footer />
    </>
  );
}
