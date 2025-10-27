import { SceneAnalysis } from '@/types/scene-analysis';
import {
  VideoPrompt,
  PromptTemplate,
  PromptGeneratorConfig,
  PromptGenerationResult
} from '@/types/video-prompts';
import { randomUUID } from 'crypto';

// Default configuration
const DEFAULT_CONFIG: PromptGeneratorConfig = {
  maxPrompts: 5,
  minPrompts: 3,
  includeTimeOfDay: true,
  includeSeason: true,
  emphasizeChristmas: true,
};

// STEALTH-FOCUSED TEMPLATES - Santa sneaking and avoiding detection
// Outdoor stealth - Santa leaving after delivery
const OUTDOOR_STEALTH_TEMPLATES: PromptTemplate[] = [
  {
    id: 'santa-sneaking-left',
    category: 'position_based',
    baseDescription: 'Santa sneaking away to the left',
    requiredElements: [],
    optionalElements: ['doors'],
    confidence: 98,
    variations: [
      'sneaking away to the left after his delivery, checking over shoulder with Santa sack',
      'carefully creeping away from doorway to the left, trying not to make noise with his sack',
      'tiptoeing away to the left side with lighter sack over shoulder, mission accomplished',
      'quietly departing to the left with burlap sack, glancing back to make sure he wasn\'t seen'
    ]
  },
  {
    id: 'santa-sneaking-right',
    category: 'position_based',
    baseDescription: 'Santa sneaking away to the right',
    requiredElements: [],
    optionalElements: ['doors'],
    confidence: 98,
    variations: [
      'sneaking away to the right after delivering presents, moving stealthily with sack',
      'carefully creeping away from entrance to the right with Santa sack over shoulder',
      'tiptoeing away to the right side with burlap sack, trying to leave undetected',
      'quietly departing to the right with his sack, staying low and cautious'
    ]
  },
  {
    id: 'santa-doorway-stealth',
    category: 'position_based',
    baseDescription: 'Santa moving stealthily through doorway',
    requiredElements: ['doors'],
    optionalElements: [],
    confidence: 96,
    variations: [
      'sneaking through the doorway with sack of presents, trying not to be seen',
      'carefully moving through entrance while carrying Santa sack, very quiet',
      'tiptoeing through doorway with burlap sack, checking if anyone is around',
      'quietly passing through entrance with his sack over shoulder, being extra cautious'
    ]
  },
  {
    id: 'santa-corner-hiding',
    category: 'position_based',
    baseDescription: 'Santa hiding near corner/edge',
    requiredElements: [],
    optionalElements: [],
    confidence: 92,
    variations: [
      'peeking around the corner with burlap sack, checking if coast is clear',
      'hiding near the edge while carrying Santa sack, trying to stay out of sight',
      'crouching in corner area with sack of presents, attempting to be stealthy',
      'pressing against wall with his sack, trying not to be noticed'
    ]
  },
  {
    id: 'santa-departing-stealthy',
    category: 'position_based',
    baseDescription: 'Santa stealthily departing after delivery',
    requiredElements: [],
    optionalElements: [],
    confidence: 94,
    variations: [
      'sneaking away from this location after completing his delivery with emptier sack',
      'carefully departing with lighter Santa sack over shoulder, job well done',
      'tiptoeing away having successfully delivered all presents, carrying his burlap sack',
      'quietly leaving the scene with sack in hand, checking no one noticed him'
    ]
  }
];

// Indoor stealth - Santa during delivery
const INDOOR_STEALTH_TEMPLATES: PromptTemplate[] = [
  {
    id: 'santa-indoor-tree-stealth',
    category: 'position_based',
    baseDescription: 'Santa sneaking toward Christmas tree',
    requiredElements: ['decorations'],
    optionalElements: ['lights'],
    confidence: 98,
    variations: [
      'tiptoeing toward the Christmas tree with Santa sack, trying not to wake anyone',
      'sneaking carefully to the tree while carrying sack of presents, finger to lips',
      'creeping toward Christmas tree with burlap sack over shoulder, moving very slowly and quietly',
      'quietly approaching the tree with his sack, being extremely careful'
    ]
  },
  {
    id: 'santa-indoor-furniture-stealth',
    category: 'position_based',
    baseDescription: 'Santa sneaking past furniture',
    requiredElements: ['furniture'],
    optionalElements: [],
    confidence: 94,
    variations: [
      'tiptoeing carefully past furniture while carrying sack of presents',
      'sneaking around the furniture with Santa sack, trying not to bump anything',
      'creeping past furniture holding burlap sack, moving extra quietly',
      'carefully navigating around furniture with his sack over shoulder, being very cautious'
    ]
  },
  {
    id: 'santa-indoor-hallway-stealth',
    category: 'position_based',
    baseDescription: 'Santa moving stealthily through indoor space',
    requiredElements: [],
    optionalElements: [],
    confidence: 90,
    variations: [
      'tiptoeing through the room with Santa sack, trying to stay quiet',
      'sneaking carefully through the space while carrying sack of presents',
      'creeping through the area with burlap sack over shoulder, checking no one is awake',
      'quietly moving through the room with his sack, being extra stealthy'
    ]
  }
];

// Lighting templates with stealth language
const LIGHTING_MATCH_TEMPLATES: PromptTemplate[] = [
  {
    id: 'santa-lighting-stealth',
    category: 'lighting_match',
    baseDescription: 'Santa sneaking while matching lighting',
    requiredElements: [],
    optionalElements: [],
    confidence: 93,
    variations: [
      'sneaking through scene with lighting matching ambient environment',
      'moving stealthily with natural shadows adjusted to scene',
      'creeping carefully with illumination matching surroundings',
      'tiptoeing quietly with realistic lighting matching scene conditions'
    ]
  }
];

// Camera templates with stealth language
const CAMERA_ADAPTIVE_TEMPLATES: PromptTemplate[] = [
  {
    id: 'santa-camera-stealth',
    category: 'camera_adaptive',
    baseDescription: 'Santa sneaking adapted to camera type',
    requiredElements: [],
    optionalElements: [],
    confidence: 92,
    variations: [
      'sneaking through scene with appearance matching security camera footage',
      'moving stealthily with color grading matching camera characteristics',
      'creeping carefully with visual style matching doorbell camera',
      'tiptoeing quietly with aesthetic matching surveillance footage'
    ]
  }
];

// Combine all templates
const ALL_TEMPLATES: PromptTemplate[] = [
  ...OUTDOOR_STEALTH_TEMPLATES,
  ...INDOOR_STEALTH_TEMPLATES,
  ...LIGHTING_MATCH_TEMPLATES,
  ...CAMERA_ADAPTIVE_TEMPLATES
];

// Generate contextual details based on scene elements
function generateLocationDetails(analysis: SceneAnalysis): string {
  const details: string[] = [];

  if (analysis.doors.length > 0) {
    const door = analysis.doors[0];
    details.push(`by the ${door.type}`);
  }

  if (analysis.furniture.length > 0) {
    const furniture = analysis.furniture[0];
    details.push(`near the ${furniture}`);
  }

  if (analysis.plants.length > 0) {
    details.push(`beside the plants`);
  }

  return details.length > 0 ? details.join(' and ') : 'at the entrance';
}

function generateDecorationDetails(analysis: SceneAnalysis): string {
  if (analysis.decorations.items.length === 0) {
    return 'Christmas decorations';
  }

  const items = analysis.decorations.items.slice(0, 2); // Limit to 2 items
  if (items.length === 1) {
    return items[0];
  }

  return items.join(' and ');
}

function generateHidingSpot(analysis: SceneAnalysis): string {
  // Priority order for hiding spots
  const spots: string[] = [];

  if (analysis.furniture.length > 0) {
    spots.push(`the ${analysis.furniture[0]}`);
  }

  if (analysis.plants.length > 0) {
    spots.push('the plants');
  }

  if (analysis.doors.length > 0) {
    spots.push('the doorway');
  }

  return spots.length > 0 ? spots[0] : 'the entrance';
}

function generateLightingDescription(analysis: SceneAnalysis): string {
  const { lighting, cameraType, colorGrading } = analysis.layout;

  // Map lighting conditions to descriptive phrases
  const lightingDescriptions: Record<string, string> = {
    'daylight': 'natural daylight with bright outdoor shadows',
    'dusk': 'soft twilight lighting with reduced contrast',
    'night': 'low-light conditions with artificial illumination',
    'indoor_warm': 'warm indoor lighting with yellow-orange tones',
    'indoor_cool': 'cool indoor lighting with blue-white tones',
    'bright': 'well-lit environment with clear visibility',
    'dim': 'moderate lighting with subdued tones',
    'dark': 'minimal lighting with deep shadows'
  };

  return lightingDescriptions[lighting] || 'ambient lighting';
}

function generateCameraDescription(analysis: SceneAnalysis): string {
  const { cameraType, colorGrading } = analysis.layout;

  if (cameraType === 'night_vision' || colorGrading === 'green_tint') {
    return 'monochrome green night vision with IR characteristics';
  }

  if (cameraType === 'black_white' || colorGrading === 'grayscale') {
    return 'black and white with grayscale tones';
  }

  // Color grading adaptations
  const gradingDescriptions: Record<string, string> = {
    'warm_indoor': 'warm color tones from indoor lighting',
    'cool_outdoor': 'cool color tones from outdoor light',
    'neutral': 'balanced color temperature',
    'green_tint': 'green-tinted monochrome',
    'grayscale': 'grayscale security footage'
  };

  return colorGrading ? gradingDescriptions[colorGrading] || 'natural colors' : 'natural colors';
}

function generatePositionDescription(analysis: SceneAnalysis): string {
  // Determine best position based on scene analysis
  if (analysis.doors.length > 0) {
    const door = analysis.doors[0];
    return `${door.position} ${door.type} area`;
  }

  if (analysis.furniture.length > 0) {
    return `near ${analysis.furniture[0]}`;
  }

  return 'natural position in frame';
}

function interpolateTemplate(template: string, analysis: SceneAnalysis): string {
  // Build a comprehensive technical prompt with MANDATORY stealth behavior
  const lightingDesc = generateLightingDescription(analysis);
  const cameraDesc = generateCameraDescription(analysis);
  const positionDesc = generatePositionDescription(analysis);

  // Start with Santa action - emphasize traditional appearance
  let result = `Santa ${template}`;
  result += ' (traditional Father Christmas with long white beard, plush red velvet suit, carrying burlap sack)';

  // CRITICAL ADDITIONS - ensure Santa doesn't acknowledge camera
  result += ', completely unaware camera is recording';
  result += ', never looking at or toward the camera';
  result += ', behaving naturally as if no one is watching';

  // Add technical scene matching
  result += `, ${lightingDesc}`;
  result += `, ${cameraDesc}`;

  // Add position context if not already specified in template
  if (!template.includes('doorway') && !template.includes('corner') && !template.includes('left') && !template.includes('right')) {
    result += `, ${positionDesc}`;
  }

  // Add integration emphasis
  result += ', naturally integrated into scene with realistic depth and proportions';

  return result;
}

function calculateTemplateScore(template: PromptTemplate, analysis: SceneAnalysis): number {
  let score = template.confidence;

  // Check required elements
  for (const required of template.requiredElements) {
    const hasElement = checkElementPresence(required, analysis);
    if (!hasElement) {
      score -= 30; // Heavy penalty for missing required elements
    }
  }

  // Bonus for optional elements
  for (const optional of template.optionalElements) {
    const hasElement = checkElementPresence(optional, analysis);
    if (hasElement) {
      score += 10; // Bonus for having optional elements
    }
  }

  // Christmas decoration bonus
  if (analysis.decorations.christmas && template.category === 'interactive') {
    score += 20;
  }

  // Boost scores based on new category types and scene characteristics
  const { lighting, cameraType, colorGrading, sceneType } = analysis.layout;

  // Lighting match templates get bonus for complex lighting
  if (template.category === 'lighting_match') {
    if (lighting === 'night' || lighting === 'dark' || lighting === 'dusk') {
      score += 15; // Critical for difficult lighting
    } else if (lighting === 'indoor_warm' || lighting === 'indoor_cool') {
      score += 10; // Important for indoor color matching
    }
  }

  // Camera adaptive templates get bonus for non-standard cameras
  if (template.category === 'camera_adaptive') {
    if (cameraType === 'night_vision' || colorGrading === 'green_tint') {
      score += 20; // Essential for night vision
    } else if (cameraType === 'black_white' || colorGrading === 'grayscale') {
      score += 15; // Important for B&W
    } else if (colorGrading && colorGrading !== 'neutral') {
      score += 10; // Useful for any color grading
    }
  }

  // Position-based templates are universally good
  if (template.category === 'position_based') {
    score += 5; // Consistent baseline
    if (sceneType === 'outdoor') {
      score += 5; // Extra good for outdoor
    }
  }

  // General lighting adjustments
  if (lighting === 'bright' || lighting === 'daylight') {
    score += 5; // Easier to work with
  } else if (lighting === 'dark') {
    score -= 3; // Slightly harder
  }

  return Math.max(0, Math.min(100, score));
}

function checkElementPresence(element: string, analysis: SceneAnalysis): boolean {
  switch (element) {
    case 'doors':
      return analysis.doors.length > 0;
    case 'windows':
      return analysis.windows.length > 0;
    case 'decorations':
      return analysis.decorations.items.length > 0;
    case 'furniture':
      return analysis.furniture.length > 0;
    case 'plants':
      return analysis.plants.length > 0;
    case 'lights':
      return analysis.decorations.lights;
    default:
      return false;
  }
}

function getSceneComplexity(analysis: SceneAnalysis): 'minimal' | 'moderate' | 'rich' {
  const elementCount =
    analysis.doors.length +
    analysis.windows.length +
    analysis.furniture.length +
    analysis.plants.length +
    analysis.decorations.items.length;

  if (elementCount <= 2) return 'minimal';
  if (elementCount <= 5) return 'moderate';
  return 'rich';
}

function generatePromptId(): string {
  return randomUUID();
}

function extractUsedElements(template: PromptTemplate, analysis: SceneAnalysis): string[] {
  const used: string[] = [];

  // Add required elements that are present
  for (const required of template.requiredElements) {
    if (checkElementPresence(required, analysis)) {
      used.push(required);
    }
  }

  // Add optional elements that are present
  for (const optional of template.optionalElements) {
    if (checkElementPresence(optional, analysis)) {
      used.push(optional);
    }
  }

  return Array.from(new Set(used)); // Remove duplicates
}

export function generateVideoPrompts(
  analysis: SceneAnalysis,
  config: Partial<PromptGeneratorConfig> = {}
): PromptGenerationResult {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Select templates based on scene characteristics
  let selectedTemplates: PromptTemplate[] = [];

  // Add outdoor stealth templates (work for outdoor/unclear scenes)
  if (analysis.layout.sceneType === 'outdoor' || analysis.layout.sceneType === 'unclear') {
    selectedTemplates.push(...OUTDOOR_STEALTH_TEMPLATES);
  }

  // Add indoor stealth templates if scene is indoor
  if (analysis.layout.sceneType === 'indoor' || analysis.layout.sceneType === 'unclear') {
    selectedTemplates.push(...INDOOR_STEALTH_TEMPLATES);
  }

  // Always add lighting match templates (especially important for difficult lighting)
  selectedTemplates.push(...LIGHTING_MATCH_TEMPLATES);

  // Always add camera adaptive templates (important for non-standard cameras)
  selectedTemplates.push(...CAMERA_ADAPTIVE_TEMPLATES);

  // Score and filter templates
  const scoredTemplates = selectedTemplates
    .map(template => ({
      template,
      score: calculateTemplateScore(template, analysis),
      interpolated: interpolateTemplate(
        template.variations[Math.floor(Math.random() * template.variations.length)],
        analysis
      )
    }))
    .filter(item => item.score > 30) // Only include reasonably good prompts
    .sort((a, b) => b.score - a.score); // Sort by score descending

  // Generate prompts
  const prompts: VideoPrompt[] = [];
  const maxToGenerate = Math.min(finalConfig.maxPrompts, scoredTemplates.length);
  const minToGenerate = Math.min(finalConfig.minPrompts, scoredTemplates.length);

  // Always include the best prompts first
  for (let i = 0; i < Math.max(minToGenerate, maxToGenerate); i++) {
    if (i < scoredTemplates.length) {
      const item = scoredTemplates[i];
      prompts.push({
        id: generatePromptId(),
        title: item.template.baseDescription.split(',')[0], // Use first part as title
        description: item.interpolated,
        tags: extractUsedElements(item.template, analysis),
        confidence: item.score,
        elements: extractUsedElements(item.template, analysis),
        category: item.template.category,
        duration: item.template.category === 'delivery' ? 'medium' : 'quick',
      });
    }
  }

  // Generate suggestions if scene is minimal
  const suggestions: string[] = [];
  if (getSceneComplexity(analysis) === 'minimal') {
    suggestions.push('Consider adding Christmas decorations for more magical prompts');
    suggestions.push('Better lighting would enable more diverse Santa scenarios');
  }

  if (analysis.decorations.items.length === 0 && analysis.layout.lighting !== 'bright') {
    suggestions.push('Retaking the photo with better lighting could improve prompt quality');
  }

  return {
    prompts,
    totalGenerated: prompts.length,
    sceneComplexity: getSceneComplexity(analysis),
    primaryElements: extractPrimaryElements(analysis),
    suggestions,
  };
}

function extractPrimaryElements(analysis: SceneAnalysis): string[] {
  const primary: string[] = [];

  if (analysis.doors.length > 0) primary.push('doors');
  if (analysis.decorations.christmas) primary.push('Christmas decorations');
  if (analysis.furniture.length > 0) primary.push('furniture');
  if (analysis.windows.length > 0) primary.push('windows');

  return primary;
}

// Generate additional prompts with different variations
export function generateMorePrompts(
  analysis: SceneAnalysis,
  existingPrompts: VideoPrompt[],
  count: number = 3
): VideoPrompt[] {
  // Use different variations of existing templates
  const usedTemplateIds = new Set(existingPrompts.map(p => p.category));

  const newPrompts: VideoPrompt[] = [];

  for (const template of ALL_TEMPLATES) {
    if (newPrompts.length >= count) break;

    const score = calculateTemplateScore(template, analysis);
    if (score > 40) { // Lower threshold for additional prompts
      // Use a different variation
      const variationIndex = Math.floor(Math.random() * template.variations.length);
      const interpolated = interpolateTemplate(template.variations[variationIndex], analysis);

      newPrompts.push({
        id: generatePromptId(),
        title: `${template.category.charAt(0).toUpperCase() + template.category.slice(1)} Variation`,
        description: interpolated,
        tags: extractUsedElements(template, analysis),
        confidence: score,
        elements: extractUsedElements(template, analysis),
        category: template.category,
        duration: template.category === 'delivery' ? 'medium' : 'quick',
      });
    }
  }

  return newPrompts;
}