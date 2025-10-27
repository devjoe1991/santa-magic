export interface VideoPrompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  confidence: number; // 0-100 based on how well it matches the scene
  elements: string[]; // Scene elements used in this prompt
  category: 'lighting_match' | 'position_based' | 'camera_adaptive' | 'entrance' | 'delivery' | 'magical' | 'interactive' | 'departure';
  duration?: 'quick' | 'medium' | 'lingering'; // Suggested video duration style
}

export interface PromptGeneratorConfig {
  maxPrompts: number; // Default: 5
  minPrompts: number; // Default: 3
  includeTimeOfDay: boolean;
  includeSeason: boolean;
  emphasizeChristmas: boolean; // Boost Christmas-themed prompts if decorations detected
}

export interface PromptTemplate {
  id: string;
  category: VideoPrompt['category'];
  baseDescription: string;
  requiredElements: string[]; // Elements that must be present
  optionalElements: string[]; // Elements that enhance the prompt
  confidence: number; // Base confidence score
  variations: string[]; // Alternative phrasings
}

export interface PromptGenerationResult {
  prompts: VideoPrompt[];
  totalGenerated: number;
  sceneComplexity: 'minimal' | 'moderate' | 'rich';
  primaryElements: string[];
  suggestions: string[]; // Suggestions for better scene if needed
}

export interface PromptSelectorProps {
  prompts: VideoPrompt[];
  selectedPrompt: VideoPrompt | null;
  onSelect: (prompt: VideoPrompt) => void;
  onEdit: (promptId: string, newDescription: string) => void;
  onGenerateMore: (newPrompts?: VideoPrompt[]) => void;
  isGenerating: boolean;
  analysisId?: string;
  maxSelection?: number; // Default: 1, but could allow multiple for comparison
}

export interface PromptDisplayProps {
  prompt: VideoPrompt | null;
  showDetails?: boolean;
  allowEdit?: boolean;
  onEdit?: (newDescription: string) => void;
  className?: string;
}