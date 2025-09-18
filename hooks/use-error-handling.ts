import { useState, useCallback } from 'react';
import { AppError, ErrorDetails, logError, RetryHandler, isRetryableError } from '@/lib/error-handler';

interface UseErrorHandlingReturn {
  error: ErrorDetails | null;
  clearError: () => void;
  handleError: (error: any, context?: string) => void;
  executeWithRetry: <T>(
    operation: () => Promise<T>,
    context?: string,
    maxRetries?: number
  ) => Promise<T>;
  isRetrying: boolean;
}

export function useErrorHandling(): UseErrorHandlingReturn {
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any, context = 'general') => {
    let errorDetails: ErrorDetails;

    if (error instanceof AppError) {
      errorDetails = error.toDetails();
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Network error
      errorDetails = {
        message: 'Network connection error. Please check your internet and try again.',
        code: 'NETWORK_ERROR',
        context,
        timestamp: new Date().toISOString(),
        recoverable: true,
        suggestions: [
          'Check your internet connection',
          'Refresh the page and try again',
          'Try again in a few minutes'
        ]
      };
    } else {
      // Generic error
      errorDetails = {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        context,
        timestamp: new Date().toISOString(),
        recoverable: true,
        suggestions: ['Please try again', 'Contact support if the problem continues']
      };
    }

    setError(errorDetails);
    logError(errorDetails);
  }, []);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    context = 'operation',
    maxRetries = 3
  ): Promise<T> => {
    const retryHandler = new RetryHandler(maxRetries);
    clearError(); // Clear any previous errors
    setIsRetrying(true);

    try {
      const result = await retryHandler.execute(operation, isRetryableError);
      setIsRetrying(false);
      return result;
    } catch (error) {
      setIsRetrying(false);
      handleError(error, context);
      throw error;
    }
  }, [handleError, clearError]);

  return {
    error,
    clearError,
    handleError,
    executeWithRetry,
    isRetrying
  };
}