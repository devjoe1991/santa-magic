// Freepik API Types for Kling 2.1 Video Generation

export interface FreepikVideoGenerationRequest {
  image: string; // Base64 encoded image
  prompt: string;
  duration: 5 | 10; // Video duration in seconds
  cfg_scale?: number; // Control creativity vs adherence (0.1-1.0), default 0.5
  negative_prompt?: string; // What to avoid in generation
  seed?: number; // For reproducible results
  static_mask?: string; // Base64 mask defining motion areas
  dynamic_masks?: Array<{
    mask: string; // Base64 mask
    trajectories: Array<{ x: number; y: number }>; // Motion paths
  }>;
}

export interface FreepikVideoGenerationResponse {
  data: {
    task_id: string; // Task ID for polling
    status: 'CREATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    generated?: string[]; // Array of video URLs when completed
    error_message?: string; // Error message if failed
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
  duration?: 5 | 10; // Default to 10 seconds
  enhancePrompt?: boolean; // Whether to add Christmas enhancements
  aspectRatio?: '16:9' | '9:16' | '1:1';
  cfgScale?: number;
  sceneAnalysis?: any; // Scene analysis data for smart prompt enhancement
  userContext?: string; // User-provided scene context/constraints
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
    'Santa Claus',
    'red Santa suit',
    'Christmas magic',
    'holiday spirit'
  ],
  motionKeywords: [
    'gentle movement',
    'natural motion',
    'flowing animation',
    'smooth transitions',
    'graceful gestures'
  ],
  lightingKeywords: [
    'natural lighting',
    'consistent lighting',
    'original lighting'
  ],
  atmosphereKeywords: [
    'realistic atmosphere',
    'original environment',
    'unchanged setting'
  ],
  negativePrompts: [
    'camera movement',
    'camera moves',
    'scene change',
    'changing background',
    'santa popup',
    'santa overlay',
    'teleporting',
    'appearing instantly',
    'waving at camera',
    'looking at camera',
    'acknowledging camera',
    'posing for camera',
    'shh gesture',
    'interacting with camera',
    'notices camera',
    'realizes on camera',
    'gesturing to camera',
    'random person',
    'unknown man',
    'stranger',
    'regular person',
    'not santa',
    'wrong character',
    'different person',
    'walking backwards',
    'backward movement',
    'backing up',
    'moving backwards',
    'reversing direction',
    'moonwalking',
    'walking in reverse',
    'retreating backwards',
    'stepping backwards',
    'turning around mid-walk',
    'spinning around',
    'facing backwards',
    'backwards motion',
    'confused movement',
    'disoriented walking',
    'erratic movement',
    'wandering aimlessly',
    'uncertain direction',
    'hesitant walking',
    'indecisive movement'
  ]
};