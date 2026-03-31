/**
 * EXAMPLE: How to update your existing code to use the new auth utilities
 * 
 * This shows the transformation from potentially problematic code to safe code
 */

// ============================================================================
// BEFORE: Potentially problematic (what you might have)
// ============================================================================

// ❌ OLD - No error handling for null tokens
async function oldWayToFetchData() {
  const { data: { session } } = await supabase.auth.getSession()
  
  // If session is null, this becomes "Bearer undefined"
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${session?.access_token}`)
  
  // This will fail with "Invalid Compact JWS" if token is undefined
  const response = await fetch('/api/data', { headers })
  return response.json()
}

// ============================================================================
// AFTER: Safe and proper (what you should use now)
// ============================================================================

// ✅ NEW - With proper error handling
import { getAccessToken, fetchWithAuth } from '@/lib/supabaseAuth'

async function newWayToFetchData() {
  // Method 1: Using fetchWithAuth helper (recommended)
  const response = await fetchWithAuth('/api/data', {
    method: 'GET',
    includeAuth: true, // Automatically handles token
  })
  
  if (!response.ok) {
    console.error('Request failed:', response.status)
    return null
  }
  
  return response.json()
}

// Method 2: Manual token retrieval (if you need custom headers)
async function customFetch() {
  const token = await getAccessToken()
  
  // Null check - this prevents "Bearer undefined"
  if (!token) {
    console.error('Authentication required')
    return null
  }
  
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')
  
  const response = await fetch('/api/data', {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: 'example' }),
  })
  
  if (!response.ok) {
    console.error('Request failed:', response.status)
    return null
  }
  
  return response.json()
}

// ============================================================================
// EXAMPLE: Updating your admin programs page
// ============================================================================

// OLD VERSION (your current code)
import { supabase } from '@/lib/supabaseClient'

async function loadProgramsOLD(page: number) {
  try {
    const from = (page - 1) * 10
    const to = from + 10 - 1
    
    // This works fine with Supabase client directly
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .range(from, to)
      .order('id', { ascending: true })
    
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error loading programs:', err)
    return []
  }
}

// NEW VERSION (with logging and better error handling)
import { supabase } from '@/lib/supabaseClient'
import { getCurrentUser } from '@/lib/supabaseAuth'

async function loadProgramsNEW(page: number) {
  try {
    // Optional: Verify user is authenticated before loading data
    const user = await getCurrentUser()
    if (!user) {
      console.warn('User not authenticated, but proceeding with public data')
    }
    
    console.debug('[Admin] Loading programs for page:', page)
    
    const from = (page - 1) * 10
    const to = from + 10 - 1
    
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .range(from, to)
      .order('id', { ascending: true })
    
    if (error) {
      console.error('[Admin] Error loading programs:', error.message)
      throw error
    }
    
    console.debug('[Admin] Loaded', data?.length, 'programs')
    return data || []
  } catch (err) {
    console.error('[Admin] Unexpected error:', err)
    return []
  }
}

// ============================================================================
// EXAMPLE: Create a protected admin API route
// ============================================================================

// Create this file: app/api/admin/programs/route.ts
import { withAuth } from '@/lib/authMiddleware'
import { supabase } from '@/lib/supabaseClient'

export const GET = withAuth(async (request, user) => {
  try {
    console.debug('[API] Admin program list requested by:', user.email)
    
    // Optional: Check if user has admin role (requires role column in user_metadata)
    // if (user.user_metadata?.role !== 'admin') {
    //   return new Response(
    //     JSON.stringify({ error: 'Admin access required' }),
    //     { status: 403 }
    //   )
    // }
    
    // Get query params
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const search = url.searchParams.get('search') || ''
    
    const from = (page - 1) * 10
    const to = from + 10 - 1
    
    let query = supabase
      .from('programs')
      .select('*')
      .range(from, to)
      .order('id', { ascending: true })
    
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('[API] Error loading programs:', error.message)
      throw error
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data,
        count: data?.length || 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})

// ============================================================================
// EXAMPLE: Use the API route in your client component
// ============================================================================

'use client'

import { useEffect, useState } from 'react'
import { fetchWithAuth } from '@/lib/supabaseAuth'

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadPrograms()
  }, [page])

  async function loadPrograms() {
    setLoading(true)
    try {
      // Use the fetchWithAuth helper
      const response = await fetchWithAuth(
        `/api/admin/programs?page=${page}`,
        {
          method: 'GET',
          includeAuth: true,
        }
      )

      if (!response.ok) {
        console.error('Failed to load programs:', response.status)
        return
      }

      const { data } = await response.json()
      setPrograms(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Admin Programs</h1>
      {loading && <p>Loading...</p>}
      <ul>
        {programs.map((p: any) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  )
}
