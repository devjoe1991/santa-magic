'use client';

import { useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import PromptDisplay from '@/components/prompt-display';
import { cn } from '@/lib/utils';
import { VideoPrompt, PromptSelectorProps } from '@/types/video-prompts';

interface PromptCardProps {
  prompt: VideoPrompt;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (newDescription: string) => void;
  isSelecting?: boolean;
  isEditing?: boolean;
}

function PromptCard({ prompt, isSelected, onSelect, onEdit, isSelecting = false, isEditing = false }: PromptCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'border-green-400 bg-green-50';
    if (confidence >= 60) return 'border-orange-400 bg-orange-50';
    return 'border-red-400 bg-red-50';
  };

  const getCategoryIcon = (category: VideoPrompt['category']) => {
    switch (category) {
      case 'lighting_match': return '💡';
      case 'position_based': return '📍';
      case 'camera_adaptive': return '📹';
      case 'entrance': return '🚪';
      case 'delivery': return '🎁';
      case 'magical': return '✨';
      case 'interactive': return '🤝';
      case 'departure': return '👋';
      default: return '🎬';
    }
  };


  return (
    <Card
      variant="festive"
      className={cn(
        isSelected
          ? 'border-christmasRed bg-christmasRed/5 shadow-glow'
          : 'border-electricGreen hover:border-warmGold/50',
        (isSelecting || isEditing) && 'opacity-75 pointer-events-none'
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getCategoryIcon(prompt.category)}</span>
            <CardTitle className="text-2xl font-heading font-bold text-charcoal">
              {prompt.title}
            </CardTitle>
          </div>
          <div className={cn(
            'px-2 py-1 rounded-full text-xs font-body border',
            getConfidenceColor(prompt.confidence)
          )}>
            {prompt.confidence}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-lg text-charcoal/80 font-body mb-3 font-medium">
          {prompt.description}
        </p>

        {prompt.elements.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {prompt.elements.slice(0, 3).map((element, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 bg-warmGold/20 text-charcoal rounded text-xs font-body"
              >
                {element}
              </span>
            ))}
            {prompt.elements.length > 3 && (
              <span className="px-1.5 py-0.5 bg-charcoal/10 text-charcoal/60 rounded text-xs font-body">
                +{prompt.elements.length - 3} more
              </span>
            )}
          </div>
        )}

        {isSelected && (
          <div className="mt-3 p-2 bg-christmasRed/10 rounded border border-christmasRed/20">
            <div className="flex items-center gap-1 text-christmasRed text-xs font-body">
              <Sparkles className="w-3 h-3" />
              Selected for your video
            </div>
          </div>
        )}

        {/* Loading states */}
        {(isSelecting || isEditing) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-christmasRed font-body">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-christmasRed"></div>
              {isSelecting ? 'Selecting...' : 'Saving...'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PromptSelector({
  prompts,
  selectedPrompt,
  onSelect,
  onEdit,
  onGenerateMore,
  isGenerating,
  maxSelection = 1,
  analysisId
}: PromptSelectorProps & { analysisId?: string }) {
  const [showAllPrompts, setShowAllPrompts] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handlePromptEdit = async (promptId: string, newDescription: string) => {
    if (!newDescription.trim() || newDescription.trim().length < 10) {
      return;
    }

    setIsEditing(promptId);

    try {
      const response = await fetch('/api/prompts/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId,
          newText: newDescription.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state via parent callback
        onEdit(promptId, newDescription.trim());
      } else {
        console.error('Failed to edit prompt:', result.error);
        // Could show a toast notification here
      }
    } catch (error) {
      console.error('Error editing prompt:', error);
    } finally {
      setIsEditing(null);
    }
  };

  const handlePromptSelect = async (prompt: VideoPrompt) => {
    // Always update local state immediately for responsive UI
    onSelect(prompt);

    // Optionally sync with backend if analysisId is available
    if (analysisId) {
      setIsSelecting(true);

      try {
        const response = await fetch('/api/prompts/select', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            analysisId,
            promptId: prompt.id
          })
        });

        const result = await response.json();

        if (!result.success) {
          console.error('Failed to sync prompt selection:', result.error);
          // UI state is already updated, so this is non-blocking
        }
      } catch (error) {
        console.error('Error syncing prompt selection:', error);
        // UI state is already updated, so this is non-blocking
      } finally {
        setIsSelecting(false);
      }
    }
  };

  const handleSelectedPromptEdit = (newDescription: string) => {
    if (selectedPrompt) {
      handlePromptEdit(selectedPrompt.id, newDescription);
    }
  };

  const handleGenerateMore = async () => {
    if (!analysisId || isGenerating) {
      // Fallback to parent callback for local generation
      onGenerateMore();
      return;
    }

    try {
      const response = await fetch('/api/prompts/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisId,
          additionalCount: 3
        })
      });

      const result = await response.json();

      if (result.success && result.newPrompts) {
        // Trigger parent callback to update prompts list
        onGenerateMore(result.newPrompts);
      } else {
        console.error('Failed to generate more prompts:', result.error);
        // Fallback to local generation
        onGenerateMore();
      }
    } catch (error) {
      console.error('Error generating more prompts:', error);
      // Fallback to local generation
      onGenerateMore();
    }
  };

  const displayedPrompts = showAllPrompts ? prompts : prompts.slice(0, 6);

  if (prompts.length === 0) {
    return (
      <Card className="bg-lightFrost/30 border-2 border-dashed border-coolGray">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">🎭</div>
          <h3 className="text-lg font-heading font-semibold text-charcoal/60 mb-2">
            No Prompts Generated
          </h3>
          <p className="text-charcoal/50 font-body mb-4">
            We couldn&apos;t generate prompts for this scene. Try analyzing again or upload a different photo.
          </p>
          <Button
            onClick={handleGenerateMore}
            disabled={isGenerating}
            variant="electric"
            size="sm"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isGenerating && "animate-spin")} />
            {isGenerating ? "Generating..." : "Try Again"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-heading font-bold text-christmasRed mb-4">
          🎬 Choose Your Santa Video Scene
        </h2>
        <p className="text-charcoal/70 font-body">
          Select the perfect magical moment for your personalized Santa video
        </p>
      </div>

      {/* Prompt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            isSelected={selectedPrompt?.id === prompt.id}
            onSelect={() => handlePromptSelect(prompt)}
            onEdit={(newDescription) => handlePromptEdit(prompt.id, newDescription)}
            isSelecting={isSelecting && selectedPrompt?.id === prompt.id}
            isEditing={isEditing === prompt.id}
          />
        ))}
      </div>

      {/* Show More / Generate More Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {prompts.length > 6 && !showAllPrompts && (
          <Button
            onClick={() => setShowAllPrompts(true)}
            variant="outline"
            size="chunky"
            className="border-4 border-warmGold text-warmGold hover:bg-warmGold hover:text-white hover:scale-105"
          >
            Show All {prompts.length} Prompts
          </Button>
        )}

        {showAllPrompts && prompts.length > 6 && (
          <Button
            onClick={() => setShowAllPrompts(false)}
            variant="outline"
            size="chunky"
            className="border-4 border-charcoal/20 text-charcoal hover:bg-charcoal/5 hover:scale-105"
          >
            Show Less
          </Button>
        )}

        <Button
          onClick={handleGenerateMore}
          disabled={isGenerating}
          variant="electric"
          size="chunky"
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isGenerating && "animate-spin")} />
          {isGenerating ? "Generating..." : "Generate More Options"}
        </Button>
      </div>

      {/* Selected Prompt Display */}
      {selectedPrompt && (
        <div className="mt-8">
          <h3 className="text-lg font-heading font-semibold text-evergreen mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Your Selected Scene
          </h3>
          <PromptDisplay
            prompt={selectedPrompt}
            showDetails={true}
            allowEdit={true}
            onEdit={handleSelectedPromptEdit}
          />
        </div>
      )}

      {/* Helper Text */}
      {!selectedPrompt && (
        <div className="text-center p-4 bg-frostBlue/10 rounded-lg border border-frostBlue/20">
          <p className="text-charcoal/70 font-body text-sm">
            💡 <strong>Tip:</strong> Click on any prompt card to select it, then customize the description if needed
          </p>
        </div>
      )}
    </div>
  );
}