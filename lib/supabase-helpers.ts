import { supabaseAdmin } from './supabase-client';
import { SceneAnalysis } from '@/types/scene-analysis';
import { VideoPrompt } from '@/types/video-prompts';
import {
  SceneAnalysisDB,
  VideoPromptDB,
  OrderDB,
  ImageUploadResult,
  SignedUrlResult,
  SceneAnalysisWithPrompts,
  OrderWithDetails,
  VideoUploadResult,
  VideoProcessingUpdate,
  OrderProcessingMetrics
} from '@/types/database';
import { FreepikJobStatus } from '@/types/freepik';

/**
 * Upload image to Supabase Storage
 */
export async function uploadImageToStorage(
  imageBuffer: Buffer,
  fileExtension: string
): Promise<ImageUploadResult> {
  try {
    const fileName = `scene-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

    const { data, error } = await supabaseAdmin.storage
      .from('scene-images')
      .upload(fileName, imageBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      path: data.path,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/scene-images/${data.path}`
    };
  } catch (error) {
    console.error('Upload image error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Store scene analysis in database
 */
export async function storeSceneAnalysis(
  analysis: SceneAnalysis,
  imageStoragePath?: string,
  processingTimeMs?: number
): Promise<{ success: boolean; analysisId?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('scene_analyses')
      .insert({
        image_storage_path: imageStoragePath,
        analysis_data: analysis,
        doors: analysis.doors,
        windows: analysis.windows,
        decorations: analysis.decorations,
        furniture: analysis.furniture,
        plants: analysis.plants,
        layout: analysis.layout,
        suitability_score: analysis.suitabilityScore,
        scene_complexity: 'moderate', // Could be calculated from analysis
        processing_time_ms: processingTimeMs
      })
      .select('id')
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, analysisId: data.id };
  } catch (error) {
    console.error('Store analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Storage failed'
    };
  }
}

/**
 * Store generated prompts in database
 */
export async function storePrompts(
  analysisId: string,
  prompts: VideoPrompt[]
): Promise<{ success: boolean; promptIds?: string[]; error?: string }> {
  try {
    const promptsData = prompts.map(prompt => ({
      scene_analysis_id: analysisId,
      prompt_text: prompt.description,
      prompt_title: prompt.title,
      prompt_category: prompt.category,
      confidence_score: prompt.confidence,
      elements_used: prompt.elements,
      is_selected: false,
      is_user_edited: false,
      metadata: {
        tags: prompt.tags,
        duration: prompt.duration
      }
    }));

    const { data, error } = await supabaseAdmin
      .from('video_prompts')
      .insert(promptsData)
      .select('id');

    if (error) {
      console.error('Store prompts error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      promptIds: data.map(item => item.id)
    };
  } catch (error) {
    console.error('Store prompts error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store prompts'
    };
  }
}

/**
 * Get analysis with prompts by ID
 */
export async function getAnalysisWithPrompts(
  analysisId: string
): Promise<{ success: boolean; data?: SceneAnalysisWithPrompts; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('scene_analyses')
      .select(`
        *,
        video_prompts (*)
      `)
      .eq('id', analysisId)
      .single();

    if (error) {
      console.error('Get analysis error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Get analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve analysis'
    };
  }
}

/**
 * Update prompt selection
 */
export async function updatePromptSelection(
  analysisId: string,
  promptId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, deselect all prompts for this analysis
    const { error: deselectError } = await supabaseAdmin
      .from('video_prompts')
      .update({ is_selected: false })
      .eq('scene_analysis_id', analysisId);

    if (deselectError) {
      return { success: false, error: deselectError.message };
    }

    // Then select the chosen prompt
    const { error: selectError } = await supabaseAdmin
      .from('video_prompts')
      .update({ is_selected: true })
      .eq('id', promptId);

    if (selectError) {
      return { success: false, error: selectError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update prompt selection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update selection'
    };
  }
}

/**
 * Update prompt text (user edit)
 */
export async function updatePromptText(
  promptId: string,
  newText: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('video_prompts')
      .update({
        prompt_text: newText,
        is_user_edited: true
      })
      .eq('id', promptId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update prompt text error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update prompt'
    };
  }
}

/**
 * Create order
 */
export async function createOrder(
  email: string,
  analysisId: string,
  selectedPromptId: string
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_email: email,
        scene_analysis_id: analysisId,
        selected_prompt_id: selectedPromptId,
        payment_status: 'pending',
        amount_paid: 12.50,
        currency: 'GBP',
        processing_status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Create order error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, orderId: data.id };
  } catch (error) {
    console.error('Create order error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order'
    };
  }
}

/**
 * Get order with details
 */
export async function getOrderWithDetails(
  orderId: string
): Promise<{ success: boolean; data?: OrderWithDetails; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        scene_analysis:scene_analyses (*),
        selected_prompt:video_prompts (*)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Get order error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Get order error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve order'
    };
  }
}

/**
 * Update order payment status
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  status: 'completed' | 'failed' | 'refunded',
  stripePaymentIntentId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { payment_status: status };
    if (stripePaymentIntentId) {
      updateData.stripe_payment_intent_id = stripePaymentIntentId;
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update payment status error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update payment status'
    };
  }
}

/**
 * Get signed URL for image
 */
export async function getSignedImageUrl(
  imagePath: string,
  expiresInSeconds: number = 3600
): Promise<SignedUrlResult> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('scene-images')
      .createSignedUrl(imagePath, expiresInSeconds);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch (error) {
    console.error('Get signed URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate signed URL'
    };
  }
}

/**
 * Clean up orphaned analysis (if something fails)
 */
export async function cleanupAnalysis(analysisId: string): Promise<void> {
  try {
    // Delete analysis and related prompts (cascade will handle prompts)
    await supabaseAdmin
      .from('scene_analyses')
      .delete()
      .eq('id', analysisId);
  } catch (error) {
    console.error('Cleanup analysis error:', error);
  }
}

/**
 * Clean up orphaned image (if something fails)
 */
export async function cleanupImage(imagePath: string): Promise<void> {
  try {
    await supabaseAdmin.storage
      .from('scene-images')
      .remove([imagePath]);
  } catch (error) {
    console.error('Cleanup image error:', error);
  }
}

// ===== VIDEO PROCESSING HELPERS =====

/**
 * Upload generated video to Supabase Storage
 */
export async function uploadVideoToStorage(
  videoBuffer: Buffer,
  fileName: string,
  contentType: string = 'video/mp4'
): Promise<VideoUploadResult> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('generated-videos')
      .upload(fileName, videoBuffer, {
        contentType,
        upsert: false
      });

    if (error) {
      console.error('Video upload error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      path: data.path,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/generated-videos/${data.path}`
    };
  } catch (error) {
    console.error('Upload video error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Update order with Freepik job details
 */
export async function updateOrderFreepikStatus(
  orderId: string,
  update: {
    freepikVideoId?: string;
    freepikStatus?: FreepikJobStatus;
    freepikVideoUrl?: string;
    freepikThumbnailUrl?: string;
    enhancedPrompt?: string;
    videoDuration?: 5 | 10;
    errorMessage?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {};

    if (update.freepikVideoId !== undefined) updateData.freepik_video_id = update.freepikVideoId;
    if (update.freepikStatus !== undefined) updateData.freepik_status = update.freepikStatus;
    if (update.freepikVideoUrl !== undefined) updateData.freepik_video_url = update.freepikVideoUrl;
    if (update.freepikThumbnailUrl !== undefined) updateData.freepik_thumbnail_url = update.freepikThumbnailUrl;
    if (update.enhancedPrompt !== undefined) updateData.enhanced_prompt = update.enhancedPrompt;
    if (update.videoDuration !== undefined) updateData.video_duration = update.videoDuration;
    if (update.errorMessage !== undefined) updateData.error_message = update.errorMessage;

    const { error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update Freepik status error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update Freepik status'
    };
  }
}

/**
 * Get order processing status with Freepik details
 */
export async function getOrderProcessingStatus(
  orderId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        processing_status,
        freepik_video_id,
        freepik_status,
        processing_started_at,
        processing_completed_at,
        processing_duration_seconds,
        processed_video_url,
        freepik_video_url,
        freepik_thumbnail_url,
        enhanced_prompt,
        video_duration,
        error_message,
        retry_count,
        last_retry_at,
        customer_email
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Get processing status error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Get processing status error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get processing status'
    };
  }
}

/**
 * Update order processing metrics
 */
export async function updateOrderProcessingMetrics(
  orderId: string,
  metrics: {
    processingDurationSeconds?: number;
    retryCount?: number;
    lastRetryAt?: string;
    errorStage?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {};

    if (metrics.processingDurationSeconds !== undefined) {
      updateData.processing_duration_seconds = metrics.processingDurationSeconds;
    }
    if (metrics.retryCount !== undefined) {
      updateData.retry_count = metrics.retryCount;
    }
    if (metrics.lastRetryAt !== undefined) {
      updateData.last_retry_at = metrics.lastRetryAt;
    }
    if (metrics.errorStage !== undefined) {
      updateData.error_message = `Error in ${metrics.errorStage}: ${updateData.error_message || 'Unknown error'}`;
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update processing metrics error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update metrics'
    };
  }
}

/**
 * Get signed URL for generated video
 */
export async function getSignedVideoUrl(
  videoPath: string,
  expiresInSeconds: number = 7200 // 2 hours default
): Promise<SignedUrlResult> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('generated-videos')
      .createSignedUrl(videoPath, expiresInSeconds);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch (error) {
    console.error('Get signed video URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate signed URL'
    };
  }
}

/**
 * Clean up generated video (if something fails)
 */
export async function cleanupVideo(videoPath: string): Promise<void> {
  try {
    await supabaseAdmin.storage
      .from('generated-videos')
      .remove([videoPath]);
  } catch (error) {
    console.error('Cleanup video error:', error);
  }
}

/**
 * Get processing metrics for monitoring
 */
export async function getProcessingMetrics(
  timeframe: 'hour' | 'day' | 'week' = 'day'
): Promise<{
  success: boolean;
  data?: {
    totalOrders: number;
    completedOrders: number;
    failedOrders: number;
    processingOrders: number;
    averageProcessingTime: number;
    successRate: number;
  };
  error?: string;
}> {
  try {
    let timeQuery = '';
    switch (timeframe) {
      case 'hour':
        timeQuery = "created_at >= NOW() - INTERVAL '1 hour'";
        break;
      case 'day':
        timeQuery = "created_at >= NOW() - INTERVAL '1 day'";
        break;
      case 'week':
        timeQuery = "created_at >= NOW() - INTERVAL '1 week'";
        break;
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('processing_status, processing_duration_seconds')
      .eq('payment_status', 'completed');

    if (error) {
      return { success: false, error: error.message };
    }

    const totalOrders = data.length;
    const completedOrders = data.filter(o => o.processing_status === 'completed').length;
    const failedOrders = data.filter(o => o.processing_status === 'failed').length;
    const processingOrders = data.filter(o => o.processing_status === 'processing').length;

    const completedWithDuration = data.filter(o =>
      o.processing_status === 'completed' && o.processing_duration_seconds
    );

    const averageProcessingTime = completedWithDuration.length > 0
      ? completedWithDuration.reduce((sum, o) => sum + (o.processing_duration_seconds || 0), 0) / completedWithDuration.length
      : 0;

    const successRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    return {
      success: true,
      data: {
        totalOrders,
        completedOrders,
        failedOrders,
        processingOrders,
        averageProcessingTime,
        successRate
      }
    };
  } catch (error) {
    console.error('Get processing metrics error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get metrics'
    };
  }
}