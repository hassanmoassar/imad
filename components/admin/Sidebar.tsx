'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getCurrentUser } from '@/lib/supabaseAuth'
import {
  LayoutDashboard,
  Package,
  Plus,
  Calendar,
  LogOut,
  ChevronRight,
  Globe,
} from 'lucide-react'
import { Button } from './Button'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export function AdminSidebar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error('[AdminSidebar] Error loading user:', err)
      }
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (err) {
      console.error('[AdminSidebar] Logout error:', err)
    } finally {
      setLoading(false)
    }
  }

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Programs', href: '/admin/programs', icon: <Package className="w-5 h-5" /> },
    { label: 'Add Program', href: '/admin/programs/create', icon: <Plus className="w-5 h-5" /> },
    { label: 'Reservations', href: '/admin/reservations', icon: <Calendar className="w-5 h-5" /> },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={`
        h-screen sticky top-0 bg-white border-r border-slate-200
        flex flex-col transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Admin</h2>
              <p className="text-xs text-slate-500">Morocco Voyages</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {user && !isCollapsed && (
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
              {user.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {active && <ChevronRight className="w-4 h-4" />}
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Back to Website */}
      <div className="px-3 py-4 border-t border-slate-200">
        <Link href="/">
          <div className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200">
            <Globe className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">View Website</span>}
          </div>
        </Link>
      </div>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-200">
        <Button
          variant="danger"
          size="sm"
          onClick={handleLogout}
          isLoading={loading}
          className="w-full justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && 'Logout'}
        </Button>
      </div>

      {/* Collapse Toggle - Optional */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mx-3 mb-2 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        <ChevronRight className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
      </button>
    </aside>
  )
}
