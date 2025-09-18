import { openai } from './openai-client';
import { SceneAnalysis } from '@/types/scene-analysis';

export async function analyzeScene(base64Image: string): Promise<SceneAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this doorbell camera image for creating a Santa Claus video. I need detailed information about the scene to determine the best way to add Santa delivering a present.

Please analyze and return ONLY a valid JSON object with this exact structure:

{
  "doors": [
    {
      "type": "front door/patio door/etc",
      "position": "center/left/right",
      "material": "wood/metal/glass/etc",
      "color": "color description"
    }
  ],
  "windows": [
    {
      "position": "left/right/center",
      "size": "large/medium/small",
      "style": "description"
    }
  ],
  "decorations": {
    "christmas": true/false,
    "holiday": true/false,
    "items": ["wreath", "lights", "etc"],
    "lights": true/false
  },
  "furniture": ["chair", "table", "planter", "etc"],
  "plants": ["potted plants", "flowers", "etc"],
  "layout": {
    "entryType": "covered porch/open doorway/apartment/etc",
    "description": "brief description of the space",
    "lighting": "bright/dim/dark",
    "visibility": "clear/partially obscured/poor"
  },
  "suitabilityScore": 85,
  "recommendations": ["suggestion 1", "suggestion 2"]
}

Focus on elements that would affect Santa placement and movement in the scene.`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }],
      max_tokens: 800,
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;

    const analysis: SceneAnalysis = JSON.parse(jsonString);

    // Validate that we have the expected structure
    if (!analysis.doors || !analysis.layout || typeof analysis.suitabilityScore !== 'number') {
      throw new Error('Invalid analysis structure returned from OpenAI');
    }

    // Ensure suitabilityScore is within bounds
    analysis.suitabilityScore = Math.max(0, Math.min(100, analysis.suitabilityScore));

    return analysis;
  } catch (error) {
    console.error('Scene analysis error:', error);

    // Return a fallback analysis for robustness
    return {
      doors: [{ type: 'entrance', position: 'center' }],
      windows: [],
      decorations: { christmas: false, holiday: false, items: [], lights: false },
      furniture: [],
      plants: [],
      layout: {
        entryType: 'doorway',
        description: 'Unable to analyze scene details',
        lighting: 'dim',
        visibility: 'poor'
      },
      suitabilityScore: 50,
      recommendations: ['Analysis failed - manual review recommended']
    };
  }
}

export function convertFileToBase64(file: Buffer): string {
  return file.toString('base64');
}

export function isValidImageFormat(mimeType: string): boolean {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return supportedTypes.includes(mimeType.toLowerCase());
}