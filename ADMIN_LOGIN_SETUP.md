# Admin Login Setup Guide

Your admin login is now ready! Follow these steps to create admin credentials.

---

## Quick Setup (5 minutes)

### Step 1: Go to Supabase Dashboard
Visit: https://app.supabase.com → Select your project

### Step 2: Create Admin User
**Go to:** Authentication → Users → Create user

**Fill in:**
- Email: `admin@example.com` (or your preferred email)
- Password: Create a strong password (e.g., `AdminPassword123!`)
- ✅ Auto send sign up confirmation: YES (or NO if you prefer)

**Click:** Create user

### Step 3: Test Login
1. Open your app: `http://localhost:3000/admin/login`
2. Enter the email and password you created
3. Click "Sign In"
4. You should be redirected to the admin dashboard

---

## Login Flow

### Accessing Admin
```
http://localhost:3000/admin
```

**What happens:**
1. ✅ If logged in → Shows admin dashboard
2. ❌ If not logged in → Redirects to `/admin/login`

### Login Page
```
http://localhost:3000/admin/login
```

**Features:**
- ✅ Email/password login
- ✅ Show/hide password toggle
- ✅ Error messages with console debug logs
- ✅ Auto-redirects if already logged in

### Logout
- Click "Logout" button in sidebar
- Redirects to login page

---

## Features Included

✅ **Secure Login Page**
- Email & password validation
- Show/hide password toggle
- Error display with helpful messages

✅ **Protected Admin Area**
- Automatic auth check on layout load
- Redirects to login if not authenticated
- Session persistence

✅ **Logout Functionality**
- Button in admin sidebar
- Clears session
- Redirects to login

✅ **Debug Logging**
- Console logs for troubleshooting
- Detailed error messages
- Token validation

---

## File Structure

```
app/
├── admin/
│   ├── layout.tsx           ← Protected layout with auth check
│   ├── login/
│   │   └── page.tsx         ← Login page
│   ├── page.tsx             ← Dashboard
│   └── programs/
│       └── ...

components/
└── AdminSidebar.tsx         ← Updated with logout button
```

---

## Demo Credentials

When you first visit the login page, it shows:

**Email:** `admin@example.com`
**Password:** `AdminPassword123!`

These are suggestions - create your own credentials in Supabase.

---

## Troubleshooting

### Can't Login
1. Check console logs (F12) for error messages
2. Verify user exists in Supabase Authentication
3. Verify email/password are correct
4. Check Supabase is responding (no network errors)

### Keeps Redirecting to Login
1. Session may have expired
2. Token may be invalid
3. Check browser console for auth errors
4. Try logging in again

### See "Invalid Compact JWS" Error
This means the auth token is invalid. Check:
- [ ] Supabase credentials are correct in `.env.local`
- [ ] Network connection is stable
- [ ] User exists in Supabase Authentication
- [ ] Supabase project is active (not paused)

---

## Browser Console Debug Logs

When you login, check console (F12) for logs starting with `[Admin]`:

**Good logs:**
```
[Admin Login] Attempting login with email: admin@example.com
[Admin Login] Sign in successful, got session
[Admin Login] Access token verified
[Admin Login] Login successful for user: admin@example.com
[AdminLayout] Checking authorization...
[AdminLayout] User authorized: admin@example.com
```

**Error logs will explain what went wrong:**
```
[Admin Login] Sign in failed: Invalid login credentials
[Admin Login] Failed to retrieve access token
[AdminSidebar] Logout error: ...
```

---

## URLs

| Page | URL | Protected |
|------|-----|-----------|
| Login | `/admin/login` | No |
| Dashboard | `/admin` | Yes |
| Programs | `/admin/programs` | Yes |
| Add Program | `/admin/programs/create` | Yes |

---

## Testing Checklist

- [ ] Create admin user in Supabase
- [ ] Navigate to `/admin/login`
- [ ] Enter credentials and click "Sign In"
- [ ] Should redirect to `/admin` dashboard
- [ ] Sidebar shows logged-in email
- [ ] Click "Logout" button
- [ ] Should redirect to `/admin/login`
- [ ] Try accessing `/admin` directly when logged out
- [ ] Should redirect to `/admin/login`
- [ ] Check browser console (F12) for debug logs

---

## Security Notes

✅ **What's Protected:**
- All `/admin/*` routes require authentication
- Automatic session validation
- Token refresh on expiration
- Logout clears session

⚠️ **What You Should Do:**
- Use strong, unique passwords
- Don't share credentials
- Enable MFA in Supabase (optional)
- Monitor admin user activity
- Use separate admin account from regular users

---

## Next Steps

1. ✅ Create admin user in Supabase
2. ✅ Test login at `/admin/login`
3. ✅ Check console logs for success
4. ✅ Explore admin dashboard
5. ✅ Test adding programs
6. ✅ Test logout

You're all set! 🚀
