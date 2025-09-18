import { SceneAnalysis } from './scene-analysis';
import { FreepikJobStatus } from './freepik';

// Database table types
export interface SceneAnalysisDB {
  id: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  image_storage_path?: string;
  analysis_data: SceneAnalysis; // Structured analysis data
  doors?: Record<string, any>[];
  windows?: Record<string, any>[];
  decorations?: Record<string, any>;
  furniture?: string[];
  plants?: string[];
  layout?: Record<string, any>;
  suitability_score?: number;
  scene_complexity?: 'minimal' | 'moderate' | 'rich';
  processing_time_ms?: number;
}

export interface VideoPromptDB {
  id: string;
  scene_analysis_id: string;
  created_at: string;
  prompt_text: string;
  prompt_title?: string;
  prompt_category?: 'entrance' | 'delivery' | 'magical' | 'interactive' | 'departure';
  confidence_score?: number;
  elements_used?: string[];
  is_selected: boolean;
  is_user_edited: boolean;
  metadata?: Record<string, any>;
}

export interface OrderDB {
  id: string;
  created_at: string;
  updated_at: string;
  scene_analysis_id?: string;
  selected_prompt_id?: string;
  customer_email: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  amount_paid: number;
  currency: string;
  processed_video_url?: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_started_at?: string;
  processing_completed_at?: string;
  processing_duration_seconds?: number;
  // Freepik-specific fields
  freepik_video_id?: string; // Job ID from Freepik API
  freepik_status?: FreepikJobStatus; // Current Freepik job status
  freepik_video_url?: string; // Original video URL from Freepik
  freepik_thumbnail_url?: string; // Thumbnail URL from Freepik
  video_duration?: 5 | 10; // Requested video duration in seconds
  enhanced_prompt?: string; // The enhanced prompt sent to Freepik
  error_message?: string; // Error details if processing fails
  retry_count?: number; // Number of retry attempts
  last_retry_at?: string; // Timestamp of last retry attempt
  metadata?: Record<string, any>;
}

// Request/Response types for API endpoints
export interface StoreAnalysisRequest {
  imageBuffer: Buffer;
  imageType: string;
  analysisData: Record<string, any>;
  processingTimeMs?: number;
}

export interface StoreAnalysisResponse {
  success: boolean;
  analysisId?: string;
  imageUrl?: string;
  error?: string;
}

export interface StorePromptsRequest {
  analysisId: string;
  prompts: {
    text: string;
    title: string;
    category: string;
    confidence: number;
    elements: string[];
  }[];
}

export interface UpdatePromptSelectionRequest {
  analysisId: string;
  promptId: string;
}

export interface CreateOrderRequest {
  email: string;
  analysisId: string;
  selectedPromptId: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}

// Enhanced API response types
export interface EnhancedAnalysisResponse {
  success: boolean;
  analysisId?: string;
  analysis?: any; // SceneAnalysis from existing type
  prompts?: any[]; // VideoPrompt[] from existing type
  imageUrl?: string;
  error?: string;
  details?: string;
}

export interface GetAnalysisResponse {
  success: boolean;
  analysis?: SceneAnalysisDB & {
    video_prompts: VideoPromptDB[];
  };
  error?: string;
}

// Supabase query result types
export type SceneAnalysisWithPrompts = SceneAnalysisDB & {
  video_prompts: VideoPromptDB[];
};

export type OrderWithDetails = OrderDB & {
  scene_analysis?: SceneAnalysisDB;
  selected_prompt?: VideoPromptDB;
};

// Storage types
export interface ImageUploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

export interface SignedUrlResult {
  success: boolean;
  signedUrl?: string;
  error?: string;
}

// Video processing types
export interface VideoUploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

export interface VideoProcessingUpdate {
  orderId: string;
  status: 'processing' | 'completed' | 'failed';
  freepikJobId?: string;
  freepikStatus?: FreepikJobStatus;
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  processingDuration?: number;
}

export interface OrderProcessingMetrics {
  orderId: string;
  totalProcessingTime: number;
  freepikGenerationTime?: number;
  videoDownloadTime?: number;
  storageUploadTime?: number;
  retryCount: number;
  success: boolean;
  errorStage?: string;
}