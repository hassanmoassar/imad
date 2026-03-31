import { supabase } from './supabaseClient'

/**
 * Safely get the current session and access token
 * Includes null/undefined checks and error handling
 */
export async function getAccessToken() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('[Supabase] Error getting session:', error.message)
      return null
    }

    if (!session) {
      console.warn('[Supabase] No session found - user may not be authenticated')
      return null
    }

    const token = session.access_token

    if (!token) {
      console.error('[Supabase] Session exists but access_token is null/undefined')
      return null
    }

    // Validate token format: should be 3 parts separated by dots (JWT format)
    if (!isValidJWTFormat(token)) {
      console.warn('[Supabase] JWT format validation failed, but returning token anyway')
      console.warn('[Supabase] Token length:', token.length)
      console.warn('[Supabase] Token start:', token.substring(0, 50) + '...')
      console.warn('[Supabase] Token parts:', token.split('.').length)
      // Don't fail - just warn and return the token
    }

    console.debug('[Supabase] Access token retrieved successfully', {
      tokenLength: token.length,
      tokenStart: token.substring(0, 20) + '...',
      expiresAt: session.expires_at,
    })

    return token
  } catch (error) {
    console.error('[Supabase] Unexpected error in getAccessToken:', error)
    return null
  }
}

/**
 * Get the refresh token
 */
export async function getRefreshToken() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('[Supabase] Error getting session for refresh token:', error.message)
      return null
    }

    if (!session) {
      console.warn('[Supabase] No session found for refresh token')
      return null
    }

    const token = session.refresh_token

    if (!token) {
      console.error('[Supabase] Refresh token is null/undefined')
      return null
    }

    console.debug('[Supabase] Refresh token retrieved successfully', {
      tokenLength: token.length,
      tokenStart: token.substring(0, 20) + '...',
    })

    return token
  } catch (error) {
    console.error('[Supabase] Unexpected error in getRefreshToken:', error)
    return null
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('[Supabase] Error getting user:', error.message)
      return null
    }

    if (!user) {
      console.warn('[Supabase] No user found - not authenticated')
      return null
    }

    console.debug('[Supabase] User retrieved successfully', {
      userId: user.id,
      email: user.email,
    })

    return user
  } catch (error) {
    console.error('[Supabase] Unexpected error in getCurrentUser:', error)
    return null
  }
}

/**
 * Validate JWT format
 * A valid JWT should have 3 parts separated by dots: xxxxx.yyyyy.zzzzz
 */
export function isValidJWTFormat(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') {
    return false
  }

  const parts = token.split('.')

  // JWT should have exactly 3 parts
  if (parts.length !== 3) {
    console.error('[Supabase] Invalid JWT: expected 3 parts, got', parts.length)
    return false
  }

  // Each part should be non-empty
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i] || parts[i].trim() === '') {
      console.error(`[Supabase] Invalid JWT: part ${i + 1} is empty`)
      return false
    }
  }

  // Header and payload should be valid base64url
  try {
    // Decode header
    const headerDecoded = JSON.parse(Buffer.from(parts[0], 'base64url').toString())
    // Decode payload
    const payloadDecoded = JSON.parse(Buffer.from(parts[1], 'base64url').toString())

    console.debug('[Supabase] JWT decoded successfully', {
      alg: headerDecoded.alg,
      typ: headerDecoded.typ,
      sub: payloadDecoded.sub,
    })

    return true
  } catch (error) {
    console.error('[Supabase] Invalid JWT encoding:', error)
    return false
  }
}

/**
 * Build Authorization header safely
 * Returns null if token is invalid to prevent "Bearer undefined" errors
 */
export async function buildAuthHeader() {
  const token = await getAccessToken()

  if (!token) {
    console.warn('[Supabase] Cannot build auth header - token is null/undefined')
    return null
  }

  // Token should NOT have "Bearer " prefix - that's added by the header
  // Return just the token
  const authHeader = `Bearer ${token}`

  console.debug('[Supabase] Auth header built', {
    headerStart: authHeader.substring(0, 30) + '...',
  })

  return authHeader
}

/**
 * Fetch helper with automatic token attachment and error handling
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit & { includeAuth?: boolean } = { includeAuth: true }
) {
  const { includeAuth = true, ...requestOptions } = options

  // Build headers
  const headers = new Headers(requestOptions.headers || {})

  // Add authorization if requested
  if (includeAuth) {
    const authHeader = await buildAuthHeader()

    if (!authHeader) {
      console.error('[Supabase] Cannot make authenticated request - no valid token available')
      throw new Error('No valid authentication token available')
    }

    headers.set('Authorization', authHeader)
  }

  console.debug('[Supabase] Making fetch request', {
    url,
    hasAuth: includeAuth,
    method: requestOptions.method || 'GET',
    headerKeys: Array.from(headers.keys()),
  })

  try {
    const response = await fetch(url, {
      ...requestOptions,
      headers,
    })

    // Log response status
    console.debug('[Supabase] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Supabase] Request failed', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
      })
    }

    return response
  } catch (error) {
    console.error('[Supabase] Fetch error:', error)
    throw error
  }
}
