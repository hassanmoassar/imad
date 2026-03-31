# Supabase Authentication - Troubleshooting Guide

## Error: "Invalid Compact JWS"

This error occurs when Supabase receives an invalid, malformed, null, or undefined JWT token.

---

## Root Causes

### 1. **Token is Null/Undefined**

**Symptoms:**
```
Authorization: Bearer undefined
Authorization: Bearer null
```

**Causes:**
- User is not authenticated
- Session has expired
- Token not retrieved before making request

**Solution:**
```typescript
// ❌ WRONG - No null check
const token = await supabase.auth.getSession()
const header = `Bearer ${token.access_token}` // Could be undefined!

// ✅ CORRECT - With null check
import { getAccessToken } from '@/lib/supabaseAuth'
const token = await getAccessToken() // Returns null if invalid
if (!token) {
  console.error('No valid token available')
  return
}
const header = `Bearer ${token}`
```

---

### 2. **Token Format is Invalid**

**Symptoms:**
```
Valid JWT format: xxxxx.yyyyy.zzzzz (3 parts separated by dots)
Invalid format: Bearer xxxxx.yyyyy.zzzzz (includes "Bearer " prefix)
Invalid format: xxxxx.yyyyy (only 2 parts)
```

**Causes:**
- Token already has "Bearer " prefix
- Token is corrupted or truncated
- Token from wrong source

**Solution:**
```typescript
// ✅ CORRECT - Token should NOT have Bearer prefix
const token = session.access_token // Just the token
const authHeader = `Bearer ${token}` // Add Bearer here

// ❌ WRONG - Token already has Bearer prefix
const token = `Bearer ${session.access_token}`
const authHeader = `Bearer ${token}` // Results in: Bearer Bearer xxxxx...
```

---

### 3. **Token Sent to Wrong Service**

**Causes:**
- Sending access token to service expecting refresh token
- Sending user token to admin service
- Using wrong API key

**Solution:**
```typescript
// Access token for API requests
const accessToken = session.access_token
fetch('/api/data', {
  headers: { Authorization: `Bearer ${accessToken}` }
})

// Refresh token for getting new access token
const refreshToken = session.refresh_token
const newSession = await supabase.auth.refreshSession({ refresh_token: refreshToken })
```

---

### 4. **Token is Expired**

**Symptoms:**
- Token was valid but session expired
- App doesn't refresh token automatically

**Solution:**
```typescript
// Enable auto-refresh in client setup
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true, // ✅ This is important
    detectSessionInUrl: true,
  },
})
```

---

## Debugging Steps

### Step 1: Check Environment Variables

```bash
# In your .env.local, verify these are set:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ The URL should start with `https://`, not `http://`

---

### Step 2: Check Token Presence and Format

```typescript
import { getAccessToken, isValidJWTFormat } from '@/lib/supabaseAuth'

const token = await getAccessToken()

if (!token) {
  console.error('Token is null/undefined')
  return
}

if (!isValidJWTFormat(token)) {
  console.error('Token format is invalid')
  return
}

console.log('Token is valid!')
console.log('Token starts with:', token.substring(0, 20) + '...')
```

---

### Step 3: Verify Session and Token

Visit `/api/auth/session` endpoint:

```typescript
const response = await fetch('/api/auth/session')
const sessionData = await response.json()

// Check response:
{
  authenticated: true,
  session: {
    user: { id: '...', email: 'user@example.com' },
    tokens: {
      access: {
        present: true,
        valid: true,
        format: '3 parts',
        length: 450
      },
      refresh: {
        present: true,
        valid: true,
        format: '3 parts',
        length: 350
      }
    }
  }
}
```

---

### Step 4: Test with AuthExample Component

Use the provided `AuthExample` component to debug:

```tsx
// In your page
import AuthExample from '@/components/AuthExample'

export default function TestPage() {
  return <AuthExample />
}
```

Then:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for logs starting with `[Supabase]` or `[Example]`
4. Check what token state is shown

---

## Common Patterns

### Pattern 1: Get Token and Use It

```typescript
import { getAccessToken, isValidJWTFormat } from '@/lib/supabaseAuth'

async function fetchUserData() {
  try {
    // Step 1: Get token safely
    const token = await getAccessToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    // Step 2: Validate format
    if (!isValidJWTFormat(token)) {
      throw new Error('Invalid token format')
    }

    // Step 3: Build header (NOT included in token)
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${token}`)

    // Step 4: Make request
    const response = await fetch('/api/data', { headers })

    if (!response.ok) {
      const error = await response.text()
      console.error('Request failed:', error)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
```

---

### Pattern 2: Use fetchWithAuth Helper

```typescript
import { fetchWithAuth } from '@/lib/supabaseAuth'

async function fetchUserData() {
  try {
    // Handles token retrieval, validation, and header building
    const response = await fetchWithAuth('/api/data', {
      method: 'GET',
      includeAuth: true,
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
```

---

### Pattern 3: Protected API Route

```typescript
// app/api/protected/route.ts
import { withAuth } from '@/lib/authMiddleware'

export const GET = withAuth(async (request, user) => {
  // If we reach here, token is valid and user is authenticated
  console.log('Request from user:', user.email)

  return new Response(
    JSON.stringify({ 
      message: 'This is protected data',
      user: user.email 
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
```

---

## Console Debugging

Enable detailed logs by checking browser console (F12):

```
[Supabase] Initializing Supabase client...
[Supabase] Access token retrieved successfully
[Supabase] Token format: 3 parts
[Supabase] Auth header built
```

If you see:
```
[Supabase] No session found
[Supabase] Session exists but access_token is null/undefined
[Supabase] Invalid JWT format
```

Then the user is not properly authenticated. Check:
1. Is user logged in?
2. Is session being persisted?
3. Did session expire?

---

## Files Provided

| File | Purpose |
|------|---------|
| `lib/supabaseAuth.ts` | Token retrieval, validation, and helper functions |
| `lib/authMiddleware.ts` | Middleware for protecting API routes |
| `lib/supabaseClient.ts` | Updated Supabase client with better config |
| `app/api/auth/user/route.ts` | Get authenticated user endpoint |
| `app/api/auth/session/route.ts` | Get session and token info endpoint |
| `components/AuthExample.tsx` | Example component showing proper usage |

---

## Checklist for Fixing "Invalid Compact JWS"

- [ ] Verify environment variables are set and correct
- [ ] Check user is actually authenticated (not null session)
- [ ] Use `getAccessToken()` helper instead of direct access
- [ ] Validate token format with `isValidJWTFormat()`
- [ ] Ensure token is NOT already prefixed with "Bearer "
- [ ] Enable auto-refresh in Supabase client config
- [ ] Use `fetchWithAuth()` helper for authenticated requests
- [ ] Check browser console for debug logs
- [ ] Test with `/api/auth/session` endpoint
- [ ] Verify token is not expired
- [ ] Check API is receiving "Authorization: Bearer xxxxx" (not "Bearer Bearer" or "Bearer undefined")
