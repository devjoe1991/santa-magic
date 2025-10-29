-- Add user_context column to scene_analyses table
-- This stores optional user-provided context about camera position and scene layout

ALTER TABLE scene_analyses
ADD COLUMN user_context TEXT;

COMMENT ON COLUMN scene_analyses.user_context IS 'Optional user-provided context describing camera location, scene layout, and positioning constraints for Santa video generation';
