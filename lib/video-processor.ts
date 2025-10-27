import { supabaseAdmin } from './supabase-client';
import { getAnalysisWithPrompts, updateOrderPaymentStatus } from './supabase-helpers';
import { createFreepikClient } from './freepik-client';
import { VideoGenerationOptions } from '@/types/freepik';
import { VideoProcessingUpdate } from '@/types/database';
import { sendVideoReadyEmail, sendVideoFailureEmail } from './email-service';

export interface VideoProcessingRequest {
  orderId: string;
  type: 'ai_generated' | 'direct_upload';
  analysisId?: string;
  promptId?: string;
  videoFileUrl?: string;
  videoDuration?: 5 | 10; // Optional duration setting
}

/**
 * Trigger video processing based on order type
 */
export async function triggerVideoProcessing(request: VideoProcessingRequest): Promise<void> {
  try {
    console.log(`Triggering video processing for order: ${request.orderId}`);

    // Update order status to processing with initial tracking
    await updateOrderProcessingStatus(request.orderId, 'processing', {
      freepikJobId: undefined,
      freepikStatus: undefined,
      retryCount: 0
    });

    if (request.type === 'ai_generated') {
      await triggerAIVideoGeneration(request);
    } else if (request.type === 'direct_upload') {
      await triggerDirectVideoProcessing(request);
    } else {
      throw new Error(`Unknown video processing type: ${request.type}`);
    }

  } catch (error) {
    console.error('Video processing trigger failed:', error);

    // Update order status to failed with error details
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    await updateOrderProcessingStatus(request.orderId, 'failed', {
      errorMessage
    });

    // Send failure notification
    await sendVideoFailureEmail(request.orderId, errorMessage);

    // You might want to send notification email about processing failure
    throw error;
  }
}

/**
 * Handle AI-generated video processing
 */
async function triggerAIVideoGeneration(request: VideoProcessingRequest): Promise<void> {
  const { orderId, analysisId, promptId } = request;

  if (!analysisId || !promptId) {
    throw new Error('Analysis ID and prompt ID are required for AI video generation');
  }

  try {
    // Fetch the analysis and prompt data
    const { data: analysisData } = await getAnalysisWithPrompts(analysisId);

    if (!analysisData) {
      throw new Error('Analysis data not found');
    }

    // Find the selected prompt
    const selectedPrompt = analysisData.video_prompts.find(p => p.id === promptId);
    if (!selectedPrompt) {
      throw new Error('Selected prompt not found');
    }

    // Get the image from storage
    let imageUrl: string;
    if (analysisData.image_storage_path) {
      const { data: imageData } = await supabaseAdmin.storage
        .from('scene-images')
        .createSignedUrl(analysisData.image_storage_path, 3600); // 1 hour expiry

      if (imageData?.signedUrl) {
        imageUrl = imageData.signedUrl;
      } else {
        throw new Error('Failed to get image URL');
      }
    } else {
      throw new Error('No image storage path found');
    }

    // Prepare video generation request
    const videoGenRequest = {
      orderId,
      imageUrl,
      prompt: selectedPrompt.prompt_text,
      sceneAnalysis: analysisData.analysis_data,
      metadata: {
        analysisId,
        promptId,
        promptTitle: selectedPrompt.prompt_title,
        confidenceScore: selectedPrompt.confidence_score
      }
    };

    // Call Freepik Kling 2.1 API for video generation
    const result = await generateSantaVideoWithFreepik({
      orderId,
      imageUrl,
      prompt: selectedPrompt.prompt_text,
      duration: request.videoDuration || 10,
      enhancePrompt: true,
      sceneAnalysis: analysisData.analysis_data, // Pass scene analysis for smart enhancement
      metadata: {
        analysisId,
        promptId,
        promptTitle: selectedPrompt.prompt_title || 'Santa Magic',
        confidenceScore: selectedPrompt.confidence_score || 80
      }
    });

    if (result.success && result.videoUrl) {
      // Store the video in Supabase and update order
      const storedVideoUrl = await storeGeneratedVideo(orderId, result.videoUrl);

      await updateOrderWithVideo(orderId, storedVideoUrl, {
        freepikVideoUrl: result.videoUrl,
        thumbnailUrl: result.thumbnailUrl,
        processingDuration: Math.floor((result.processingTimeMs || 0) / 1000)
      });

      // Send completion notification
      await sendVideoReadyEmail(orderId);
    } else {
      throw new Error(result.error || 'Video generation failed');
    }

    console.log(`AI video generation completed for order: ${orderId}`);

  } catch (error) {
    console.error('AI video generation failed:', error);
    throw error;
  }
}

/**
 * Handle direct video upload processing
 */
async function triggerDirectVideoProcessing(request: VideoProcessingRequest): Promise<void> {
  const { orderId, videoFileUrl } = request;

  if (!videoFileUrl) {
    throw new Error('Video file URL is required for direct upload processing');
  }

  try {
    // For direct uploads, you might still want to apply Santa magic
    // This would call your video processing service with the uploaded video
    const videoProcessRequest = {
      orderId,
      videoFileUrl,
      type: 'direct_upload' as const
    };

    const processedVideoUrl = await processDirectVideo(videoProcessRequest);

    // Update order with processed video
    await updateOrderWithVideo(orderId, processedVideoUrl);

    // Send completion notification
    await sendVideoReadyEmail(orderId);

    console.log(`Direct video processing completed for order: ${orderId}`);

  } catch (error) {
    console.error('Direct video processing failed:', error);
    throw error;
  }
}

/**
 * Update order processing status with Freepik-specific fields
 */
async function updateOrderProcessingStatus(
  orderId: string,
  status: 'processing' | 'completed' | 'failed',
  additionalData?: {
    freepikJobId?: string;
    freepikStatus?: string;
    errorMessage?: string;
    retryCount?: number;
  }
): Promise<void> {
  try {
    const updateData: any = {
      processing_status: status
    };

    // Map camelCase to snake_case for database columns
    if (additionalData?.freepikJobId !== undefined) {
      updateData.freepik_video_id = additionalData.freepikJobId;
    }
    if (additionalData?.freepikStatus !== undefined) {
      updateData.freepik_status = additionalData.freepikStatus;
    }
    if (additionalData?.errorMessage !== undefined) {
      updateData.error_message = additionalData.errorMessage;
    }
    if (additionalData?.retryCount !== undefined) {
      updateData.retry_count = additionalData.retryCount;
    }

    if (status === 'processing') {
      updateData.processing_started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.processing_completed_at = new Date().toISOString();
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update order processing status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Update order processing status error:', error);
    throw error;
  }
}

/**
 * Update order with processed video URL and Freepik details
 */
async function updateOrderWithVideo(
  orderId: string,
  videoUrl: string,
  additionalData?: {
    freepikVideoUrl?: string;
    thumbnailUrl?: string;
    processingDuration?: number;
  }
): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        processed_video_url: videoUrl,
        processing_status: 'completed',
        processing_completed_at: new Date().toISOString(),
        freepik_video_url: additionalData?.freepikVideoUrl,
        freepik_thumbnail_url: additionalData?.thumbnailUrl,
        processing_duration_seconds: additionalData?.processingDuration
      })
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update order with video:', error);
      throw error;
    }
  } catch (error) {
    console.error('Update order with video error:', error);
    throw error;
  }
}

/**
 * Generate Santa video using Freepik Kling 2.1 API
 */
async function generateSantaVideoWithFreepik(options: VideoGenerationOptions) {
  try {
    console.log(`Generating Santa video with Freepik for order: ${options.orderId}`);

    // Create Freepik client
    const freepikClient = createFreepikClient();

    // Update order with job submission status
    await updateOrderProcessingStatus(options.orderId, 'processing', {
      freepikStatus: 'queued'
    });

    // Generate video
    const result = await freepikClient.generateVideo(options);

    // Update order with final status
    if (result.success) {
      await updateOrderProcessingStatus(options.orderId, 'processing', {
        freepikJobId: result.jobId,
        freepikStatus: 'completed'
      });
    } else {
      await updateOrderProcessingStatus(options.orderId, 'failed', {
        freepikJobId: result.jobId,
        freepikStatus: 'failed',
        errorMessage: result.error
      });
    }

    return result;
  } catch (error) {
    console.error(`Freepik video generation error for order ${options.orderId}:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Video generation failed';
    await updateOrderProcessingStatus(options.orderId, 'failed', {
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Store generated video in Supabase storage
 */
async function storeGeneratedVideo(orderId: string, videoUrl: string): Promise<string> {
  try {
    console.log(`Storing generated video for order: ${orderId}`);

    // Download video from Freepik
    const freepikClient = createFreepikClient();
    const videoBuffer = await freepikClient.downloadVideo(videoUrl);

    // Generate file name
    const fileName = `${orderId}-santa-magic-${Date.now()}.mp4`;

    // Upload to Supabase storage
    const { data, error } = await supabaseAdmin.storage
      .from('generated-videos')
      .upload(fileName, videoBuffer, {
        contentType: 'video/mp4',
        upsert: false
      });

    if (error) {
      console.error('Video storage error:', error);
      throw new Error(`Failed to store video: ${error.message}`);
    }

    // Return public URL
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/generated-videos/${data.path}`;
    console.log(`Video stored successfully: ${publicUrl}`);

    return publicUrl;
  } catch (error) {
    console.error(`Failed to store video for order ${orderId}:`, error);
    // Fallback to original Freepik URL if storage fails
    console.log('Falling back to original Freepik URL');
    return videoUrl;
  }
}

/**
 * Process direct video upload
 * For direct uploads, we could still apply some processing
 * but for now, we'll just store it as-is
 */
async function processDirectVideo(request: {
  orderId: string;
  videoFileUrl: string;
  type: 'direct_upload';
}): Promise<string> {
  console.log('Processing direct video upload:', {
    orderId: request.orderId,
    type: request.type
  });

  try {
    // Download the uploaded video
    const response = await fetch(request.videoFileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download uploaded video: ${response.status}`);
    }

    const videoBuffer = await response.arrayBuffer();
    const fileName = `${request.orderId}-direct-upload-${Date.now()}.mp4`;

    // Store in Supabase
    const { data, error } = await supabaseAdmin.storage
      .from('generated-videos')
      .upload(fileName, videoBuffer, {
        contentType: 'video/mp4',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to store direct upload: ${error.message}`);
    }

    // Return public URL
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/generated-videos/${data.path}`;

  } catch (error) {
    console.error('Direct video processing error:', error);
    throw new Error('Direct video processing failed');
  }
}

