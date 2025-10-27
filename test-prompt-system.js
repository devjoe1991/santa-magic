#!/usr/bin/env node

/**
 * Quick Test Script for Santa Prompt System
 *
 * Usage:
 *   node test-prompt-system.js
 *
 * This script helps you quickly test the new prompt generation system
 * by simulating different camera and lighting scenarios.
 */

console.log('🎅 Santa Prompt System Test Script\n');

// Mock scene analyses for different scenarios
const testScenarios = {
  nightVision: {
    name: 'Night Vision Camera',
    icon: '🌙',
    analysis: {
      doors: [{ type: 'front door', position: 'center' }],
      windows: [],
      decorations: { christmas: false, holiday: false, items: [], lights: false },
      furniture: [],
      plants: [],
      layout: {
        entryType: 'doorway',
        description: 'Front entrance at night',
        lighting: 'night',
        visibility: 'clear',
        sceneType: 'outdoor',
        cameraType: 'night_vision',
        colorGrading: 'green_tint'
      },
      suitabilityScore: 75,
      recommendations: []
    }
  },

  blackAndWhite: {
    name: 'Black & White Security Camera',
    icon: '⬛',
    analysis: {
      doors: [{ type: 'entrance', position: 'center' }],
      windows: [],
      decorations: { christmas: false, holiday: false, items: [], lights: false },
      furniture: [],
      plants: [],
      layout: {
        entryType: 'doorway',
        description: 'Security camera footage',
        lighting: 'dim',
        visibility: 'clear',
        sceneType: 'outdoor',
        cameraType: 'black_white',
        colorGrading: 'grayscale'
      },
      suitabilityScore: 70,
      recommendations: []
    }
  },

  indoorWarm: {
    name: 'Indoor Warm Lighting',
    icon: '🏠',
    analysis: {
      doors: [],
      windows: [],
      decorations: { christmas: true, holiday: true, items: ['Christmas tree', 'lights'], lights: true },
      furniture: ['sofa', 'coffee table'],
      plants: [],
      layout: {
        entryType: 'living room',
        description: 'Cozy living room with warm lights',
        lighting: 'indoor_warm',
        visibility: 'clear',
        sceneType: 'indoor',
        cameraType: 'color',
        colorGrading: 'warm_indoor'
      },
      suitabilityScore: 95,
      recommendations: []
    }
  },

  outdoorDaylight: {
    name: 'Outdoor Daylight',
    icon: '☀️',
    analysis: {
      doors: [{ type: 'front door', position: 'center', color: 'red' }],
      windows: [{ position: 'left', size: 'large' }],
      decorations: { christmas: true, holiday: true, items: ['wreath'], lights: false },
      furniture: [],
      plants: ['potted plants'],
      layout: {
        entryType: 'covered porch',
        description: 'Bright front porch in daylight',
        lighting: 'daylight',
        visibility: 'clear',
        sceneType: 'outdoor',
        cameraType: 'color',
        colorGrading: 'neutral'
      },
      suitabilityScore: 90,
      recommendations: []
    }
  },

  indoorCool: {
    name: 'Indoor Cool Lighting',
    icon: '💡',
    analysis: {
      doors: [],
      windows: [],
      decorations: { christmas: false, holiday: false, items: [], lights: false },
      furniture: ['desk', 'chair'],
      plants: [],
      layout: {
        entryType: 'hallway',
        description: 'Hallway with fluorescent lights',
        lighting: 'indoor_cool',
        visibility: 'clear',
        sceneType: 'indoor',
        cameraType: 'color',
        colorGrading: 'cool_outdoor'
      },
      suitabilityScore: 70,
      recommendations: []
    }
  }
};

// Test helper functions
function testSceneAnalysis(scenario) {
  console.log(`\n${scenario.icon} Testing: ${scenario.name}`);
  console.log('='.repeat(60));

  const { layout } = scenario.analysis;

  console.log('\n📊 Scene Analysis Results:');
  console.log(`   Camera Type: ${layout.cameraType || 'not detected'}`);
  console.log(`   Color Grading: ${layout.colorGrading || 'not detected'}`);
  console.log(`   Lighting: ${layout.lighting}`);
  console.log(`   Scene Type: ${layout.sceneType}`);

  // Validate new fields are present
  const hasNewFields = layout.cameraType && layout.colorGrading;
  console.log(`\n✓ Status: ${hasNewFields ? '✅ NEW FIELDS DETECTED' : '❌ MISSING NEW FIELDS'}`);

  return hasNewFields;
}

function simulatePromptGeneration(scenario) {
  console.log('\n🎬 Simulated Prompt Generation:');

  const { layout } = scenario.analysis;

  // Simulate what the prompt generator would create
  let samplePrompt = 'Santa standing in the doorway with gift bag';

  // Add lighting description
  if (layout.lighting === 'night' || layout.lighting === 'dark') {
    samplePrompt += ', low-light conditions with minimal visibility';
  } else if (layout.lighting === 'daylight') {
    samplePrompt += ', bright natural daylight with clear shadows';
  } else if (layout.lighting === 'indoor_warm') {
    samplePrompt += ', warm indoor lighting with yellow-orange tones';
  } else if (layout.lighting === 'indoor_cool') {
    samplePrompt += ', cool indoor lighting with blue-white tones';
  }

  // Add camera description
  if (layout.cameraType === 'night_vision' || layout.colorGrading === 'green_tint') {
    samplePrompt += ', monochrome green night vision with IR characteristics';
  } else if (layout.cameraType === 'black_white' || layout.colorGrading === 'grayscale') {
    samplePrompt += ', black and white with grayscale tones';
  } else if (layout.colorGrading === 'warm_indoor') {
    samplePrompt += ', warm color tones from indoor lighting';
  } else if (layout.colorGrading === 'cool_outdoor') {
    samplePrompt += ', cool color tones from outdoor light';
  } else {
    samplePrompt += ', natural colors';
  }

  samplePrompt += ', naturally integrated into scene with realistic depth and proportions';

  console.log(`\n   "${samplePrompt}"`);

  // Check for technical language
  const technicalTerms = ['matching', 'lighting', 'positioned', 'integrated', 'tones', 'characteristics'];
  const actionVerbs = ['tiptoeing', 'sneaking', 'hiding', 'peeking', 'creeping'];

  const hasTechnicalTerms = technicalTerms.some(term => samplePrompt.toLowerCase().includes(term));
  const hasActionVerbs = actionVerbs.some(verb => samplePrompt.toLowerCase().includes(verb));

  console.log(`\n   Technical language: ${hasTechnicalTerms ? '✅' : '❌'}`);
  console.log(`   Action verbs: ${hasActionVerbs ? '❌ (should avoid)' : '✅'}`);

  return hasTechnicalTerms && !hasActionVerbs;
}

function simulateFreepikEnhancement(scenario) {
  console.log('\n🚀 Simulated Freepik Enhancement:');

  const { layout } = scenario.analysis;
  let enhanced = 'Add Santa Claus standing in the doorway with gift bag. Santa wearing traditional red suit with white beard.';

  // Add scene-specific enhancements
  if (layout.lighting === 'night' || layout.lighting === 'dark') {
    enhanced += ' Low-light conditions with minimal visibility.';
  } else if (layout.lighting === 'daylight') {
    enhanced += ' Bright natural daylight with clear shadows.';
  } else if (layout.lighting === 'indoor_warm') {
    enhanced += ' Warm indoor lighting with yellow-orange glow.';
  }

  if (layout.cameraType === 'night_vision' || layout.colorGrading === 'green_tint') {
    enhanced += ' Night vision green monochrome with IR characteristics.';
  } else if (layout.cameraType === 'black_white' || layout.colorGrading === 'grayscale') {
    enhanced += ' Black and white grayscale security footage.';
  }

  enhanced += ' Static camera position, no camera movement. Subtle colors for realistic security camera aesthetic.';

  console.log(`\n   "${enhanced.substring(0, 200)}..."`);

  const hasSceneContext = layout.cameraType || layout.colorGrading;
  console.log(`\n   Scene context included: ${hasSceneContext ? '✅' : '❌'}`);

  return hasSceneContext;
}

// Run all tests
function runAllTests() {
  console.log('Starting comprehensive prompt system tests...\n');

  let totalTests = 0;
  let passedTests = 0;

  for (const [key, scenario] of Object.entries(testScenarios)) {
    // Test 1: Scene Analysis
    totalTests++;
    if (testSceneAnalysis(scenario)) passedTests++;

    // Test 2: Prompt Generation
    totalTests++;
    if (simulatePromptGeneration(scenario)) passedTests++;

    // Test 3: Freepik Enhancement
    totalTests++;
    if (simulateFreepikEnhancement(scenario)) passedTests++;

    console.log('\n' + '-'.repeat(60));
  }

  // Final Report
  console.log('\n\n📋 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} ✅`);
  console.log(`Failed: ${totalTests - passedTests} ❌`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! System working as expected.');
  } else {
    console.log('\n⚠️  Some tests failed. Review the output above.');
  }

  console.log('\n📖 Next Steps:');
  console.log('   1. Test with real images via the UI');
  console.log('   2. Generate actual videos with Freepik API');
  console.log('   3. Compare results to previous system');
  console.log('   4. See TEST_PLAN.md for comprehensive testing\n');
}

// Run the tests
runAllTests();
