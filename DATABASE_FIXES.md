# Database Schema Fixes

## Issues Found & Resolved

### Issue 1: Column Name Mismatch ✅ FIXED
**Error:** `Could not find the 'image_path' column of 'scene_analyses'`

**Root Cause:**
- Database has column: `image_storage_path`
- Code was trying to insert: `image_path`

**Fix Applied:**
- Updated [lib/supabase-helpers.ts:66](lib/supabase-helpers.ts#L66)
- Changed `image_path` → `image_storage_path`

```typescript
// Before
image_path: imageStoragePath,

// After
image_storage_path: imageStoragePath,
```

---

### Issue 2: Missing Prompt Categories ✅ FIXED
**Error:** Would have occurred when saving prompts with new categories

**Root Cause:**
- Database constraint only allowed old categories: `entrance`, `delivery`, `magical`, `interactive`, `departure`
- New code generates: `lighting_match`, `position_based`, `camera_adaptive`

**Fix Applied:**
- Created migration: [supabase/migrations/002_add_new_prompt_categories.sql](supabase/migrations/002_add_new_prompt_categories.sql)
- Updated `video_prompts.prompt_category` constraint to include new categories
- Applied migration successfully ✅

**New Allowed Categories:**
- ✨ `lighting_match` - Prompts focused on matching ambient lighting
- ✨ `position_based` - Simple Santa positioning (doorway, side, corner)
- ✨ `camera_adaptive` - Adapts to camera type (night vision, B&W, color)
- 📦 `entrance` - Legacy category (kept for backward compatibility)
- 📦 `delivery` - Legacy category (kept for backward compatibility)
- 📦 `magical` - Legacy category (kept for backward compatibility)
- 📦 `interactive` - Legacy category (kept for backward compatibility)
- 📦 `departure` - Legacy category (kept for backward compatibility)

---

## Database Status

### Current Schema
```sql
-- scene_analyses table
✅ image_storage_path (text) - Correct column name
✅ analysis_data (jsonb) - Contains layout.cameraType and layout.colorGrading
✅ All other columns present and correct

-- video_prompts table
✅ prompt_category constraint updated
✅ Accepts all 8 categories (3 new + 5 legacy)
```

### Verification Commands

**Check constraint:**
```sql
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'video_prompts_prompt_category_check';
```

**Expected Result:**
```
prompt_category = ANY (ARRAY[
  'lighting_match'::text,
  'position_based'::text,
  'camera_adaptive'::text,
  'entrance'::text,
  'delivery'::text,
  'magical'::text,
  'interactive'::text,
  'departure'::text
])
```

---

## Testing the Fixes

### 1. Test Scene Analysis Upload
```bash
# Start dev server
pnpm dev

# In browser:
1. Go to localhost:3000
2. Upload an image
3. Should successfully save to database without column errors
```

**Expected Behavior:**
- ✅ Image uploads to Supabase Storage
- ✅ Scene analysis saves with `image_storage_path`
- ✅ No "column not found" errors

---

### 2. Test Prompt Generation & Saving
```bash
# After uploading image and analyzing scene:
1. Wait for prompts to generate
2. Check prompts include new categories (💡📍📹)
3. Select a prompt
4. Should save without category constraint errors
```

**Expected Behavior:**
- ✅ Prompts generated with new categories
- ✅ Database accepts `lighting_match`, `position_based`, `camera_adaptive`
- ✅ No constraint violation errors

---

## Migration History

| Migration | Date | Description | Status |
|-----------|------|-------------|--------|
| 001_initial_schema.sql | 2024-09-18 | Initial database schema | ✅ Applied |
| 002_add_new_prompt_categories.sql | 2025-01-23 | Add new prompt categories | ✅ Applied |

---

## Rollback Plan (If Needed)

If you need to rollback the category changes:

```sql
-- Revert to old categories only
ALTER TABLE video_prompts
DROP CONSTRAINT IF EXISTS video_prompts_prompt_category_check;

ALTER TABLE video_prompts
ADD CONSTRAINT video_prompts_prompt_category_check
CHECK (prompt_category = ANY (ARRAY[
  'entrance'::text,
  'delivery'::text,
  'magical'::text,
  'interactive'::text,
  'departure'::text
]));
```

**Note:** This will cause errors if any prompts with new categories exist in the database.

---

## Next Steps

1. ✅ Database schema is now aligned with code
2. ✅ Ready to test scene analysis upload
3. ✅ Ready to test prompt generation
4. 📋 Follow [TEST_PLAN.md](TEST_PLAN.md) for comprehensive testing

---

## Related Files

- [lib/supabase-helpers.ts](lib/supabase-helpers.ts) - Updated column name
- [types/video-prompts.ts](types/video-prompts.ts) - New category types
- [lib/prompt-generator.ts](lib/prompt-generator.ts) - Generates new categories
- [supabase/migrations/](supabase/migrations/) - Database migrations

---

## Quick Reference

**Supabase Dashboard:** https://supabase.com/dashboard
**Project ID:** uqhazvgwwejuqkfgszbm

**Database Connection Status:**
- ✅ Connected successfully
- ✅ Schema updated
- ✅ Ready for testing
