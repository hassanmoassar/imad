# Quick Start: Fix "Invalid Compact JWS" Error (5 minutes)

## Step 1: Verify Your Setup (2 min)

**Visit this URL in your browser:**
```
http://localhost:3000/api/auth/session
```

**You should see JSON like this:**
```json
{
  "authenticated": true,
  "session": {
    "tokens": {
      "access": {
        "present": true,
        "valid": true
      }
    }
  }
}
```

✅ If `authenticated: true` and `valid: true` → **Your token setup is working!**

❌ If `authenticated: false` → User is not logged in (need to login first)

---

## Step 2: Test the Utilities (1 min)

**Create a test file to verify everything works:**

```tsx
// app/test-auth/page.tsx
import AuthExample from '@/components/AuthExample'

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
      <AuthExample />
    </div>
  )
}
```

**Visit:** `http://localhost:3000/test-auth`

**Check your browser console (F12):**
- Should see logs starting with `[Supabase]`
- Should show token info
- Should show current user email

---

## Step 3: Use in Your Code (2 min)

### Option A: Simple Fetch (Recommended)

```typescript
import { fetchWithAuth } from '@/lib/supabaseAuth'

// Instead of this ❌:
const response = await fetch('/api/data', {
  headers: {
    Authorization: `Bearer ${session?.access_token}` // Could be undefined!
  }
})

// Use this ✅:
const response = await fetchWithAuth('/api/data', {
  method: 'GET',
  includeAuth: true // Automatically adds Authorization header
})

const data = await response.json()
```

---

### Option B: Manual Token Handling

```typescript
import { getAccessToken } from '@/lib/supabaseAuth'

const token = await getAccessToken()

if (!token) {
  console.error('Not authenticated')
  return
}

const response = await fetch('/api/data', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

const data = await response.json()
```

---

### Option C: Protect API Routes

```typescript
// app/api/my-protected-route/route.ts
import { withAuth } from '@/lib/authMiddleware'

export const GET = withAuth(async (request, user) => {
  // If we reach here, user is authenticated
  console.log('Request from:', user.email)
  
  return Response.json({
    message: 'This is protected data',
    user: user.email
  })
})
```

**Call from client:**
```typescript
const response = await fetchWithAuth('/api/my-protected-route')
const data = await response.json()
```

---

## That's It! ✅

You've just:
1. ✅ Verified your token setup
2. ✅ Tested the utilities
3. ✅ Learned how to use them in your code

---

## If You Get Errors

### Error: "No session found" or "authenticated: false"

**Solution:** User needs to be logged in first

```typescript
// Add a login check:
const user = await getCurrentUser()
if (!user) {
  // Redirect to login page or show login UI
  console.log('User is not authenticated')
}
```

---

### Error: Still getting "Invalid Compact JWS"

**Solution:** Check these things:

1. Is token null/undefined?
   ```typescript
   const token = await getAccessToken()
   console.log('Token is:', token ? 'Valid' : 'Null/Undefined')
   ```

2. Is token being sent correctly?
   ```typescript
   // Make sure you're doing this ✅
   const header = `Bearer ${token}`
   
   // NOT this ❌
   const header = `Bearer Bearer ${token}`
   ```

3. Check if token expired (enable auto-refresh)
   ```
   Already enabled in lib/supabaseClient.ts ✅
   ```

---

## Console Debugging

Open browser DevTools (F12) and go to **Console** tab.

**Good logs to see:**
```
[Supabase] Initializing Supabase client
[Supabase] Access token retrieved successfully
[Supabase] Auth header built
[Example] Loading session...
[Example] Current user: user@example.com
```

**Bad logs to see:**
```
[Supabase] No session found
[Supabase] Token is null/undefined
[Supabase] Invalid JWT format
```

---

## Token Format Reference

### ✅ Correct Format
```
Authorization: Bearer xxxxx.yyyyy.zzzzz

Where:
- xxxxx = header
- yyyyy = payload  
- zzzzz = signature
(3 parts separated by dots)
```

### ❌ Wrong Formats
```
Authorization: Bearer undefined          ← Token is null
Authorization: Bearer xxxxx.yyyyy        ← Only 2 parts
Authorization: Bearer Bearer xxxxx.yyyyy.zzzzz  ← Double Bearer
```

---

## Files You're Using

| File | Purpose |
|------|---------|
| `lib/supabaseAuth.ts` | Get tokens safely |
| `lib/authMiddleware.ts` | Protect API routes |
| `app/api/auth/session` | Debug endpoint |
| `components/AuthExample.tsx` | Example code |

---

## Next Steps

1. **Keep debugging?** → See `SUPABASE_AUTH_GUIDE.md`
2. **Need code examples?** → See `MIGRATION_EXAMPLE.md`
3. **Want full details?** → See `SUPABASE_FIX_COMPLETE.md`
4. **Need step-by-step?** → See `IMPLEMENTATION_CHECKLIST.md`

---

## Most Common Issue Checklist

- [ ] Is user logged in? (Check `/api/auth/session`)
- [ ] Is token in correct format? (3 parts with dots)
- [ ] Is token being sent in Authorization header?
- [ ] Does Authorization header have "Bearer " prefix?
- [ ] Is token null/undefined before being sent?

If you check all these boxes, everything should work! ✅

---

## Quick Command Reference

```typescript
// Get current user
import { getCurrentUser } from '@/lib/supabaseAuth'
const user = await getCurrentUser()

// Get access token
import { getAccessToken } from '@/lib/supabaseAuth'
const token = await getAccessToken()

// Validate token format
import { isValidJWTFormat } from '@/lib/supabaseAuth'
const valid = isValidJWTFormat(token)

// Make authenticated fetch
import { fetchWithAuth } from '@/lib/supabaseAuth'
const response = await fetchWithAuth('/api/data', { includeAuth: true })

// Protect API route
import { withAuth } from '@/lib/authMiddleware'
export const GET = withAuth(async (req, user) => { ... })
```

---

## Success! 🎉

When you see this in the browser:
- ✅ `/api/auth/session` returns `authenticated: true`
- ✅ Console shows `[Supabase]` logs
- ✅ API requests include proper Authorization header
- ✅ No more "Invalid Compact JWS" errors

**You've successfully fixed the issue!**
