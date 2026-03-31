import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export const metadata = {
  title: 'Admin - Morocco Voyages',
}

export default async function ProtectedAdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Create Supabase client for server-side auth check
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Admin Layout] Missing Supabase env vars')
    redirect('/admin/login')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Check if user is authenticated
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error || !session) {
      console.log('[Admin Layout] No session found, redirecting to login')
      redirect('/admin/login')
    }

    console.log('[Admin Layout] Session valid for user:', session.user?.email)
  } catch (err) {
    console.error('[Admin Layout] Auth check error:', err)
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
