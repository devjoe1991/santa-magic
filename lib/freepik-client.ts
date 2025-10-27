import {
  FreepikVideoGenerationRequest,
  FreepikVideoGenerationResponse,
  FreepikStatusResponse,
  FreepikErrorResponse,
  FreepikClientConfig,
  VideoGenerationOptions,
  VideoGenerationResult,
  FreepikJobStatus,
  DEFAULT_CHRISTMAS_ENHANCEMENTS
} from '@/types/freepik';

export class FreepikClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: FreepikClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.freepik.com';
    this.timeout = config.timeout || 30000; // 30 seconds
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000; // 1 second
  }

  /**
   * Generate video using Kling 2.1 model
   */
  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    const startTime = Date.now();

    try {
      console.log(`Starting video generation for order: ${options.orderId}`);

      // Convert image to base64 if not already provided
      let imageBase64 = options.imageBase64;
      if (!imageBase64 && options.imageUrl) {
        imageBase64 = await this.imageUrlToBase64(options.imageUrl);
      }

      if (!imageBase64) {
        return {
          success: false,
          error: 'No image data provided or failed to convert image'
        };
      }

      // Enhance prompt with Christmas magic if requested
      const prompt = options.enhancePrompt
        ? this.enhancePromptForChristmas(options.prompt, options.sceneAnalysis)
        : options.prompt;

      // Prepare the request
      const request: FreepikVideoGenerationRequest = {
        image: imageBase64,
        prompt,
        duration: options.duration || 10,
        cfg_scale: options.cfgScale || 0.8,
        negative_prompt: DEFAULT_CHRISTMAS_ENHANCEMENTS.negativePrompts.join(', ')
      };

      console.log(`Submitting video generation request:`, {
        orderId: options.orderId,
        promptLength: prompt.length,
        duration: request.duration,
        cfgScale: request.cfg_scale
      });

      // Submit the generation request
      const response = await this.submitGenerationRequest(request);

      if (!response.success || !response.jobId) {
        return {
          success: false,
          error: response.error || 'Failed to submit generation request'
        };
      }

      console.log(`Generation submitted with job ID: ${response.jobId}`);

      // Poll for completion
      const result = await this.pollForCompletion(response.jobId, options.orderId);

      const processingTime = Date.now() - startTime;
      console.log(`Video generation ${result.success ? 'completed' : 'failed'} in ${processingTime}ms for order: ${options.orderId}`);

      return {
        ...result,
        processingTimeMs: processingTime
      };

    } catch (error) {
      console.error(`Video generation error for order ${options.orderId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Submit video generation request to Freepik API
   */
  private async submitGenerationRequest(request: FreepikVideoGenerationRequest): Promise<{
    success: boolean;
    jobId?: string;
    error?: string;
  }> {
    const url = `${this.baseUrl}/v1/ai/image-to-video/kling-v2-1-pro`;

    const requestBody = {
      image: request.image,
      prompt: request.prompt,
      duration: request.duration.toString(), // Convert to string as per API docs
      cfg_scale: request.cfg_scale,
      negative_prompt: request.negative_prompt,
      ...(request.seed && { seed: request.seed }),
      ...(request.static_mask && { static_mask: request.static_mask }),
      ...(request.dynamic_masks && { dynamic_masks: request.dynamic_masks })
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`Generation request attempt ${attempt}/${this.maxRetries}`);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'x-freepik-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'User-Agent': 'Santa-Magic/1.0'
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(this.timeout)
        });

        const responseText = await response.text();
        console.log(`Freepik API response status: ${response.status}`);

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData: FreepikErrorResponse = JSON.parse(responseText);
            errorMessage = errorData.error?.message || errorMessage;
          } catch {
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        let responseData: any;
        try {
          responseData = JSON.parse(responseText);
        } catch {
          throw new Error('Invalid JSON response from Freepik API');
        }

        console.log('Freepik API response:', responseData);

        // Handle error responses
        if (responseData.error) {
          throw new Error(responseData.error.message || 'API error occurred');
        }

        // Extract task_id from wrapped response
        const taskId = responseData.data?.task_id || responseData.task_id;
        if (!taskId) {
          throw new Error('No task_id received from Freepik API');
        }

        return {
          success: true,
          jobId: taskId
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Generation request attempt ${attempt} failed:`, lastError.message);

        if (attempt < this.maxRetries) {
          console.log(`Retrying in ${this.retryDelay}ms...`);
          await this.sleep(this.retryDelay);
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'All retry attempts failed'
    };
  }

  /**
   * Poll for generation completion
   */
  private async pollForCompletion(jobId: string, orderId: string): Promise<VideoGenerationResult> {
    const maxWaitTime = 10 * 60 * 1000; // 10 minutes
    const pollInterval = 10000; // 10 seconds
    const startTime = Date.now();

    console.log(`Starting polling for job ${jobId} (order: ${orderId})`);

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const status = await this.checkGenerationStatus(jobId);

        console.log(`Job ${jobId} status: ${status.status}${status.progress ? ` (${status.progress}%)` : ''}`);

        switch (status.status) {
          case 'completed':
            if (status.result?.video_url) {
              console.log(`Video generation completed successfully for job ${jobId}. Video URL: ${status.result.video_url}`);
              return {
                success: true,
                jobId,
                videoUrl: status.result.video_url,
                thumbnailUrl: status.result.thumbnail_url
              };
            } else {
              console.error(`Generation marked as completed but no video URL received for job ${jobId}`);
              return {
                success: false,
                jobId,
                error: 'Generation completed but no video URL received'
              };
            }

          case 'failed':
          case 'cancelled':
            const errorMsg = status.error?.message || `Generation ${status.status}`;
            console.error(`Video generation ${status.status} for job ${jobId}: ${errorMsg}`);
            return {
              success: false,
              jobId,
              error: errorMsg,
              details: status.error?.details
            };

          case 'queued':
          case 'processing':
            console.log(`Job ${jobId} still ${status.status}, continuing to poll...`);
            // Continue polling
            break;

          default:
            console.warn(`Unknown status for job ${jobId}: ${status.status}`);
        }

        // Wait before next poll
        await this.sleep(pollInterval);

      } catch (error) {
        console.error(`Polling error for job ${jobId}:`, error);
        // Continue polling unless we're near timeout
        if (Date.now() - startTime > maxWaitTime - pollInterval) {
          return {
            success: false,
            jobId,
            error: 'Polling failed near timeout'
          };
        }
        await this.sleep(pollInterval);
      }
    }

    return {
      success: false,
      jobId,
      error: 'Generation timed out after 10 minutes'
    };
  }

  /**
   * Check the status of a video generation job
   */
  async checkGenerationStatus(jobId: string): Promise<FreepikStatusResponse> {
    const url = `${this.baseUrl}/v1/ai/image-to-video/kling-v2-1/${jobId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-freepik-api-key': this.apiKey,
        'User-Agent': 'Santa-Magic/1.0'
      },
      signal: AbortSignal.timeout(this.timeout)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status check failed: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log(`Status check response for ${jobId}:`, responseData);

    // Extract data from wrapped response
    const data = responseData.data || responseData;

    // Map API status to our expected format
    const statusMap: Record<string, FreepikJobStatus> = {
      'CREATED': 'queued',
      'PROCESSING': 'processing',
      'COMPLETED': 'completed',
      'FAILED': 'failed',
      'CANCELLED': 'cancelled'
    };

    const mappedStatus = statusMap[data.status] || data.status.toLowerCase();

    // Build response in expected format
    const result: FreepikStatusResponse = {
      id: data.task_id || jobId,
      status: mappedStatus,
      created_at: '',
      updated_at: ''
    };

    // Handle completed status with video URL
    if (mappedStatus === 'completed' && data.generated && data.generated.length > 0) {
      result.result = {
        video_url: data.generated[0],
        thumbnail_url: data.generated[0], // Use video URL as thumbnail for now
        duration: 5,
        resolution: { width: 1280, height: 720 },
        format: 'mp4',
        size_bytes: 0
      };
    }

    // Handle error status with detailed logging
    if (mappedStatus === 'failed') {
      // Log the full response to help debug
      console.error(`Freepik job ${jobId} FAILED. Full response data:`, JSON.stringify(data, null, 2));

      result.error = {
        code: data.error_code || 'generation_failed',
        message: data.error_message || data.message || 'Video generation failed',
        details: data.error_details || data.details
      };
    }

    return result;
  }

  /**
   * Convert image URL to base64
   */
  private async imageUrlToBase64(imageUrl: string): Promise<string> {
    console.log('Converting image URL to base64...');

    try {
      const response = await fetch(imageUrl, {
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');

      // Detect content type from response headers
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error('Image conversion error:', error);
      throw new Error(`Failed to convert image to base64: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Enhance prompt with strict requirements to ensure Santa always appears naturally
   */
  private enhancePromptForChristmas(originalPrompt: string, sceneAnalysis?: any): string {
    // Build a concise, focused prompt that won't overwhelm the API
    let enhanced = `Security camera footage. ${originalPrompt}. `;

    // Core Santa appearance - CONCISE but specific
    enhanced += `Traditional Father Christmas: plush red velvet suit, white fur trim, long white beard, rosy cheeks. `;
    enhanced += `Carrying large burlap sack of presents (NOT shopping bag). `;
    enhanced += `Sneaking stealthily, unaware of camera, never looks at lens. `;

    // Minimal scene adaptation
    if (sceneAnalysis?.layout) {
      const { cameraType, colorGrading } = sceneAnalysis.layout;

      if (cameraType === 'night_vision' || colorGrading === 'green_tint') {
        enhanced += `Green night vision footage style. `;
      } else if (cameraType === 'black_white' || colorGrading === 'grayscale') {
        enhanced += `Black and white security camera. `;
      }
    }

    // Essential technical requirements - BRIEF
    enhanced += `Static camera, no movement. Natural shadows. Realistic scale and depth.`;

    console.log('Enhanced prompt:', {
      original: originalPrompt.substring(0, 100) + '...',
      enhanced: enhanced.substring(0, 200) + '...',
      fullLength: enhanced.length,
      hasSceneAnalysis: !!sceneAnalysis
    });

    return enhanced;
  }

  /**
   * Download generated video and return as buffer
   */
  async downloadVideo(videoUrl: string): Promise<Buffer> {
    console.log('Downloading generated video...');

    const response = await fetch(videoUrl, {
      signal: AbortSignal.timeout(60000) // 60 seconds for video download
    });

    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Utility function to sleep/wait
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Factory function to create FreepikClient
export function createFreepikClient(): FreepikClient {
  const apiKey = process.env.FREEPIK_API_KEY;

  if (!apiKey) {
    throw new Error('FREEPIK_API_KEY environment variable is required');
  }

  return new FreepikClient({
    apiKey,
    maxRetries: 3,
    timeout: 30000,
    retryDelay: 1000
  });
}

// Utility function for testing API connection
export async function testFreepikConnection(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    createFreepikClient();
    // We can't easily test the video endpoint without submitting a job
    // So we'll just validate the client creation
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Connection test failed'
    };
  }
}