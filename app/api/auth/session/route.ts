/**
 * API Route: GET /api/auth/session
 * Returns current session info including token status
 * 
 * Usage:
 * const response = await fetchWithAuth('/api/auth/session', { includeAuth: true })
 * const { session } = await response.json()
 */

import { supabase } from '@/lib/supabaseClient'
import { isValidJWTFormat } from '@/lib/supabaseAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    console.debug('[API] GET /api/auth/session')

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('[API] Error getting session:', error.message)
      return new Response(
        JSON.stringify({ error: 'Failed to get session', details: error.message }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!session) {
      console.warn('[API] No session found')
      return new Response(
        JSON.stringify({
          authenticated: false,
          session: null,
          message: 'User is not authenticated',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const accessToken = session.access_token
    const refreshToken = session.refresh_token

    return new Response(
      JSON.stringify({
        authenticated: true,
        session: {
          user: {
            id: session.user.id,
            email: session.user.email,
          },
          expiresAt: session.expires_at,
          expiresIn: session.expires_in,
          tokens: {
            access: {
              present: !!accessToken,
              valid: isValidJWTFormat(accessToken),
              format: accessToken
                ? `${accessToken.split('.').length} parts`
                : 'null/undefined',
              length: accessToken?.length || 0,
              preview: accessToken ? accessToken.substring(0, 20) + '...' : 'N/A',
            },
            refresh: {
              present: !!refreshToken,
              valid: isValidJWTFormat(refreshToken),
              format: refreshToken
                ? `${refreshToken.split('.').length} parts`
                : 'null/undefined',
              length: refreshToken?.length || 0,
              preview: refreshToken ? refreshToken.substring(0, 20) + '...' : 'N/A',
            },
          },
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('[API] Unexpected error in GET /api/auth/session:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
