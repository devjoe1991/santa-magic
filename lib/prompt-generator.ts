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

// Prompt templates focused on Santa SNEAKING - matching proven working prompt
// Outdoor prompts - Santa leaving after chimney delivery
const OUTDOOR_PROMPT_TEMPLATES: PromptTemplate[] = [
  // Santa departing after delivery - the main scenario
  {
    id: 'santa-post-delivery-departure',
    category: 'departure',
    baseDescription: 'Santa leaving after delivering presents via chimney',
    requiredElements: [],
    optionalElements: [],
    confidence: 98,
    variations: [
      'sneaking away from this location after delivering presents inside, moving left',
      'quietly departing after coming down the chimney, tiptoeing to the right',
      'leaving this area stealthily with lighter gift bag after his delivery',
      'creeping away after his visit, mission accomplished'
    ]
  },
  // Santa moving away stealthily
  {
    id: 'santa-stealthy-departure',
    category: 'departure',
    baseDescription: 'Santa moving stealthily away after delivery',
    requiredElements: [],
    optionalElements: [],
    confidence: 95,
    variations: [
      'tiptoeing away from this location to the left, moving slowly and quietly',
      'creeping away from this area to the right, staying low and cautious',
      'moving stealthily away from this location, pausing to listen for sounds',
      'sneaking away from this area slowly, checking no one sees him'
    ]
  },
  // Sneaking away after delivery
  {
    id: 'santa-sneaking-departure',
    category: 'departure',
    baseDescription: 'Santa sneaking away from the property',
    requiredElements: [],
    optionalElements: [],
    confidence: 85,
    variations: [
      'sneaking away from this location after delivering presents, tiptoeing to the left',
      'quietly leaving this area after his delivery, trying not to wake anyone',
      'sneaking away from this location to the right after leaving gifts',
      'tiptoeing away from this area, mission accomplished'
    ]
  },
  // Santa finishing his visit
  {
    id: 'santa-finishing-visit',
    category: 'departure',
    baseDescription: 'Santa completing his visit and departing',
    requiredElements: [],
    optionalElements: [],
    confidence: 93,
    variations: [
      'quietly finishing his delivery and sneaking away from this location',
      'departing after leaving gifts inside, moving carefully away',
      'tiptoeing away with satisfied smile after successful delivery',
      'carefully leaving this area after completing his Christmas mission'
    ]
  },
  // Stealthy departure movement
  {
    id: 'santa-stealthy-exit',
    category: 'departure',
    baseDescription: 'Santa moving stealthily away from this location',
    requiredElements: [],
    optionalElements: [],
    confidence: 90,
    variations: [
      'tiptoeing carefully away from this location, trying not to make any sound',
      'moving stealthily away from this area, checking no one sees him',
      'sneaking away from this location with careful, quiet steps',
      'creeping away from this area slowly, pausing every few steps to listen'
    ]
  },
  // Natural departure movements
  {
    id: 'santa-natural-departure',
    category: 'departure',
    baseDescription: 'Santa departing naturally after his visit',
    requiredElements: [],
    optionalElements: [],
    confidence: 88,
    variations: [
      'tiptoeing quietly away from this location, moving carefully and naturally',
      'moving carefully away from this area with nearly empty gift bag',
      'pausing mid-departure to adjust his hat, then continuing away from this location',
      'walking away from this area with careful steps, glancing back satisfied'
    ]
  }
];

// Indoor prompts - Santa in the act of delivering
const INDOOR_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'santa-christmas-tree-delivery',
    category: 'delivery',
    baseDescription: 'Santa placing presents under Christmas tree',
    requiredElements: ['decorations'],
    optionalElements: ['lights'],
    confidence: 98,
    variations: [
      'quietly placing presents under the Christmas tree while everyone sleeps',
      'carefully arranging gifts under the tree, trying not to make noise',
      'tiptoeing to the Christmas tree with his gift bag',
      'gently setting down presents beneath the tree'
    ]
  },
  {
    id: 'santa-indoor-sneaking',
    category: 'delivery',
    baseDescription: 'Santa moving stealthily through indoor space',
    requiredElements: [],
    optionalElements: [],
    confidence: 90,
    variations: [
      'tiptoeing through the living room with his gift bag',
      'sneaking carefully through the hallway, trying not to wake anyone',
      'moving quietly through this room while carrying presents',
      'creeping through the space with careful steps'
    ]
  },
  {
    id: 'santa-indoor-delivery',
    category: 'delivery',
    baseDescription: 'Santa delivering presents indoors',
    requiredElements: [],
    optionalElements: [],
    confidence: 95,
    variations: [
      'quietly arranging presents while the family sleeps',
      'carefully placing gifts in this room, being extra quiet',
      'tiptoeing around to deliver presents without waking anyone',
      'stealthily setting down his gift bag to arrange presents'
    ]
  }
];

// Combine templates based on scene type
const PROMPT_TEMPLATES: PromptTemplate[] = [...OUTDOOR_PROMPT_TEMPLATES, ...INDOOR_PROMPT_TEMPLATES];

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

function interpolateTemplate(template: string, analysis: SceneAnalysis): string {
  // No more object interpolation - use template as-is to prevent object creation
  // Add security camera context to every prompt
  const result = `From your security camera perspective: ${template}`;

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

  // Lighting adjustments
  switch (analysis.layout.lighting) {
    case 'bright':
      score += 5;
      break;
    case 'dim':
      // No change
      break;
    case 'dark':
      if (template.category === 'magical') {
        score += 10; // Magical prompts work well in dark settings
      } else {
        score -= 5;
      }
      break;
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

  // Select templates based on scene type
  let selectedTemplates: PromptTemplate[];
  switch (analysis.layout.sceneType) {
    case 'indoor':
      selectedTemplates = INDOOR_PROMPT_TEMPLATES;
      break;
    case 'outdoor':
      selectedTemplates = OUTDOOR_PROMPT_TEMPLATES;
      break;
    case 'unclear':
    default:
      // Use all templates if unclear, with preference for outdoor
      selectedTemplates = [...OUTDOOR_PROMPT_TEMPLATES, ...INDOOR_PROMPT_TEMPLATES];
      break;
  }

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

  for (const template of PROMPT_TEMPLATES) {
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