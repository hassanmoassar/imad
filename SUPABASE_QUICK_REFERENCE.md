# Quick Reference: Supabase Authentication

## TL;DR - Fix "Invalid Compact JWS"

```typescript
// ❌ WRONG
const token = session.access_token // Could be undefined!
const header = `Bearer ${token}` // Results in "Bearer undefined"

// ✅ CORRECT
import { getAccessToken } from '@/lib/supabaseAuth'
const token = await getAccessToken() // Returns null if invalid
if (token) {
  const header = `Bearer ${token}` // Correct format
}
```

---

## Usage Examples

### Get Current User
```typescript
import { getCurrentUser } from '@/lib/supabaseAuth'

const user = await getCurrentUser()
if (user) {
  console.log(user.email)
} else {
  console.log('Not authenticated')
}
```

### Get Access Token
```typescript
import { getAccessToken, isValidJWTFormat } from '@/lib/supabaseAuth'

const token = await getAccessToken()
if (token && isValidJWTFormat(token)) {
  // Safe to use token
  const header = `Bearer ${token}`
} else {
  console.error('No valid token')
}
```

### Make Authenticated Fetch Request
```typescript
import { fetchWithAuth } from '@/lib/supabaseAuth'

const response = await fetchWithAuth('/api/data', {
  method: 'GET',
  includeAuth: true, // Automatically adds Authorization header
})

if (response.ok) {
  const data = await response.json()
}
```

### Protect an API Route
```typescript
// app/api/protected/route.ts
import { withAuth } from '@/lib/authMiddleware'

export const GET = withAuth(async (req, user) => {
  // User is guaranteed valid here
  return Response.json({ user: user.email })
})
```

### Check Token in Component
```typescript
'use client'

import { useEffect, useState } from 'react'
import { getAccessToken } from '@/lib/supabaseAuth'

export default function MyComponent() {
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const token = await getAccessToken()
      setIsAuth(!!token)
    }
    checkAuth()
  }, [])

  return isAuth ? <div>Authenticated</div> : <div>Not logged in</div>
}
```

---

## Token Format Check

```typescript
// Valid JWT: 3 parts separated by dots
token = "xxxxx.yyyyy.zzzzz" ✅

// Invalid: Has Bearer prefix (add Bearer in Authorization header instead)
token = "Bearer xxxxx.yyyyy.zzzzz" ❌

// Invalid: Only 2 parts
token = "xxxxx.yyyyy" ❌

// Invalid: Is null or undefined
token = null / undefined ❌
```

---

## Environment Variables

Set these in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Debugging

### Check Session Status
```typescript
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session ? 'Valid' : 'None')
```

### Check Token Validity
```typescript
import { isValidJWTFormat } from '@/lib/supabaseAuth'
const token = session?.access_token
console.log('Token valid:', isValidJWTFormat(token))
```

### View Session Endpoint
Visit: `http://localhost:3000/api/auth/session`

Shows detailed token and session info in JSON format.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Invalid Compact JWS` | Token is null/undefined | Use `getAccessToken()` helper |
| `Invalid Compact JWS` | Token format wrong | Check 3 dots (xxxxx.yyyyy.zzzzz) |
| `Invalid Compact JWS` | "Bearer undefined" sent | Check token null before building header |
| `401 Unauthorized` | Token expired | Enable `autoRefreshToken: true` |
| `No session found` | User not logged in | Require authentication first |

---

## Files You Just Got

- `lib/supabaseAuth.ts` - Token helpers
- `lib/authMiddleware.ts` - API route protection
- `lib/supabaseClient.ts` - Updated client
- `app/api/auth/user/route.ts` - Get current user
- `app/api/auth/session/route.ts` - Debug session
- `components/AuthExample.tsx` - Usage example
- `SUPABASE_AUTH_GUIDE.md` - Detailed guide (this file's companion)

---

## Next Steps

1. **Check your token** with `/api/auth/session` endpoint
2. **Enable logging** - Check browser console (F12) for [Supabase] logs
3. **Use helpers** - Replace direct token access with `getAccessToken()`
4. **Protect routes** - Use `withAuth()` middleware for protected endpoints
5. **Test** - Use `AuthExample` component to verify setup
