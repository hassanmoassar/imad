/**
 * Example: How to use the Supabase auth utilities in a client component
 * This shows best practices for getting tokens and making authenticated requests
 */

'use client'

import { useEffect, useState } from 'react'
import { getAccessToken, getCurrentUser, fetchWithAuth } from '@/lib/supabaseAuth'

interface SessionInfo {
  token: string | null
  user: any | null
  loading: boolean
  error: string | null
}

export default function AuthExample() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    token: null,
    user: null,
    loading: true,
    error: null,
  })

  // Get current session on component mount
  useEffect(() => {
    async function loadSession() {
      try {
        console.log('[Example] Loading session...')

        // Get access token with validation
        const token = await getAccessToken()
        console.log('[Example] Access token:', {
          exists: !!token,
          valid: !!token,
        })

        // Get current user
        const user = await getCurrentUser()
        console.log('[Example] Current user:', user?.email || 'Not authenticated')

        setSessionInfo({
          token,
          user,
          loading: false,
          error: token && user ? null : 'Not authenticated',
        })
      } catch (error) {
        console.error('[Example] Error loading session:', error)
        setSessionInfo((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }))
      }
    }

    loadSession()
  }, [])

  // Example: Make an authenticated request
  const handleMakeRequest = async () => {
    try {
      console.log('[Example] Making authenticated request to /api/auth/session')

      const response = await fetchWithAuth('/api/auth/session', {
        method: 'GET',
        includeAuth: true,
      })

      console.log('[Example] Response status:', response.status)

      if (!response.ok) {
        const error = await response.text()
        console.error('[Example] Request failed:', error)
        return
      }

      const data = await response.json()
      console.log('[Example] Response data:', data)
    } catch (error) {
      console.error('[Example] Request error:', error)
    }
  }

  if (sessionInfo.loading) {
    return <div className="p-4">Loading session...</div>
  }

  return (
    <div className="p-4 space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Session Info</h2>

      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <div>
          <strong>Authenticated:</strong> {sessionInfo.user ? 'Yes' : 'No'}
        </div>

        {sessionInfo.user && (
          <>
            <div>
              <strong>Email:</strong> {sessionInfo.user.email}
            </div>
            <div>
              <strong>ID:</strong> {sessionInfo.user.id}
            </div>
          </>
        )}

        {sessionInfo.token && (
          <div>
            <strong>Token:</strong>
            <div className="font-mono text-xs mt-1 p-2 bg-white rounded break-all">
              {sessionInfo.token.substring(0, 50)}...
            </div>
          </div>
        )}

        {sessionInfo.error && (
          <div className="text-red-600">
            <strong>Error:</strong> {sessionInfo.error}
          </div>
        )}
      </div>

      <button
        onClick={handleMakeRequest}
        disabled={!sessionInfo.token}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Make Authenticated Request
      </button>

      <div className="text-xs text-gray-600">
        <p>
          Check your browser console (F12) for detailed debug logs. Look for messages
          starting with &quot;[Supabase]&quot; or &quot;[Example]&quot;
        </p>
      </div>
    </div>
  )
}
