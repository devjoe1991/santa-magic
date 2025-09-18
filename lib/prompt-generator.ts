import { SceneAnalysis } from '@/types/scene-analysis';
import {
  VideoPrompt,
  PromptTemplate,
  PromptGeneratorConfig,
  PromptGenerationResult
} from '@/types/video-prompts';

// Default configuration
const DEFAULT_CONFIG: PromptGeneratorConfig = {
  maxPrompts: 5,
  minPrompts: 3,
  includeTimeOfDay: true,
  includeSeason: true,
  emphasizeChristmas: true,
};

// Prompt templates focused on "catching Santa sneaking around"
const PROMPT_TEMPLATES: PromptTemplate[] = [
  // Caught red-handed scenarios
  {
    id: 'santa-caught-red-handed',
    category: 'interactive',
    baseDescription: 'Santa caught mid-action, freezing with a guilty expression',
    requiredElements: [],
    optionalElements: ['doors', 'furniture', 'decorations'],
    confidence: 95,
    variations: [
      'Santa freezing in place with wide eyes and a sheepish grin when caught {locationDetails}',
      'Santa with hands up and a guilty smile, caught red-handed while sneaking {locationDetails}',
      'Santa pausing mid-step with a finger to his lips saying "Shhh!" when spotted {locationDetails}',
      'Santa looking over his shoulder with surprise, caught in the act {locationDetails}'
    ]
  },
  // Sneaking and tiptoeing
  {
    id: 'santa-tiptoeing-stealth',
    category: 'entrance',
    baseDescription: 'Santa carefully tiptoeing trying not to wake anyone',
    requiredElements: [],
    optionalElements: ['doors', 'furniture', 'plants'],
    confidence: 90,
    variations: [
      'Santa tiptoeing on his toes with exaggerated stealth, trying not to make a sound {locationDetails}',
      'Santa creeping slowly with arms out for balance as he sneaks past the {door}',
      'Santa moving in slow motion with cartoonish stealth around {locationDetails}',
      'Santa hunched over, carefully placing each step while sneaking through the entrance'
    ]
  },
  // Quick escape scenarios
  {
    id: 'santa-quick-escape',
    category: 'departure',
    baseDescription: 'Santa quickly trying to escape after being spotted',
    requiredElements: [],
    optionalElements: ['doors', 'windows', 'furniture'],
    confidence: 85,
    variations: [
      'Santa making a comical quick dash toward the {door} after being caught',
      'Santa doing an exaggerated tiptoe run, trying to escape unnoticed {locationDetails}',
      'Santa ducking and weaving as he makes a sneaky exit past {locationDetails}',
      'Santa with a playful panic, scrambling to hide behind {hidingSpot}'
    ]
  },
  // Peeking and hiding
  {
    id: 'santa-peeking-around',
    category: 'magical',
    baseDescription: 'Santa cautiously peeking around corners or objects',
    requiredElements: [],
    optionalElements: ['doors', 'furniture', 'plants', 'decorations'],
    confidence: 88,
    variations: [
      'Santa peeking his head around the corner with only his eyes and hat visible',
      'Santa carefully leaning out from behind {hidingSpot} to check if the coast is clear',
      'Santa\'s hat and beard barely visible as he spies from behind the {door}',
      'Santa doing a classic cartoon peek around {locationDetails} with one eye showing'
    ]
  },
  // Surprised/startled reactions
  {
    id: 'santa-startled-reaction',
    category: 'interactive',
    baseDescription: 'Santa\'s shocked expression when he realizes he\'s been discovered',
    requiredElements: [],
    optionalElements: ['doors', 'decorations', 'furniture'],
    confidence: 92,
    variations: [
      'Santa with comically wide eyes and dropped jaw, completely startled {locationDetails}',
      'Santa doing a double-take with surprise, not expecting to be caught sneaking around',
      'Santa with raised eyebrows and a "Who, me?" expression when spotted {locationDetails}',
      'Santa looking genuinely shocked but then breaking into a warm smile when discovered'
    ]
  },
  // Attempting to blend in/hide
  {
    id: 'santa-trying-to-hide',
    category: 'interactive',
    baseDescription: 'Santa attempting to hide or blend in unsuccessfully',
    requiredElements: [],
    optionalElements: ['furniture', 'plants', 'decorations'],
    confidence: 80,
    variations: [
      'Santa trying to hide behind {hidingSpot} but his big belly gives him away',
      'Santa attempting to blend in with {decorationDetails} by standing perfectly still',
      'Santa ducking behind {hidingSpot} with just his boots and hat visible',
      'Santa in a playful game of hide-and-seek, poorly concealed {locationDetails}'
    ]
  },
  // Single present delivery (reduced from 3 templates)
  {
    id: 'santa-single-gift-drop',
    category: 'delivery',
    baseDescription: 'Santa quietly placing one special gift',
    requiredElements: [],
    optionalElements: ['doors', 'furniture', 'decorations'],
    confidence: 75,
    variations: [
      'Santa gently setting down a single wrapped present {locationDetails} with care',
      'Santa placing one magical gift while trying not to disturb anything {locationDetails}',
      'Santa quietly leaving one special surprise {locationDetails} before sneaking away'
    ]
  },
  // Window scenarios
  {
    id: 'santa-window-surveillance',
    category: 'magical',
    baseDescription: 'Santa checking through windows to see if anyone is watching',
    requiredElements: ['windows'],
    optionalElements: ['doors'],
    confidence: 85,
    variations: [
      'Santa peering through the {window} to make sure no one is awake',
      'Santa\'s face appearing at the {window} with a mischievous expression',
      'Santa checking the {window} before making his sneaky entrance through the {door}',
      'Santa waving playfully from the {window} after being spotted inside'
    ]
  }
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

function interpolateTemplate(template: string, analysis: SceneAnalysis): string {
  let result = template;

  // Replace placeholders with actual scene details
  result = result.replace('{door}', analysis.doors.length > 0 ? analysis.doors[0].type : 'entrance');
  result = result.replace('{window}', analysis.windows.length > 0 ?
    `${analysis.windows[0].position} window` : 'window');
  result = result.replace('{locationDetails}', generateLocationDetails(analysis));
  result = result.replace('{decorationDetails}', generateDecorationDetails(analysis));
  result = result.replace('{hidingSpot}', generateHidingSpot(analysis));

  // Add security camera context to every prompt
  result = `From your security camera perspective: ${result}`;

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
  return `prompt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

  // Score and filter templates
  const scoredTemplates = PROMPT_TEMPLATES
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