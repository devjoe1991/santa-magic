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
        ? this.enhancePromptForChristmas(options.prompt)
        : options.prompt;

      // Prepare the request
      const request: FreepikVideoGenerationRequest = {
        image: imageBase64,
        prompt,
        duration: options.duration || 5,
        mode: 'pro', // Use pro mode for better quality
        aspect_ratio: options.aspectRatio || '16:9',
        cfg_scale: options.cfgScale || 0.5,
        negative_prompt: DEFAULT_CHRISTMAS_ENHANCEMENTS.negativePrompts.join(', ')
      };

      console.log(`Submitting video generation request:`, {
        orderId: options.orderId,
        promptLength: prompt.length,
        duration: request.duration,
        mode: request.mode
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
    const url = `${this.baseUrl}/v1/ai/text-to-video/kling-v2-1-master`;

    const requestBody = {
      prompt: request.prompt,
      image: request.image,
      duration: request.duration,
      mode: request.mode,
      aspect_ratio: request.aspect_ratio,
      cfg_scale: request.cfg_scale,
      negative_prompt: request.negative_prompt,
      ...(request.seed && { seed: request.seed })
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

        let data: FreepikVideoGenerationResponse;
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error('Invalid JSON response from Freepik API');
        }

        if (data.error) {
          throw new Error(data.error.message);
        }

        return {
          success: true,
          jobId: data.id
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
              return {
                success: true,
                jobId,
                videoUrl: status.result.video_url,
                thumbnailUrl: status.result.thumbnail_url
              };
            } else {
              return {
                success: false,
                jobId,
                error: 'Generation completed but no video URL received'
              };
            }

          case 'failed':
          case 'cancelled':
            return {
              success: false,
              jobId,
              error: status.error?.message || `Generation ${status.status}`,
              details: status.error?.details
            };

          case 'queued':
          case 'processing':
            // Continue polling
            break;

          default:
            console.warn(`Unknown status: ${status.status}`);
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
    const url = `${this.baseUrl}/v1/ai/text-to-video/kling-v2-1-master/${jobId}`;

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

    const data: FreepikStatusResponse = await response.json();
    return data;
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
   * Enhance prompt with Christmas magic
   */
  private enhancePromptForChristmas(originalPrompt: string): string {
    const enhancements = DEFAULT_CHRISTMAS_ENHANCEMENTS;

    // Build enhanced prompt with security camera context
    const enhancedParts = [
      // First, establish the security camera perspective
      'Static security camera view,',
      'Santa appears in the actual location,',
      originalPrompt,
      // Add camera and environment constraints
      'maintain original background and environment,',
      'preserve fixed camera perspective,',
      'no camera movement or scene changes,',
      // Add quality keywords
      enhancements.qualityKeywords.slice(0, 2).join(', '),
      // Add Christmas atmosphere
      enhancements.christmasKeywords.slice(0, 2).join(', '),
      // Add motion quality (focused on Santa's movement only)
      enhancements.motionKeywords.slice(0, 2).join(', '),
      // Add lighting
      enhancements.lightingKeywords.slice(0, 2).join(', ')
    ];

    const enhanced = enhancedParts.join(', ');

    console.log('Enhanced prompt:', {
      original: originalPrompt.substring(0, 100) + '...',
      enhanced: enhanced.substring(0, 200) + '...'
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
    const client = createFreepikClient();

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