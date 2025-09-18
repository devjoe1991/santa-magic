// Freepik API Types for Kling 2.1 Video Generation

export interface FreepikVideoGenerationRequest {
  image: string; // Base64 encoded image
  prompt: string;
  duration: 5 | 10; // Video duration in seconds
  mode?: 'fast' | 'pro'; // Generation mode, default to 'pro'
  aspect_ratio?: '16:9' | '9:16' | '1:1'; // Aspect ratio, auto-detect from image if not specified
  cfg_scale?: number; // Control creativity vs adherence (0.1-1.0), default 0.5
  negative_prompt?: string; // What to avoid in generation
  seed?: number; // For reproducible results
}

export interface FreepikVideoGenerationResponse {
  id: string; // Job ID for polling
  status: FreepikJobStatus;
  created_at: string;
  updated_at: string;
  config: {
    prompt: string;
    duration: number;
    mode: string;
    aspect_ratio: string;
    cfg_scale: number;
    negative_prompt?: string;
  };
  result?: {
    video_url: string;
    preview_url?: string;
    thumbnail_url?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export type FreepikJobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface FreepikStatusResponse {
  id: string;
  status: FreepikJobStatus;
  progress?: number; // Percentage completion (0-100)
  estimated_time_remaining?: number; // Seconds
  result?: {
    video_url: string;
    preview_url?: string;
    thumbnail_url?: string;
    duration: number;
    resolution: {
      width: number;
      height: number;
    };
    format: string;
    size_bytes: number;
  };
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface FreepikErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string;
  };
  request_id?: string;
}

export interface FreepikClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number; // Request timeout in ms
  maxRetries?: number; // Max retry attempts
  retryDelay?: number; // Delay between retries in ms
}

export interface VideoGenerationOptions {
  orderId: string;
  imageUrl: string;
  imageBase64?: string; // If already converted
  prompt: string;
  duration?: 5 | 10; // Default to 5 seconds
  enhancePrompt?: boolean; // Whether to add Christmas enhancements
  aspectRatio?: '16:9' | '9:16' | '1:1';
  cfgScale?: number;
  metadata?: {
    analysisId: string;
    promptId: string;
    promptTitle: string;
    confidenceScore: number;
  };
}

export interface VideoGenerationResult {
  success: boolean;
  jobId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  details?: string;
  processingTimeMs?: number;
}

// Enhanced prompt templates for Christmas magic
export interface ChristmasPromptEnhancement {
  qualityKeywords: string[];
  christmasKeywords: string[];
  motionKeywords: string[];
  lightingKeywords: string[];
  atmosphereKeywords: string[];
  negativePrompts: string[];
}

export const DEFAULT_CHRISTMAS_ENHANCEMENTS: ChristmasPromptEnhancement = {
  qualityKeywords: [
    'cinematic quality',
    'high resolution',
    'smooth motion',
    'realistic movement',
    'professional video',
    'detailed rendering'
  ],
  christmasKeywords: [
    'magical Christmas atmosphere',
    'festive holiday spirit',
    'warm Christmas glow',
    'holiday magic',
    'Christmas wonder',
    'seasonal joy'
  ],
  motionKeywords: [
    'gentle movement',
    'natural motion',
    'flowing animation',
    'smooth transitions',
    'graceful gestures'
  ],
  lightingKeywords: [
    'warm golden lighting',
    'soft Christmas lights',
    'magical sparkles',
    'cozy illumination',
    'festive glow'
  ],
  atmosphereKeywords: [
    'enchanting atmosphere',
    'dreamy ambiance',
    'magical environment',
    'Christmas spirit',
    'holiday warmth'
  ],
  negativePrompts: [
    'blurry',
    'distorted',
    'scary',
    'horror',
    'low quality',
    'pixelated',
    'choppy motion',
    'unnatural movement',
    'dark atmosphere',
    'creepy',
    'camera movement',
    'perspective change',
    'scene change',
    'different location',
    'studio setting',
    'indoor studio',
    'green screen',
    'artificial background',
    'zoom in',
    'zoom out',
    'camera pan',
    'camera tilt',
    'changing environment'
  ]
};