import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast in dev to make missing env obvious
  // eslint-disable-next-line no-console
  console.error('[Supabase] Missing environment variables:')
  if (!supabaseUrl) console.error('[Supabase] - NEXT_PUBLIC_SUPABASE_URL is missing')
  if (!supabaseAnonKey) console.error('[Supabase] - NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
}

// Validate URL format
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.error('[Supabase] URL should start with https://')
}

// Log initialization (development only)
if (process.env.NODE_ENV === 'development') {
  console.debug('[Supabase] Initializing Supabase client', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey.length,
    keyStart: supabaseAnonKey.substring(0, 10) + '...',
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // Enable automatic session refresh
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
