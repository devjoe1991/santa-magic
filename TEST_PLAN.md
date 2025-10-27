# Test Plan: Generic Santa Integration Prompts

## Overview
This test plan validates that the new technical integration prompt system generates more consistent Santa videos across different camera types and lighting conditions.

## Test Objectives

1. ✅ Verify scene analysis correctly detects camera types and lighting
2. ✅ Confirm prompt generation produces technically-focused prompts
3. ✅ Validate Freepik API receives enhanced prompts with scene context
4. ✅ Ensure UI displays new prompt categories correctly
5. ✅ Compare consistency between old and new prompt systems
6. ✅ Test backward compatibility with existing data

---

## Test Environment Setup

### Prerequisites
- Development environment running (`pnpm dev`)
- Freepik API key configured
- OpenAI API key configured
- Test image samples (various camera types)

### Test Data Required

Create test images representing different scenarios:

1. **Night Vision** - Green-tinted IR camera footage
2. **Black & White** - Grayscale security camera
3. **Indoor Warm** - Yellow/orange indoor lighting
4. **Indoor Cool** - Blue/white fluorescent lighting
5. **Outdoor Daylight** - Bright natural light
6. **Outdoor Night** - Dark with artificial lights
7. **Color Doorbell** - Standard color Ring/Nest footage

**Sample Test Images Location:** `/test-images/` (create this folder)

---

## Test Cases

## 1. Scene Analysis Detection Tests

### Test 1.1: Night Vision Detection
**Objective:** Verify night vision camera is correctly identified

**Test Steps:**
1. Upload a green-tinted IR night vision image
2. Trigger scene analysis
3. Check analysis response

**Expected Results:**
```json
{
  "layout": {
    "cameraType": "night_vision",
    "colorGrading": "green_tint",
    "lighting": "night" // or "dark"
  }
}
```

**Pass Criteria:**
- ✅ `cameraType` is `"night_vision"` or `colorGrading` is `"green_tint"`
- ✅ Scene analysis completes without errors

---

### Test 1.2: Black & White Detection
**Objective:** Verify grayscale camera is correctly identified

**Test Steps:**
1. Upload a black & white security camera image
2. Trigger scene analysis
3. Check analysis response

**Expected Results:**
```json
{
  "layout": {
    "cameraType": "black_white",
    "colorGrading": "grayscale",
    "lighting": "bright" // or "dim" depending on image
  }
}
```

**Pass Criteria:**
- ✅ `cameraType` is `"black_white"` or `colorGrading` is `"grayscale"`
- ✅ Scene analysis completes without errors

---

### Test 1.3: Indoor Warm Lighting Detection
**Objective:** Verify warm indoor lighting is correctly identified

**Test Steps:**
1. Upload image with warm yellow/orange indoor lighting
2. Trigger scene analysis
3. Check analysis response

**Expected Results:**
```json
{
  "layout": {
    "cameraType": "color",
    "colorGrading": "warm_indoor",
    "lighting": "indoor_warm",
    "sceneType": "indoor"
  }
}
```

**Pass Criteria:**
- ✅ `colorGrading` is `"warm_indoor"` OR `lighting` is `"indoor_warm"`
- ✅ Scene correctly identified as indoor

---

### Test 1.4: Outdoor Daylight Detection
**Objective:** Verify bright outdoor daylight is correctly identified

**Test Steps:**
1. Upload bright outdoor doorbell camera image
2. Trigger scene analysis
3. Check analysis response

**Expected Results:**
```json
{
  "layout": {
    "cameraType": "color",
    "colorGrading": "neutral" // or "cool_outdoor"
    "lighting": "daylight",
    "sceneType": "outdoor"
  }
}
```

**Pass Criteria:**
- ✅ `lighting` is `"daylight"` or `"bright"`
- ✅ Scene correctly identified as outdoor

---

## 2. Prompt Generation Tests

### Test 2.1: Technical Prompt Structure
**Objective:** Verify prompts use technical integration language, not actions

**Test Steps:**
1. Generate prompts from any test image
2. Examine generated prompt descriptions
3. Count action verbs vs technical terms

**Expected Results:**
- ✅ Prompts contain technical terms: "matching", "lighting", "positioned", "integrated"
- ✅ Prompts avoid complex actions: "tiptoeing", "sneaking", "hiding", "peeking"
- ✅ Prompts mention lighting/camera characteristics

**Sample Expected Prompt:**
```
"Santa standing in the doorway with gift bag, natural daylight with bright outdoor shadows,
natural colors, naturally integrated into scene with realistic depth and proportions"
```

**Pass Criteria:**
- ✅ At least 80% of prompts use simple verbs (standing, positioned, visible, present)
- ✅ All prompts include lighting/camera descriptions
- ✅ All prompts include integration language

---

### Test 2.2: Night Vision Prompt Adaptation
**Objective:** Verify prompts adapt for night vision cameras

**Test Steps:**
1. Upload night vision test image
2. Generate prompts
3. Examine prompt descriptions

**Expected Results:**
- ✅ Prompts mention "night vision", "green", "monochrome", or "IR"
- ✅ Prompts reference low-light conditions
- ✅ Color grading instructions present

**Sample Expected Phrase:**
```
"monochrome green night vision with IR characteristics"
```

**Pass Criteria:**
- ✅ Night vision characteristics mentioned in prompts
- ✅ Lighting adapted to low-light/dark conditions

---

### Test 2.3: Category Distribution
**Objective:** Verify new categories are generated and scored appropriately

**Test Steps:**
1. Generate prompts from test image
2. Count prompts by category
3. Check confidence scores

**Expected Results:**
```javascript
{
  "lighting_match": 2-3 prompts,
  "position_based": 2-4 prompts,
  "camera_adaptive": 1-2 prompts
}
```

**Pass Criteria:**
- ✅ At least one prompt from each new category
- ✅ Position-based prompts have baseline confidence ~90+
- ✅ Lighting-match prompts boosted for difficult lighting
- ✅ Camera-adaptive prompts boosted for non-standard cameras

---

### Test 2.4: Prompt Interpolation
**Objective:** Verify prompts correctly interpolate scene analysis data

**Test Steps:**
1. Use indoor warm lighting test image
2. Generate prompts
3. Verify lighting descriptions match detected conditions

**Test Image Analysis:**
```json
{
  "layout": {
    "lighting": "indoor_warm",
    "colorGrading": "warm_indoor",
    "cameraType": "color"
  }
}
```

**Expected Prompt Content:**
- ✅ Contains "warm indoor lighting" or "yellow-orange tones"
- ✅ Contains "warm color temperature"
- ✅ References indoor setting

**Pass Criteria:**
- ✅ Generated prompts accurately reflect detected scene characteristics
- ✅ No generic "ambient lighting" when specific type detected

---

## 3. Freepik API Enhancement Tests

### Test 3.1: Enhanced Prompt Structure
**Objective:** Verify Freepik receives scene-aware enhanced prompts

**Test Steps:**
1. Mock or intercept Freepik API call
2. Upload test image and select a prompt
3. Capture the final prompt sent to Freepik
4. Verify enhancement structure

**Expected Prompt Format:**
```
"Add Santa Claus [original prompt]. Santa wearing traditional red suit with white beard.
[Lighting-specific instruction]. [Camera type adaptation]. Static camera position,
no camera movement. Subtle colors for realistic security camera aesthetic.
Natural integration with scene depth and proportions."
```

**Test Cases:**

**3.1a - Night Vision:**
```
Expected to contain:
- "Night vision green monochrome with IR characteristics"
- "Low-light conditions with minimal visibility"
```

**3.1b - Indoor Warm:**
```
Expected to contain:
- "Warm indoor lighting with yellow-orange glow"
- "Warm color temperature matching indoor lights"
```

**3.1c - Black & White:**
```
Expected to contain:
- "Black and white grayscale security footage"
```

**Pass Criteria:**
- ✅ Enhancement includes scene-specific lighting instructions
- ✅ Enhancement includes camera type adaptations when applicable
- ✅ Static camera instruction always present
- ✅ Integration language always present

---

### Test 3.2: Scene Analysis Pass-Through
**Objective:** Verify scene analysis data flows to Freepik client

**Test Steps:**
1. Add console logging to `freepik-client.ts:377` in `enhancePromptForChristmas()`
2. Generate a video
3. Check console logs

**Expected Console Output:**
```javascript
{
  original: "standing in the doorway with gift bag...",
  enhanced: "Add Santa Claus standing in the doorway... [full enhanced prompt]",
  hasSceneAnalysis: true  // ← Key check
}
```

**Pass Criteria:**
- ✅ `hasSceneAnalysis` is `true`
- ✅ Enhanced prompt is longer and more detailed than original
- ✅ No errors in enhancement process

---

## 4. UI Component Tests

### Test 4.1: New Category Icons Display
**Objective:** Verify new category icons render correctly

**Test Steps:**
1. Generate prompts with new categories
2. View in prompt selector UI
3. Select a prompt and view in prompt display

**Expected UI Elements:**
- 💡 for `lighting_match`
- 📍 for `position_based`
- 📹 for `camera_adaptive`

**Pass Criteria:**
- ✅ All three new icons display correctly
- ✅ Legacy icons still work (🚪🎁✨🤝👋)
- ✅ No broken/missing icons

---

### Test 4.2: Category Labels Display
**Objective:** Verify category labels are human-readable

**Test Steps:**
1. View generated prompts in UI
2. Check category badge text

**Expected Labels:**
- "Lighting Match" (not "lighting_match")
- "Position Based" (not "position_based")
- "Camera Adaptive" (not "camera_adaptive")

**Pass Criteria:**
- ✅ All labels properly formatted with spaces and capitals
- ✅ No underscores visible to user

---

## 5. Integration Tests

### Test 5.1: End-to-End Video Generation
**Objective:** Generate actual video with new prompt system

**Test Steps:**
1. Upload a test image (e.g., night vision)
2. Wait for scene analysis
3. Review generated prompts
4. Select a technically-focused prompt
5. Trigger video generation
6. Wait for Freepik processing
7. Review final video

**Expected Behavior:**
- ✅ Scene analysis completes successfully
- ✅ Prompts generated with technical language
- ✅ Enhanced prompt sent to Freepik includes scene context
- ✅ Video generation completes without errors

**Quality Checks (manual review of video):**
- Does Santa match the lighting of the scene?
- Does Santa match the color grading (B&W, green tint, warm/cool)?
- Does Santa look naturally integrated?
- Are shadows realistic?
- Is the camera static (no movement)?

---

### Test 5.2: Multiple Camera Types Comparison
**Objective:** Compare Santa consistency across different camera types

**Test Steps:**
1. Generate videos from 3 different camera types:
   - Night vision
   - Color daylight
   - Indoor warm
2. Review all three videos
3. Compare Santa's appearance

**Expected Results:**
- ✅ Night vision Santa has green tint/monochrome
- ✅ Daylight Santa has bright, natural colors
- ✅ Indoor Santa has warm color tones
- ✅ All Santas are clearly visible and well-integrated

**Pass Criteria:**
- Santa's lighting/color matches each scene appropriately
- No videos with completely wrong lighting/colors
- Consistency within each camera type

---

## 6. Backward Compatibility Tests

### Test 6.1: Legacy Prompt Rendering
**Objective:** Verify old prompts still work

**Test Steps:**
1. If you have existing prompts in database with old categories
2. Load and display them in UI
3. Verify they render correctly

**Expected Results:**
- ✅ Old categories (entrance, delivery, departure, etc.) still display
- ✅ Old prompts can still be selected
- ✅ No errors when viewing old prompts

---

### Test 6.2: Missing Scene Analysis Fields
**Objective:** Verify system handles analysis without new fields

**Test Steps:**
1. Mock scene analysis response without new fields:
```json
{
  "layout": {
    "lighting": "bright",
    "sceneType": "outdoor",
    "visibility": "clear"
    // NO cameraType or colorGrading
  }
}
```
2. Generate prompts
3. Verify no errors

**Expected Results:**
- ✅ Prompts generated successfully
- ✅ Falls back to generic descriptions
- ✅ No undefined/null errors

---

## 7. Performance Tests

### Test 7.1: Prompt Generation Speed
**Objective:** Verify new system doesn't slow down generation

**Test Steps:**
1. Time prompt generation with console.time()
2. Generate prompts 5 times
3. Calculate average time

**Expected Results:**
- ✅ Generation completes in < 500ms
- ✅ No significant slowdown vs old system

---

### Test 7.2: Scene Analysis Response Time
**Objective:** Verify enhanced analysis doesn't timeout

**Test Steps:**
1. Upload test image
2. Measure scene analysis time
3. Verify response includes new fields

**Expected Results:**
- ✅ Analysis completes in < 10 seconds
- ✅ All new fields populated
- ✅ No timeouts

---

## 8. Error Handling Tests

### Test 8.1: Malformed Scene Analysis
**Objective:** Verify graceful handling of bad analysis data

**Test Steps:**
1. Mock corrupted scene analysis
2. Attempt prompt generation
3. Check error handling

**Test Cases:**
- Missing `layout` object
- Invalid `cameraType` value
- Null `colorGrading`

**Expected Results:**
- ✅ System falls back to defaults
- ✅ User sees error message or fallback prompts
- ✅ No app crashes

---

### Test 8.2: Freepik Enhancement Failure
**Objective:** Verify video generation continues if enhancement fails

**Test Steps:**
1. Break `enhancePromptForChristmas()` temporarily
2. Attempt video generation
3. Verify fallback behavior

**Expected Results:**
- ✅ Original prompt used if enhancement fails
- ✅ Video generation still attempted
- ✅ Error logged but not shown to user

---

## 9. A/B Comparison Tests (Optional)

### Test 9.1: Old vs New Prompt Comparison
**Objective:** Quantitatively compare old and new systems

**Test Steps:**
1. Use same test image
2. Generate video with old action-based prompt (if available)
3. Generate video with new technical prompt
4. Compare results

**Comparison Metrics:**
- Lighting match accuracy (1-5 scale)
- Color grading match (1-5 scale)
- Natural integration (1-5 scale)
- Overall video quality (1-5 scale)

**Expected Results:**
- ✅ New prompts score higher on lighting match
- ✅ New prompts score higher on color grading
- ✅ New prompts score higher on natural integration

---

## Test Execution Checklist

### Pre-Testing
- [ ] Development environment running
- [ ] Test images prepared (all 7 scenarios)
- [ ] API keys configured and working
- [ ] Database backed up (if testing with real data)

### Scene Analysis Tests
- [ ] Test 1.1: Night Vision Detection
- [ ] Test 1.2: Black & White Detection
- [ ] Test 1.3: Indoor Warm Detection
- [ ] Test 1.4: Outdoor Daylight Detection

### Prompt Generation Tests
- [ ] Test 2.1: Technical Prompt Structure
- [ ] Test 2.2: Night Vision Adaptation
- [ ] Test 2.3: Category Distribution
- [ ] Test 2.4: Prompt Interpolation

### API Enhancement Tests
- [ ] Test 3.1: Enhanced Prompt Structure
- [ ] Test 3.2: Scene Analysis Pass-Through

### UI Tests
- [ ] Test 4.1: New Category Icons
- [ ] Test 4.2: Category Labels

### Integration Tests
- [ ] Test 5.1: End-to-End Video Generation
- [ ] Test 5.2: Multiple Camera Types

### Backward Compatibility Tests
- [ ] Test 6.1: Legacy Prompt Rendering
- [ ] Test 6.2: Missing Analysis Fields

### Performance Tests
- [ ] Test 7.1: Generation Speed
- [ ] Test 7.2: Analysis Response Time

### Error Handling Tests
- [ ] Test 8.1: Malformed Analysis
- [ ] Test 8.2: Enhancement Failure

---

## Test Reporting

### Bug Report Template
```markdown
**Test Case:** [Test ID and name]
**Status:** FAIL
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Steps to Reproduce:**
1. Step 1
2. Step 2

**Screenshots/Logs:** [Attach if applicable]
**Severity:** Critical / High / Medium / Low
```

### Success Criteria

**Minimum Requirements (Must Pass):**
- ✅ All scene analysis detection tests pass (1.1-1.4)
- ✅ Technical prompt structure test passes (2.1)
- ✅ At least one end-to-end video generates successfully (5.1)
- ✅ UI displays new categories correctly (4.1, 4.2)
- ✅ No regressions in backward compatibility (6.1, 6.2)

**Quality Targets (Should Pass):**
- ✅ 80%+ of prompts use technical language over actions
- ✅ Camera-specific adaptations work for night vision and B&W
- ✅ Prompt generation completes in < 500ms
- ✅ Scene analysis completes in < 10s

**Stretch Goals (Nice to Have):**
- ✅ A/B comparison shows measurable improvement
- ✅ All error handling tests pass gracefully
- ✅ Performance matches or exceeds old system

---

## Quick Test Script (Copy & Paste)

```bash
# 1. Start dev server
pnpm dev

# 2. Open browser to localhost:3000

# 3. Quick smoke test:
# - Upload night_vision.jpg
# - Wait for analysis
# - Check prompts contain "night vision" or "green"
# - Select a prompt
# - Check enhanced prompt in console

# 4. Check for TypeScript errors
npx tsc --noEmit

# 5. Check for console errors
# Open browser DevTools > Console
# Should see no red errors
```

---

## Test Data Creation Guide

### Creating Test Images

**Night Vision:**
- Find green-tinted IR camera footage online
- Or apply green color filter to doorbell image
- Key: Should have green monochrome appearance

**Black & White:**
- Convert color image to grayscale
- Use old security camera footage
- Key: No color information

**Indoor Warm:**
- Photo taken with warm incandescent/LED lights
- Should have yellow/orange glow
- Key: Warm color temperature

**Indoor Cool:**
- Photo taken with fluorescent/cool LED lights
- Should have blue/white tones
- Key: Cool color temperature

**Outdoor Daylight:**
- Bright sunny day doorbell footage
- Clear shadows visible
- Key: High contrast, natural light

**Outdoor Night:**
- Dark outdoor with streetlights/porch lights
- Low visibility
- Key: Dark with artificial illumination

---

## Automated Testing (Future Enhancement)

Consider adding these automated tests:

```typescript
// Example Jest test
describe('Prompt Generator', () => {
  it('should generate technical prompts for night vision', () => {
    const analysis = {
      layout: {
        cameraType: 'night_vision',
        colorGrading: 'green_tint',
        lighting: 'night'
      }
    };

    const result = generateVideoPrompts(analysis);

    expect(result.prompts.some(p =>
      p.description.includes('night vision') ||
      p.description.includes('green') ||
      p.description.includes('monochrome')
    )).toBe(true);
  });
});
```

---

## Rollback Plan

If critical issues are found:

1. **Immediate Rollback:**
   ```bash
   git revert HEAD
   pnpm build
   # Deploy previous version
   ```

2. **Partial Rollback:**
   - Keep scene analysis enhancements
   - Revert just prompt templates
   - File to revert: `lib/prompt-generator.ts`

3. **Feature Flag (Future):**
   - Add environment variable: `USE_TECHNICAL_PROMPTS=true/false`
   - Toggle between old and new systems

---

## Sign-Off

**Tested By:** ___________________
**Date:** ___________________
**Status:** PASS / FAIL / PARTIAL
**Notes:** ___________________

---

## Contact

Questions about this test plan? See:
- [PROMPT_IMPROVEMENTS.md](PROMPT_IMPROVEMENTS.md) - Implementation details
- [CLAUDE.md](CLAUDE.md) - Project overview
