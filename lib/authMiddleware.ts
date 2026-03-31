/**
 * Middleware helper for API routes to safely handle authentication
 * Usage: Add this to your API route middleware to validate tokens
 */

import { supabase } from '@/lib/supabaseClient'
import { getAccessToken, isValidJWTFormat } from '@/lib/supabaseAuth'

/**
 * Validate and extract token from Authorization header
 * Safely handles cases where token might be null, undefined, or malformed
 */
export function extractTokenFromHeader(authHeader: string | null | undefined): string | null {
  if (!authHeader || typeof authHeader !== 'string') {
    console.error('[Auth Middleware] Authorization header is missing or invalid')
    return null
  }

  // Handle "Bearer token" format
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7) // Remove "Bearer " prefix

    if (!token || token === 'undefined' || token === 'null') {
      console.error('[Auth Middleware] Token value is invalid:', token)
      return null
    }

    if (!isValidJWTFormat(token)) {
      console.error('[Auth Middleware] Invalid JWT format in Authorization header')
      return null
    }

    return token
  }

  // If no "Bearer " prefix, treat the whole string as token
  if (!isValidJWTFormat(authHeader)) {
    console.error('[Auth Middleware] Invalid JWT format in Authorization header')
    return null
  }

  return authHeader
}

/**
 * Verify token is valid and not expired
 */
export async function verifyToken(token: string) {
  if (!token || !isValidJWTFormat(token)) {
    console.error('[Auth Middleware] Token validation failed - invalid format')
    return null
  }

  try {
    // Call Supabase to verify the token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error) {
      console.error('[Auth Middleware] Token verification failed:', error.message)
      return null
    }

    if (!user) {
      console.error('[Auth Middleware] Token is valid but no user data returned')
      return null
    }

    console.debug('[Auth Middleware] Token verified successfully', {
      userId: user.id,
      email: user.email,
    })

    return user
  } catch (error) {
    console.error('[Auth Middleware] Unexpected error during token verification:', error)
    return null
  }
}

/**
 * Express-style middleware for protected API routes
 * Usage in your API route:
 * 
 * import { withAuth } from '@/lib/authMiddleware'
 * 
 * export const GET = withAuth(async (req, user) => {
 *   // user is guaranteed to be valid here
 *   return Response.json({ data: user.email })
 * })
 */
export function withAuth(
  handler: (request: Request, user: any) => Promise<Response> | Response
) {
  return async (request: Request) => {
    try {
      // Get Authorization header
      const authHeader = request.headers.get('Authorization')

      if (!authHeader) {
        console.error('[Auth Middleware] No Authorization header provided')
        return new Response(JSON.stringify({ error: 'Authorization header missing' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Extract and validate token
      const token = extractTokenFromHeader(authHeader)

      if (!token) {
        console.error('[Auth Middleware] Failed to extract valid token from Authorization header')
        return new Response(JSON.stringify({ error: 'Invalid or malformed token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Verify token
      const user = await verifyToken(token)

      if (!user) {
        console.error('[Auth Middleware] Token verification failed')
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Call handler with verified user
      return await handler(request, user)
    } catch (error) {
      console.error('[Auth Middleware] Unexpected error in withAuth middleware:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}
