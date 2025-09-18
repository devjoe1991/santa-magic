// Quick test to verify prompt variety
const { generateVideoPrompts } = require('./lib/prompt-generator');

// Mock scene analysis with typical doorbell scene elements
const mockSceneAnalysis = {
  doors: [{ type: 'front door', position: 'center' }],
  windows: [{ position: 'left' }],
  decorations: {
    items: ['wreath', 'lights'],
    christmas: true,
    lights: true
  },
  furniture: ['chair', 'small table'],
  plants: ['potted plant'],
  layout: {
    lighting: 'bright',
    spaceType: 'entrance'
  },
  suitabilityScore: 85
};

console.log('🎅 Testing New Santa "Caught Sneaking" Prompt Templates\n');
console.log('Scene Analysis:', {
  doors: mockSceneAnalysis.doors.length,
  windows: mockSceneAnalysis.windows.length,
  decorations: mockSceneAnalysis.decorations.items,
  furniture: mockSceneAnalysis.furniture,
  hasChristmasDecorations: mockSceneAnalysis.decorations.christmas
});

console.log('\n📝 Generated Prompts:\n');

try {
  const result = generateVideoPrompts(mockSceneAnalysis, { maxPrompts: 6 });

  result.prompts.forEach((prompt, index) => {
    console.log(`${index + 1}. [${prompt.category.toUpperCase()}] ${prompt.title}`);
    console.log(`   📋 ${prompt.description}`);
    console.log(`   🎯 Confidence: ${prompt.confidence}% | Elements: ${prompt.elements.join(', ')}`);
    console.log('');
  });

  console.log(`🎭 Variety Analysis:`);
  const categories = {};
  result.prompts.forEach(prompt => {
    categories[prompt.category] = (categories[prompt.category] || 0) + 1;
  });

  Object.entries(categories).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} prompts`);
  });

  console.log(`\n🎪 Scene Complexity: ${result.sceneComplexity}`);
  console.log(`📊 Total Generated: ${result.totalGenerated}`);

  if (result.suggestions.length > 0) {
    console.log(`💡 Suggestions: ${result.suggestions.join(', ')}`);
  }

} catch (error) {
  console.error('❌ Error testing prompts:', error);
}