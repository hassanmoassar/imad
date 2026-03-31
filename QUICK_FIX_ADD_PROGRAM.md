# Quick Fix: "Invalid Compact JWS" When Adding Programs

## What's Happening?
When you try to add a new program, you get an "Invalid Compact JWS" error. This happens because your Supabase database or storage isn't set up correctly.

---

## 🚀 Fix in 5 Minutes

### 1. Go to Supabase Dashboard
```
https://app.supabase.com → Select your project
```

### 2. Run Setup SQL
**Go to:** SQL Editor → New query → Paste this:

```sql
CREATE TABLE IF NOT EXISTS programs (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  image text,
  steps jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on programs" ON programs;
DROP POLICY IF EXISTS "Allow authenticated insert on programs" ON programs;
DROP POLICY IF EXISTS "Allow authenticated update on programs" ON programs;
DROP POLICY IF EXISTS "Allow authenticated delete on programs" ON programs;

CREATE POLICY "Allow public select on programs"
ON programs FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on programs"
ON programs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on programs"
ON programs FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on programs"
ON programs FOR DELETE USING (true);
```

**Click:** Execute ✅

### 3. Create Storage Bucket
**Go to:** Storage → Create bucket
- Name: `programs`
- Public: ✅ YES

### 4. Try Adding Program
Your app should now let you add programs without errors!

---

## 🔍 If Still Not Working

### Check Console Logs
1. Open your app in browser
2. Press F12 (Developer Tools)
3. Click "Console" tab
4. Try to add a program
5. Look for `[Admin]` prefixed messages
6. They'll tell you exactly what failed

### Example Good Logs:
```
[Admin] Starting program creation...
[Admin] Verifying authentication token...
[Admin] Token verified successfully
[Admin] Uploading image...
[Admin] Inserting program...
[Admin] Program created successfully! ✅
```

### Example Error Logs & Fixes:

**If you see:**
```
[Admin] Image upload failed: No such bucket
```
**Fix:** Create `programs` storage bucket in Supabase

---

**If you see:**
```
[Admin] Database insert failed: permission denied
```
**Fix:** Check RLS policies (follow Step 2 above)

---

**If you see:**
```
[Admin] Authentication failed: No valid token found
```
**Fix:** Make sure you're logged in with valid Supabase auth

---

## ✅ Success Checklist

- [ ] `programs` table created in Supabase
- [ ] RLS policies added to table
- [ ] `programs` storage bucket created (PUBLIC)
- [ ] Storage policies allow uploads
- [ ] User is authenticated/logged in
- [ ] Console shows `[Admin]` logs (no errors)
- [ ] Can add program successfully

---

## Detailed Help
See: `FIX_ADD_PROGRAM_ERROR.md` (full troubleshooting guide)

---

## That's It! 🎉
Should be working now. If not, check the console logs - they'll tell you exactly what to fix!
