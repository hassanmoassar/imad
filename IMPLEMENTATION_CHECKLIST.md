# Implementation Checklist

Complete these steps to fix the "Invalid Compact JWS" error in your Supabase authentication.

---

## Phase 1: Verify Environment (5 minutes)

- [ ] Check `.env.local` has these variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  ```

- [ ] Verify the URL starts with `https://` (not `http://`)

- [ ] Restart dev server after checking env vars:
  ```bash
  npm run dev
  ```

---

## Phase 2: Test Token Status (10 minutes)

- [ ] Open your app in browser

- [ ] Visit: `http://localhost:3000/api/auth/session`

- [ ] Check the JSON response:
  - `authenticated: true` ? (Yes = user is logged in)
  - `tokens.access.valid: true` ? (Yes = token is valid)
  - `tokens.access.present: true` ? (Yes = token exists)

- [ ] If not authenticated:
  - User needs to log in first
  - Create a login page if you don't have one

- [ ] If token is invalid:
  - Token might be corrupted
  - Try logging out and back in

---

## Phase 3: Add Debug Component (5 minutes)

- [ ] Create test page:
  ```tsx
  // app/auth-test/page.tsx
  import AuthExample from '@/components/AuthExample'
  
  export default function AuthTestPage() {
    return <AuthExample />
  }
  ```

- [ ] Visit: `http://localhost:3000/auth-test`

- [ ] Open browser DevTools (F12)

- [ ] Check Console tab for logs starting with `[Supabase]`

- [ ] Click "Make Authenticated Request" button

- [ ] Check console for success or error

---

## Phase 4: Update Your Code (20 minutes)

### Option A: Direct Supabase Queries (No changes needed)

If you're using Supabase client directly:
```typescript
const { data } = await supabase.from('programs').select('*')
```

✅ These already work correctly - no changes needed

---

### Option B: Fetch/Axios Requests (Update required)

#### Before: ❌ Potentially problematic
```typescript
const { data: { session } } = await supabase.auth.getSession()
const response = await fetch('/api/data', {
  headers: {
    Authorization: `Bearer ${session?.access_token}` // Could be undefined!
  }
})
```

#### After: ✅ Safe
```typescript
import { fetchWithAuth } from '@/lib/supabaseAuth'

const response = await fetchWithAuth('/api/data', {
  method: 'GET',
  includeAuth: true // Handles token automatically
})
```

- [ ] Find all your fetch/axios calls that use Authorization headers

- [ ] Replace with `fetchWithAuth()` helper

- [ ] Or use the manual approach with `getAccessToken()` check

See `MIGRATION_EXAMPLE.md` for complete examples.

---

## Phase 5: Create Protected API Routes (Optional but recommended)

- [ ] Create `app/api/my-data/route.ts`:
```typescript
import { withAuth } from '@/lib/authMiddleware'

export const GET = withAuth(async (req, user) => {
  return Response.json({ 
    message: `Hello ${user.email}`,
    data: 'secret data'
  })
})
```

- [ ] Call from client using `fetchWithAuth()`:
```typescript
const response = await fetchWithAuth('/api/my-data')
const { data } = await response.json()
```

---

## Phase 6: Test Everything (15 minutes)

### Test 1: Token Retrieval
- [ ] Run this in browser console:
```javascript
// Assumes you have an auth-logged-in user
const response = await fetch('/api/auth/session')
const data = await response.json()
console.log('Token valid:', data.session.tokens.access.valid)
```

### Test 2: Authenticated Request
- [ ] Visit `http://localhost:3000/auth-test`
- [ ] Click "Make Authenticated Request" button
- [ ] Check console for success message

### Test 3: API Route Protection
- [ ] Call your protected API route:
```javascript
const response = await fetch('/api/my-data')
const data = await response.json()
console.log('Response:', data)
```

### Test 4: Invalid Token Handling
- [ ] Clear browser storage to remove session:
```javascript
localStorage.clear()
sessionStorage.clear()
```
- [ ] Try to access protected route
- [ ] Should get 401 Unauthorized (not 500 error)

---

## Phase 7: Enable Debug Logging

- [ ] Check browser console (F12) → Console tab

- [ ] Look for `[Supabase]` prefixed logs:
  ```
  [Supabase] Initializing Supabase client...
  [Supabase] Access token retrieved successfully
  [Supabase] Auth header built
  ```

- [ ] If you see error logs, check the error message

- [ ] Add your own debugging if needed:
```typescript
import { getAccessToken, isValidJWTFormat } from '@/lib/supabaseAuth'

const token = await getAccessToken()
console.log('Token exists:', !!token)
console.log('Token valid:', isValidJWTFormat(token))
console.log('Token start:', token?.substring(0, 20))
```

---

## Phase 8: Production Readiness (Optional)

- [ ] Remove test auth page:
```bash
rm -r app/auth-test
```

- [ ] Keep debug logging but set to development only:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.debug('[Supabase] Debug info')
}
```

- [ ] Test with production environment variables

- [ ] Deploy and monitor for errors

---

## Troubleshooting

### "Still getting Invalid Compact JWS"

1. Check `/api/auth/session` - is token valid?
2. Check browser console - any error logs?
3. Verify token is in format: `xxxxx.yyyyy.zzzzz`
4. Check if token is null/undefined in Authorization header

### "401 Unauthorized on API routes"

1. Is Authorization header being sent?
2. Is token included in header?
3. Is token in correct format: `Bearer xxxxx.yyyyy.zzzzz`?
4. Has token expired? (Wait for auto-refresh or re-login)

### "Token is null/undefined"

1. User is not authenticated - need login
2. Session expired - need refresh
3. Check `/api/auth/session` - shows session status

See **SUPABASE_AUTH_GUIDE.md** for detailed troubleshooting.

---

## Files Reference

| File | Purpose | When to Use |
|------|---------|------------|
| `lib/supabaseAuth.ts` | Token utilities | Getting tokens, validating format |
| `lib/authMiddleware.ts` | API protection | Protecting API routes |
| `lib/supabaseClient.ts` | Supabase client | Already imported by other files |
| `SUPABASE_AUTH_GUIDE.md` | Detailed guide | When you need to understand everything |
| `SUPABASE_QUICK_REFERENCE.md` | Quick syntax | Copy-paste ready code |
| `MIGRATION_EXAMPLE.md` | Migration guide | Updating existing code |
| `SUPABASE_FIX_COMPLETE.md` | Complete overview | Understanding the full solution |

---

## Success Criteria

✅ You have completed Phase 1-8 when:

- [ ] `http://localhost:3000/api/auth/session` returns valid token info
- [ ] Browser console shows `[Supabase]` debug logs with no errors
- [ ] `http://localhost:3000/auth-test` works and shows user info
- [ ] API routes protected with `withAuth()` work correctly
- [ ] No more "Invalid Compact JWS" errors
- [ ] Token is properly formatted: `xxxxx.yyyyy.zzzzz`
- [ ] Authorization headers never send "Bearer undefined"

---

## Need Help?

1. **Quick answer?** → See `SUPABASE_QUICK_REFERENCE.md`
2. **Detailed guide?** → Read `SUPABASE_AUTH_GUIDE.md`
3. **Migration example?** → Check `MIGRATION_EXAMPLE.md`
4. **Complete overview?** → Review `SUPABASE_FIX_COMPLETE.md`
5. **Still stuck?** → Check browser console logs and `/api/auth/session` response

---

## Time Estimate

- Phase 1 (Verify): 5 min
- Phase 2 (Test): 10 min
- Phase 3 (Debug): 5 min
- Phase 4 (Update code): 20 min
- Phase 5 (API routes): 15 min (optional)
- Phase 6 (Test): 15 min
- Phase 7 (Logging): 10 min
- Phase 8 (Production): 10 min (optional)

**Total: ~40-90 minutes depending on existing code**

Start with Phases 1-3 to verify the setup, then proceed with updating your specific code.
