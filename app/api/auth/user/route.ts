/**
 * API Route: GET /api/auth/user
 * Returns the current authenticated user
 * 
 * Usage:
 * const response = await fetchWithAuth('/api/auth/user', { includeAuth: true })
 * const { user } = await response.json()
 */

import { withAuth } from '@/lib/authMiddleware'

export const GET = withAuth(async (request, user) => {
  console.debug('[API] GET /api/auth/user', { userId: user.id })

  return new Response(
    JSON.stringify({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        userMetadata: user.user_metadata,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
})
