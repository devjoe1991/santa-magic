# Troubleshooting Guide

## Supabase Connection Error: ENOTFOUND

### Error Message
```
Storage upload error: StorageUnknownError: fetch failed
Error: getaddrinfo ENOTFOUND uqhazvgwwejuqkfgszbm.supabase.co
```

### What This Means
Your application cannot reach the Supabase server. This is typically a network/DNS issue.

### Quick Fixes (Try in Order)

#### 1. Check Supabase Project Status
```bash
# Ping the Supabase URL
ping uqhazvgwwejuqkfgszbm.supabase.co

# Or use curl
curl -I https://uqhazvgwwejuqkfgszbm.supabase.co
```

**If ping fails**: Your Supabase project might be:
- Paused (free tier projects pause after inactivity)
- Deleted
- Having DNS issues

**Solution**: Go to https://supabase.com/dashboard and check your project status.

#### 2. Restart Supabase Project (If Paused)
1. Visit https://supabase.com/dashboard
2. Find your project: `uqhazvgwwejuqkfgszbm`
3. Click "Restore" or "Resume" if paused
4. Wait 2-3 minutes for DNS to propagate
5. Try again

#### 3. Check Internet Connection
```bash
# Test general internet connectivity
ping google.com

# Test DNS resolution
nslookup uqhazvgwwejuqkfgszbm.supabase.co
```

#### 4. Check VPN/Firewall
- Disable VPN temporarily
- Check if firewall is blocking Supabase domains
- Try from different network

#### 5. Update Supabase URL (If Project Moved)
If you've migrated or recreated your Supabase project:

1. Get new URL from Supabase dashboard
2. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_NEW_PROJECT_ID.supabase.co
   ```
3. Restart dev server: `pnpm dev`

---

## Testing Without Supabase

For testing the new prompt system, you can work without Supabase by:

### Option 1: Mock Scene Analysis
Create a local test endpoint that doesn't require Supabase:

```typescript
// app/api/test-prompt-generation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateVideoPrompts } from '@/lib/prompt-generator';

export async function POST(req: NextRequest) {
  const { analysis } = await req.json();

  // Generate prompts without saving to Supabase
  const result = generateVideoPrompts(analysis);

  return NextResponse.json({
    success: true,
    result
  });
}
```

### Option 2: Use Test Script (No Network Required)
```bash
# Run the local simulation
node test-prompt-system.js
```

This tests prompt generation logic without any external dependencies.

### Option 3: Skip Upload Step
Test the prompt generation directly in browser console:

```javascript
// In browser DevTools console
const analysis = {
  layout: {
    lighting: 'night',
    cameraType: 'night_vision',
    colorGrading: 'green_tint',
    sceneType: 'outdoor',
    visibility: 'clear',
    entryType: 'doorway',
    description: 'Test scene'
  },
  doors: [],
  windows: [],
  decorations: { christmas: false, holiday: false, items: [], lights: false },
  furniture: [],
  plants: [],
  suitabilityScore: 75,
  recommendations: []
};

// Call the API
fetch('/api/prompts/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ analysis })
}).then(r => r.json()).then(console.log);
```

---

## Alternative: Use Local Supabase

If you want to test with a database but can't connect to hosted Supabase:

### Setup Local Supabase
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Initialize and start local Supabase
supabase init
supabase start

# This gives you local URLs like:
# API URL: http://localhost:54321
```

### Update .env.local for Local Testing
```bash
# Comment out production URLs
# NEXT_PUBLIC_SUPABASE_URL=https://uqhazvgwwejuqkfgszbm.supabase.co

# Use local URLs
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
SUPABASE_SECRET_KEY=your-local-anon-key
```

---

## Checking What Works Without Supabase

These components work **without** Supabase:
- ✅ Prompt generation logic (`lib/prompt-generator.ts`)
- ✅ Scene analysis detection (`lib/scene-analyzer.ts` - uses OpenAI)
- ✅ Prompt enhancement (`lib/freepik-client.ts`)
- ✅ Test simulation script
- ✅ UI components (for display)

These components **require** Supabase:
- ❌ Image upload/storage
- ❌ Saving scene analysis to database
- ❌ Saving prompts to database
- ❌ Order/payment tracking
- ❌ Video storage

---

## Quick Test Without Supabase

Create a minimal test page:

```typescript
// app/test-prompts/page.tsx
'use client';

import { useState } from 'react';
import { generateVideoPrompts } from '@/lib/prompt-generator';

export default function TestPromptsPage() {
  const [prompts, setPrompts] = useState([]);

  const testGeneration = () => {
    const mockAnalysis = {
      layout: {
        lighting: 'night',
        cameraType: 'night_vision',
        colorGrading: 'green_tint',
        sceneType: 'outdoor',
        visibility: 'clear',
        entryType: 'doorway',
        description: 'Test'
      },
      doors: [],
      windows: [],
      decorations: { christmas: false, holiday: false, items: [], lights: false },
      furniture: [],
      plants: [],
      suitabilityScore: 75,
      recommendations: []
    };

    const result = generateVideoPrompts(mockAnalysis);
    setPrompts(result.prompts);
  };

  return (
    <div className="p-8">
      <h1>Prompt Generation Test</h1>
      <button onClick={testGeneration} className="bg-blue-500 text-white px-4 py-2 rounded">
        Generate Test Prompts
      </button>

      <div className="mt-4">
        {prompts.map((p: any) => (
          <div key={p.id} className="border p-4 mb-2">
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <span className="text-sm">Category: {p.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Visit: `http://localhost:3000/test-prompts`

---

## Environment Check Script

```bash
#!/bin/bash
# check-environment.sh

echo "🔍 Environment Check"
echo "===================="

echo -n "Internet: "
if ping -c 1 google.com &> /dev/null; then
  echo "✅"
else
  echo "❌ No internet connection"
fi

echo -n "Supabase: "
if ping -c 1 uqhazvgwwejuqkfgszbm.supabase.co &> /dev/null; then
  echo "✅"
else
  echo "❌ Cannot reach Supabase"
fi

echo -n "OpenAI: "
if ping -c 1 api.openai.com &> /dev/null; then
  echo "✅"
else
  echo "❌ Cannot reach OpenAI"
fi

echo ""
echo "Environment Variables:"
echo "NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:-not set}"
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:+set}"
echo "FREEPIK_API_KEY: ${FREEPIK_API_KEY:+set}"
```

Run: `bash check-environment.sh`

---

## Common Issues & Solutions

### Issue: "Project Paused"
**Solution**: Free tier projects pause after 1 week of inactivity. Resume from dashboard.

### Issue: "Invalid API Key"
**Solution**: Regenerate keys in Supabase dashboard, update `.env.local`

### Issue: "CORS Error"
**Solution**: Check Supabase dashboard > Settings > API > CORS settings

### Issue: "DNS Cache"
**Solution**: Clear DNS cache:
```bash
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches

# Windows
ipconfig /flushdns
```

---

## For Testing the New Prompt System

**You don't need Supabase working to test the core improvements!**

The new prompt generation logic is entirely local and can be tested with:
1. `node test-prompt-system.js` ← **Start here!**
2. Browser console with mock data
3. Local test page (see above)
4. Jest unit tests (if you add them)

The Supabase connection is only needed for:
- Saving scene analysis
- Storing images
- Database operations

Focus on testing prompt generation logic first, fix Supabase connection later.

---

## Next Steps

1. ✅ Run `node test-prompt-system.js` (works offline!)
2. ✅ Test prompt generation logic
3. ✅ Verify TypeScript compiles: `npx tsc --noEmit`
4. Check Supabase dashboard: https://supabase.com/dashboard
5. Resume/restore your project if paused
6. Wait 2-3 minutes for DNS
7. Try upload again

---

## Contact & Support

- Supabase Status: https://status.supabase.com
- Supabase Dashboard: https://supabase.com/dashboard
- DNS Checker: https://dnschecker.org

## Emergency Fallback

If you need to demo/test immediately and can't fix Supabase:

1. Comment out Supabase upload in your upload component
2. Use hardcoded mock scene analysis
3. Generate prompts directly
4. Skip the "save to database" step

This lets you validate the prompt improvements without waiting for infrastructure.
