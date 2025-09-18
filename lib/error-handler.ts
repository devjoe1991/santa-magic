/**
 * Centralized error handling utilities for the Santa Doorbell Magic application
 */

export interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
  timestamp: string;
  recoverable: boolean;
  suggestions?: string[];
}

export class AppError extends Error {
  public code: string;
  public context: string;
  public recoverable: boolean;
  public suggestions: string[];

  constructor(
    message: string,
    code = 'UNKNOWN_ERROR',
    context = 'general',
    recoverable = true,
    suggestions: string[] = []
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.recoverable = recoverable;
    this.suggestions = suggestions;
  }

  toDetails(): ErrorDetails {
    return {
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: new Date().toISOString(),
      recoverable: this.recoverable,
      suggestions: this.suggestions
    };
  }
}

/**
 * Common error types for the application
 */
export const ErrorCodes = {
  // API Errors
  API_NETWORK_ERROR: 'API_NETWORK_ERROR',
  API_TIMEOUT: 'API_TIMEOUT',
  API_RATE_LIMIT: 'API_RATE_LIMIT',

  // Scene Analysis Errors
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  ANALYSIS_NO_CONTENT: 'ANALYSIS_NO_CONTENT',
  ANALYSIS_POOR_QUALITY: 'ANALYSIS_POOR_QUALITY',

  // Image Errors
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
  IMAGE_INVALID_FORMAT: 'IMAGE_INVALID_FORMAT',
  IMAGE_UPLOAD_FAILED: 'IMAGE_UPLOAD_FAILED',

  // Prompt Generation Errors
  PROMPTS_GENERATION_FAILED: 'PROMPTS_GENERATION_FAILED',
  PROMPTS_NO_SUITABLE: 'PROMPTS_NO_SUITABLE',
  PROMPTS_SAVE_FAILED: 'PROMPTS_SAVE_FAILED',

  // Database Errors
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
  DATABASE_OPERATION_FAILED: 'DATABASE_OPERATION_FAILED',

  // Authentication/Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
} as const;

/**
 * Create standardized error objects for common scenarios
 */
export const createError = {
  apiTimeout: () => new AppError(
    'The request took too long to complete. Please try again.',
    ErrorCodes.API_TIMEOUT,
    'api',
    true,
    ['Check your internet connection', 'Try again in a few moments']
  ),

  analysisNoContent: () => new AppError(
    'Could not detect any recognizable elements in your image.',
    ErrorCodes.ANALYSIS_NO_CONTENT,
    'scene-analysis',
    true,
    [
      'Ensure the image shows a clear doorway or entrance',
      'Use better lighting when taking the photo',
      'Try a different angle or closer view'
    ]
  ),

  imageTooBig: (maxSize: string) => new AppError(
    `Image file is too large. Maximum size allowed is ${maxSize}.`,
    ErrorCodes.IMAGE_TOO_LARGE,
    'upload',
    true,
    [
      `Compress your image to under ${maxSize}`,
      'Use a different image format (JPG/PNG)',
      'Take a new photo with lower resolution'
    ]
  ),

  invalidImageFormat: () => new AppError(
    'Invalid image format. Please use JPG, PNG, or WebP files.',
    ErrorCodes.IMAGE_INVALID_FORMAT,
    'upload',
    true,
    ['Convert your image to JPG or PNG format', 'Take a new photo']
  ),

  promptGenerationFailed: () => new AppError(
    'Could not generate video prompts for this scene.',
    ErrorCodes.PROMPTS_GENERATION_FAILED,
    'prompts',
    true,
    [
      'Try uploading a different image',
      'Ensure the image shows a clear doorway',
      'Use better lighting in your photo'
    ]
  ),

  networkError: () => new AppError(
    'Network connection error. Please check your internet and try again.',
    ErrorCodes.API_NETWORK_ERROR,
    'api',
    true,
    [
      'Check your internet connection',
      'Refresh the page and try again',
      'Try again in a few minutes'
    ]
  ),

  databaseError: () => new AppError(
    'Database operation failed. Please try again.',
    ErrorCodes.DATABASE_OPERATION_FAILED,
    'database',
    true,
    ['Try refreshing the page', 'Contact support if the problem persists']
  ),

  generic: (message: string, context = 'general') => new AppError(
    message,
    'GENERIC_ERROR',
    context,
    true,
    ['Please try again', 'Contact support if the problem persists']
  )
};

/**
 * Retry mechanism for recoverable operations
 */
export class RetryHandler {
  private maxRetries: number;
  private baseDelay: number;
  private maxDelay: number;

  constructor(maxRetries = 3, baseDelay = 1000, maxDelay = 5000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
  }

  async execute<T>(
    operation: () => Promise<T>,
    shouldRetry: (error: any) => boolean = () => true
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry on the last attempt or if error is not retryable
        if (attempt === this.maxRetries || !shouldRetry(error)) {
          throw error;
        }

        // Calculate delay with exponential backoff and jitter
        const delay = Math.min(
          this.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
          this.maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors are usually retryable
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true;
  }

  // Timeout errors are retryable
  if (error.code === ErrorCodes.API_TIMEOUT) {
    return true;
  }

  // Database connection errors are retryable
  if (error.code === ErrorCodes.DATABASE_CONNECTION_ERROR) {
    return true;
  }

  // Rate limit errors are retryable (after delay)
  if (error.code === ErrorCodes.API_RATE_LIMIT) {
    return true;
  }

  // HTTP 5xx errors are usually retryable
  if (error.status && error.status >= 500 && error.status < 600) {
    return true;
  }

  return false;
}

/**
 * Log errors for debugging and monitoring
 */
export function logError(error: ErrorDetails | AppError | Error, context?: string): void {
  const errorData = error instanceof AppError ? error.toDetails() : {
    message: error.message,
    context: context || 'unknown',
    timestamp: new Date().toISOString(),
    recoverable: true
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', errorData);
  }

  // In production, could send to monitoring service
  // Example: sendToSentry(errorData);
}

/**
 * Parse API error responses into AppError instances
 */
export function parseApiError(response: any, context = 'api'): AppError {
  if (response.error) {
    const suggestions = response.details ? [response.details] : [];
    return new AppError(
      response.error,
      response.code || 'API_ERROR',
      context,
      true,
      suggestions
    );
  }

  return new AppError(
    'An unexpected error occurred',
    'UNKNOWN_API_ERROR',
    context,
    true,
    ['Please try again', 'Contact support if the problem persists']
  );
}