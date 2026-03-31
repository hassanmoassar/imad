'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getCurrentUser } from '@/lib/supabaseAuth'

export default function AdminSidebar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error('[AdminSidebar] Error loading user:', err)
      }
    }
    loadUser()
  }, [])

  async function handleLogout() {
    try {
      setLoading(true)
      console.log('[AdminSidebar] Logging out...')
      await supabase.auth.signOut()
      console.log('[AdminSidebar] Logged out successfully')
      router.push('/admin/login')
    } catch (err) {
      console.error('[AdminSidebar] Logout error:', err)
      alert('Logout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <aside className="w-64 bg-neutral-900 text-white h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-700">
        <h2 className="text-xl font-bold">Admin</h2>
        <p className="text-xs text-neutral-400 mt-1">Morocco Voyages</p>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-6 border-b border-neutral-700">
          <p className="text-xs text-neutral-400">Logged in as</p>
          <p className="text-sm font-semibold text-white truncate">{user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/admin"
          className="block px-3 py-2.5 rounded hover:bg-neutral-800 transition-colors text-sm"
        >
          📊 Dashboard
        </Link>
        <Link
          href="/admin/programs"
          className="block px-3 py-2.5 rounded hover:bg-neutral-800 transition-colors text-sm"
        >
          🎫 Programs
        </Link>
        <Link
          href="/admin/programs/create"
          className="block px-3 py-2.5 rounded hover:bg-neutral-800 transition-colors text-sm"
        >
          ➕ Add Program
        </Link>
        <Link
          href="/admin/reservations"
          className="block px-3 py-2.5 rounded hover:bg-neutral-800 transition-colors text-sm"
        >
          📅 Reservations
        </Link>
        <Link
          href="/"
          className="block px-3 py-2.5 rounded hover:bg-neutral-800 transition-colors text-sm"
        >
          🏠 Back to Site
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-neutral-700">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full px-3 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded font-semibold text-sm transition-colors"
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}
