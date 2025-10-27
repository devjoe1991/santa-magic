'use client';

import { useState } from 'react';
import { Copy, Edit3, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VideoPrompt, PromptDisplayProps } from '@/types/video-prompts';

export default function PromptDisplay({
  prompt,
  showDetails = true,
  allowEdit = true,
  onEdit,
  className
}: PromptDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEditStart = () => {
    if (!prompt) return;
    setEditedDescription(prompt.description);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (onEdit && editedDescription.trim()) {
      onEdit(editedDescription.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedDescription('');
  };

  const handleCopy = async () => {
    if (!prompt) return;

    try {
      await navigator.clipboard.writeText(prompt.description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
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

  const getCategoryLabel = (category: VideoPrompt['category']) => {
    const labels: Record<VideoPrompt['category'], string> = {
      'lighting_match': 'Lighting Match',
      'position_based': 'Position Based',
      'camera_adaptive': 'Camera Adaptive',
      'entrance': 'Entrance',
      'delivery': 'Delivery',
      'magical': 'Magical',
      'interactive': 'Interactive',
      'departure': 'Departure'
    };
    return labels[category] || category;
  };

  if (!prompt) {
    return (
      <Card className={cn('bg-lightFrost/30 border-2 border-dashed border-coolGray', className)}>
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="text-lg font-heading font-semibold text-charcoal/60 mb-2">
            No Prompt Selected
          </h3>
          <p className="text-charcoal/50 font-body">
            Choose a video prompt to see the magic happen
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'bg-cream border-2 border-warmGold/30 shadow-frost transition-all duration-300',
      'hover:shadow-gold hover:border-warmGold/50',
      className
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-heading text-christmasRed flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon(prompt.category)}</span>
              {prompt.title}
            </CardTitle>

            {showDetails && (
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-body border',
                  getConfidenceColor(prompt.confidence)
                )}>
                  {prompt.confidence}% match
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-body bg-evergreen/10 text-evergreen">
                  {getCategoryLabel(prompt.category)}
                </span>
                {prompt.duration && (
                  <span className="px-2 py-1 rounded-full text-xs font-body bg-frostBlue/20 text-charcoal">
                    {prompt.duration} scene
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 w-8 p-0 border-warmGold/30 hover:bg-warmGold/10",
                copied && "bg-green-50 border-green-300"
              )}
              title="Copy prompt"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-warmGold" />
              )}
            </button>

            {allowEdit && onEdit && (
              <button
                onClick={handleEditStart}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-8 w-8 p-0 border-evergreen/30 hover:bg-evergreen/10"
                )}
                title="Edit prompt"
              >
                <Edit3 className="w-3 h-3 text-evergreen" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-3 border-2 border-warmGold/20 rounded-lg resize-none font-body text-charcoal bg-snowWhite/50 focus:border-warmGold/50 focus:outline-none"
              rows={4}
              placeholder="Describe your perfect Santa video scene..."
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditSave}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-evergreen hover:bg-evergreen/80 text-white"
                )}
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleEditCancel}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-charcoal/20 text-charcoal hover:bg-charcoal/5"
                )}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Main Description */}
            <div className="p-4 bg-snowWhite/50 rounded-lg border border-warmGold/20">
              <p className="text-charcoal font-body leading-relaxed text-lg">
                &ldquo;{prompt.description}&rdquo;
              </p>
            </div>

            {/* Tags and Elements */}
            {showDetails && prompt.elements.length > 0 && (
              <div>
                <h4 className="text-sm font-heading font-semibold text-charcoal/70 mb-2">
                  Using Scene Elements:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prompt.elements.map((element, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-christmasRed/10 text-christmasRed rounded text-xs font-body"
                    >
                      {element}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Tags */}
            {showDetails && prompt.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-heading font-semibold text-charcoal/70 mb-2">
                  Scene Tags:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-warmGold/20 text-charcoal rounded text-xs font-body"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}