# Admin Login - Quick Reference

## Access Admin Panel

**URL:** `http://localhost:3000/admin/login`

---

## Setup (First Time Only)

### 1. Create Admin User in Supabase

**Go to:** https://app.supabase.com
- Select your project
- **Authentication** → **Users** → **Create user**

**Fill in:**
```
Email: admin@example.com
Password: AdminPassword123! (or your own)
Auto confirm user: YES (optional)
```

**Click:** Create user

### 2. Login to Your App

Visit: `http://localhost:3000/admin/login`

**Enter:**
```
Email: admin@example.com
Password: AdminPassword123!
```

**Click:** Sign In

---

## Features

✅ **Secure Login**
- Email & password authentication
- Show/hide password toggle
- Error messages with console debug logs

✅ **Protected Admin Area**
- Auto-checks if logged in
- Redirects to login if not authenticated
- Session persistence across browser reloads

✅ **Logout**
- Button in sidebar (top right)
- Clears session and redirects to login

---

## Admin Routes

| Page | URL | Access |
|------|-----|--------|
| Login | `/admin/login` | Anyone |
| Dashboard | `/admin` | Logged in only |
| Programs | `/admin/programs` | Logged in only |
| Add Program | `/admin/programs/create` | Logged in only |

---

## How It Works

### 1. **Without Login**
```
Try to visit: http://localhost:3000/admin
→ Redirects to: http://localhost:3000/admin/login
```

### 2. **Login Page**
```
Enter email & password
Click "Sign In"
→ Creates Supabase session
→ Redirects to: http://localhost:3000/admin
```

### 3. **In Admin**
```
Sidebar shows your email
Click "Logout"
→ Clears session
→ Redirects to: http://localhost:3000/admin/login
```

---

## Troubleshooting

### "Invalid email or password"
- Check email is correct
- Check password is correct
- Verify user exists in Supabase

### Keeps redirecting to login
- Session may have expired
- Try logging in again
- Check browser console (F12) for errors

### See error message
- Check browser console (F12) for `[Admin Login]` logs
- Logs will show exactly what failed

---

## Console Debug

Open browser DevTools (F12) and go to Console tab.

**Look for logs:**
```
[Admin Login] Attempting login...
[Admin Login] Sign in successful...
[Admin Login] Login successful for user: ...
[AdminLayout] User authorized: ...
```

**If error:**
```
[Admin Login] Sign in failed: Invalid login credentials
```

---

## Browser Console Test

Paste in browser console to check session:
```javascript
const response = await fetch('/api/auth/session')
const data = await response.json()
console.log('Auth status:', data)
```

If `authenticated: true`, you're logged in.

---

## File Structure

```
app/admin/
├── login/
│   └── page.tsx          ← Login page
├── layout.tsx            ← Protected layout
├── page.tsx              ← Dashboard
└── programs/
    ├── page.tsx
    └── create/page.tsx

components/
└── AdminSidebar.tsx      ← Sidebar with logout
```

---

## Demo Credentials (Example)

The login page shows these as reference:

```
Email: admin@example.com
Password: AdminPassword123!
```

Create your own credentials in Supabase and use those instead.

---

## Done! 🎉

You now have a fully functional admin login system with:
- ✅ Secure authentication via Supabase
- ✅ Protected admin area
- ✅ Logout functionality
- ✅ Session persistence
- ✅ Debug logging
