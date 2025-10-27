-- Migration: Add new prompt categories to video_prompts table
-- Date: 2025-01-23
-- Description: Adds lighting_match, position_based, and camera_adaptive categories

-- Drop the existing constraint
ALTER TABLE video_prompts
DROP CONSTRAINT IF EXISTS video_prompts_prompt_category_check;

-- Add the new constraint with all categories (old + new)
ALTER TABLE video_prompts
ADD CONSTRAINT video_prompts_prompt_category_check
CHECK (prompt_category = ANY (ARRAY[
  'lighting_match'::text,
  'position_based'::text,
  'camera_adaptive'::text,
  'entrance'::text,
  'delivery'::text,
  'magical'::text,
  'interactive'::text,
  'departure'::text
]));

-- Add comment explaining the categories
COMMENT ON COLUMN video_prompts.prompt_category IS
'Category of the video prompt:
- lighting_match: Prompts focused on matching ambient lighting
- position_based: Prompts focused on Santa positioning (doorway, side, corner)
- camera_adaptive: Prompts that adapt to camera type (night vision, B&W, color)
- entrance: Legacy - Santa entering the scene
- delivery: Legacy - Santa delivering presents
- magical: Legacy - Magical/whimsical Santa moments
- interactive: Legacy - Santa interacting with environment
- departure: Legacy - Santa leaving the scene';
