'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getCurrentUser, getAccessToken } from '@/lib/supabaseAuth'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Check if already logged in
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser()
        if (user) {
          // Already logged in, redirect to dashboard
          router.push('/admin')
        }
      } finally {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('[Admin Login] Attempting login with email:', email)

      // Step 1: Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('[Admin Login] Sign in failed:', signInError.message)
        throw new Error(signInError.message || 'Login failed')
      }

      if (!data.session) {
        console.error('[Admin Login] No session returned')
        throw new Error('No session returned from login')
      }

      console.log('[Admin Login] Sign in successful, got session')

      // Step 2: Verify user info
      const user = await getCurrentUser()
      if (!user) {
        console.error('[Admin Login] Failed to get user info')
        throw new Error('Failed to get user info')
      }

      console.log('[Admin Login] Login successful for user:', user.email)

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed'
      console.error('[Admin Login] Error:', errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      setLoading(true)
      console.log('[Admin Login] Logging out...')
      await supabase.auth.signOut()
      console.log('[Admin Login] Logged out successfully')
      setEmail('')
      setPassword('')
      // Refresh page to clear state
      router.refresh()
    } catch (err) {
      console.error('[Admin Login] Logout error:', err)
      setError('Logout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-neutral-400">Morocco Voyages Management</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <p className="font-semibold">Login Error</p>
              <p className="mt-1">{error}</p>
              <p className="text-xs mt-2 text-red-600">
                Check browser console (F12) for debug details
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 transition-colors"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 transition-colors"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 text-sm"
                  disabled={loading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full px-4 py-2.5 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 mb-3">
              <strong>Demo Credentials:</strong>
            </p>
            <div className="bg-neutral-50 p-3 rounded text-xs text-neutral-600 space-y-1">
              <p>Email: <code className="bg-neutral-200 px-2 py-1 rounded">admin@example.com</code></p>
              <p>Password: <code className="bg-neutral-200 px-2 py-1 rounded">AdminPassword123!</code></p>
              <p className="mt-2 text-neutral-500">
                Create these credentials in Supabase Authentication, or use your own.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-neutral-400 text-sm">
          <p>© 2026 Morocco Voyages. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
