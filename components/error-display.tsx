'use client';

import { AlertTriangle, RefreshCw, X, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ErrorDetails } from '@/lib/error-handler';

interface ErrorDisplayProps {
  error: ErrorDetails;
  onRetry?: () => void;
  onDismiss?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export default function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  isRetrying = false,
  className
}: ErrorDisplayProps) {
  const getErrorIcon = () => {
    switch (error.context) {
      case 'upload':
        return '📷';
      case 'scene-analysis':
        return '🔍';
      case 'prompts':
        return '🎬';
      case 'api':
        return '🌐';
      case 'database':
        return '💾';
      default:
        return '🎅';
    }
  };

  const getErrorColor = () => {
    return error.recoverable ? 'border-4 border-warmGold bg-gradient-to-r from-warmGold/10 to-orange-50' : 'border-4 border-christmasRed bg-gradient-to-r from-christmasRed/10 to-red-50';
  };

  const getErrorTitle = () => {
    switch (error.context) {
      case 'upload':
        return 'Ho ho ho! Upload Issue';
      case 'scene-analysis':
        return 'Santa Needs Clearer Photos';
      case 'prompts':
        return 'Elves Are Having Trouble';
      case 'api':
        return 'Connection to North Pole Lost';
      case 'database':
        return 'Naughty List Database Error';
      default:
        return 'Santa Needs Your Help!';
    }
  };

  return (
    <Card className={cn(
      'rounded-3xl shadow-[0_10px_0_rgba(139,0,0,1)] animate-shake relative overflow-hidden',
      getErrorColor(),
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl animate-bounce">{getErrorIcon()}</span>
            <CardTitle className="text-3xl font-heading font-bold text-christmasRed">
              {getErrorTitle()}
            </CardTitle>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Error Message */}
        <div className="relative p-6 bg-white border-4 border-christmasRed rounded-2xl shadow-[0_8px_0_rgba(139,0,0,1)] mb-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl animate-pulse">🎅</span>
            <div>
              <h3 className="font-heading text-2xl text-christmasRed uppercase font-bold mb-2">Oops!</h3>
              <p className="text-lg text-charcoal font-body font-medium">
                {error.message}
              </p>
            </div>
          </div>
        </div>

        {/* Error Code and Timestamp */}
        {(error.code || error.timestamp) && (
          <div className="text-xs text-red-500 font-mono mb-4 p-2 bg-red-100 rounded">
            {error.code && <div>Code: {error.code}</div>}
            {error.timestamp && (
              <div>Time: {new Date(error.timestamp).toLocaleString()}</div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {error.suggestions && error.suggestions.length > 0 && (
          <div className="mb-6 p-6 bg-gradient-to-r from-electricGreen/10 to-emerald-50 border-4 border-electricGreen rounded-2xl">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl animate-bounce">💡</span>
              <h4 className="text-2xl font-heading font-bold text-evergreen">
                Santa&apos;s Helpful Tips:
              </h4>
            </div>
            <ul className="text-lg text-evergreen font-body space-y-2 ml-12 font-medium">
              {error.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-warmGold font-bold">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {error.recoverable && onRetry && (
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              variant="electric"
              size="chunky"
            >
              {isRetrying ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 w-5 animate-spin" />
                  Elves are fixing this...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  🎄 Try Again
                </div>
              )}
            </Button>
          )}

          {onDismiss && (
            <Button
              variant="outline"
              size="chunky"
              onClick={onDismiss}
              className="border-4 border-christmasRed/30 text-christmasRed hover:bg-christmasRed/5 hover:scale-105"
            >
              ❌ Dismiss
            </Button>
          )}
        </div>

        {/* Non-recoverable error warning */}
        {!error.recoverable && (
          <div className="mt-6 p-6 bg-gradient-to-r from-christmasRed/10 to-red-100 border-4 border-christmasRed rounded-2xl animate-pulse">
            <div className="flex items-start gap-4">
              <span className="text-4xl animate-bounce">⚠️</span>
              <div>
                <h4 className="text-xl font-heading font-bold text-christmasRed mb-2">
                  Santa Needs Extra Help!
                </h4>
                <div className="text-lg text-christmasRed/80 font-body font-medium">
                  This issue needs the head elf&apos;s attention. Please contact support if the magic doesn&apos;t work.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}