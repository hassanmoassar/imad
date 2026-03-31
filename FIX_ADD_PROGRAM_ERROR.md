# Fix "Invalid Compact JWS" Error When Adding Programs

When you see this error while trying to add a new program, it means your Supabase database or storage bucket isn't properly configured. Follow these steps.

---

## Step 1: Check Your Supabase Tables (Most Common Fix)

### Go to Supabase Dashboard
1. Visit: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Run this SQL to create the `programs` table:

```sql
-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  image text,
  steps jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to select (read)
CREATE POLICY "Allow public select on programs"
ON programs
FOR SELECT
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert on programs"
ON programs
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update on programs"
ON programs
FOR UPDATE
USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete on programs"
ON programs
FOR DELETE
USING (true);
```

---

## Step 2: Check Your Storage Bucket

### In Supabase Dashboard:
1. Go to **Storage** → **Buckets**
2. Create a bucket named `programs` if it doesn't exist:
   - Name: `programs`
   - Public: ✅ YES (check this)

### Set Storage Policies:
Go to the `programs` bucket → **Policies** tab

Add this policy for public access:

```sql
-- Allow anyone to read uploaded images
CREATE POLICY "Allow public read on programs bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'programs');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated upload to programs bucket"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'programs' 
  AND auth.role() = 'authenticated'
);
```

---

## Step 3: Test in Your App

### Test 1: Check Console Logs
1. Open your app in browser
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Try to add a program
5. Look for logs starting with `[Admin]` - they'll show exactly where it fails

### Expected Good Logs:
```
[Admin] Starting program creation...
[Admin] Verifying authentication token...
[Admin] Token verified successfully
[Admin] Uploading image to Supabase storage...
[Admin] Image uploaded successfully
[Admin] Inserting program into database...
[Admin] Program created successfully!
```

### Expected Error Logs (and their fixes):
```
[Admin] Authentication failed: No valid token found
→ Solution: User needs to log in with valid Supabase auth

[Admin] Image upload failed: ...
→ Solution: Check storage bucket exists and is public

[Admin] Database insert failed: ...
→ Solution: Check programs table exists and RLS policies allow inserts
```

---

## Step 4: Check Authentication

Make sure you have user authentication set up:

```typescript
// In your app, users should be authenticated
import { getCurrentUser } from '@/lib/supabaseAuth'

const user = await getCurrentUser()
if (!user) {
  console.error('User not authenticated!')
  // Redirect to login page
}
```

---

## Step 5: Full Troubleshooting Checklist

- [ ] `programs` table exists in Supabase
- [ ] `programs` table has these columns: id, title, description, image, steps
- [ ] Row Level Security (RLS) is enabled on `programs` table
- [ ] RLS policies allow INSERT for authenticated users
- [ ] `programs` storage bucket exists
- [ ] `programs` storage bucket is PUBLIC
- [ ] Storage policies allow authenticated users to upload
- [ ] User is logged in (authenticated)
- [ ] Browser console shows `[Admin]` logs (no errors)
- [ ] `.env.local` has valid Supabase credentials

---

## Quick Supabase Setup SQL (Copy & Paste All)

**Go to:** Supabase Dashboard → SQL Editor → Create new query

**Paste this:**

```sql
-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  image text,
  steps jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public select on programs" ON programs;
DROP POLICY IF EXISTS "Allow authenticated insert on programs" ON programs;
DROP POLICY IF EXISTS "Allow authenticated update on programs" ON programs;
DROP POLICY IF EXISTS "Allow authenticated delete on programs" ON programs;

-- Create new policies
CREATE POLICY "Allow public select on programs"
ON programs FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on programs"
ON programs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on programs"
ON programs FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on programs"
ON programs FOR DELETE USING (true);
```

**Click:** Execute (Run)

---

## If Still Getting Error

### Enable Debug Logging:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Paste this:
```javascript
// Log all fetch requests
const originalFetch = window.fetch
window.fetch = function(...args) {
  console.log('[Fetch]', args[0])
  return originalFetch.apply(this, args)
}
```

4. Try adding a program again
5. Look for any 401, 403, or 500 errors in network requests

### Check Auth Token:
```javascript
// In browser console:
const response = await fetch('/api/auth/session')
const data = await response.json()
console.log('Auth status:', data)
```

If `authenticated: false`, user needs to log in.

---

## Common Error Messages & Solutions

### "Image upload failed: No such bucket"
**Solution:** Create `programs` storage bucket and make it public

### "Database insert failed: permission denied"
**Solution:** Check RLS policies allow INSERT for authenticated users

### "Authentication failed: No valid token found"
**Solution:** User needs to be logged in with valid Supabase authentication

### "Invalid Compact JWS" (Generic)
**Solution:** One of the above - check console logs for specific issue

---

## Video: Step-by-Step Setup

If you're stuck, follow these steps in order:

1. ✅ Create `programs` table in SQL Editor
2. ✅ Enable RLS on table
3. ✅ Add INSERT/SELECT/UPDATE/DELETE policies
4. ✅ Create `programs` storage bucket (make PUBLIC)
5. ✅ Add storage upload policy
6. ✅ Check console logs while adding program
7. ✅ Fix based on console error messages

---

## Need Help?

Check the console logs (F12) - they will show:
- `[Admin] Verifying authentication token...` → Auth issue
- `[Admin] Uploading image to Supabase storage...` → Storage issue
- `[Admin] Inserting program into database...` → Database issue

Each log tells you exactly what's being attempted, making it easy to identify the problem!

---

## Success = This Message:
```
✅ Program created successfully!
```

Plus console log:
```
[Admin] Program created successfully! { programId: 'xxx' }
```

Now you should be able to add programs without errors! 🎉
