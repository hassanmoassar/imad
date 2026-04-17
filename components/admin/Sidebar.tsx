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
  Star,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './Button'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
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

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    if (isOpen && onClose) {
      onClose()
    }
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

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
    { label: 'Reviews', href: '/admin/reviews', icon: <Star className="w-5 h-5" /> },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 md:sticky md:top-0
          h-screen bg-slate-900 border-r border-white/5
          flex flex-col transition-all duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64 w-72'}
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 h-20 flex items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            {(!isCollapsed || (isOpen && typeof window !== 'undefined' && window.innerWidth < 768)) && (
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight leading-none">Admin</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">Morocco Voyages</p>
              </div>
            )}
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden ml-auto p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (!isCollapsed || (isOpen && typeof window !== 'undefined' && window.innerWidth < 768)) && (
          <div className="px-4 py-6">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                {user.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.email?.split('@')[0]}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[10px] text-slate-400 font-medium">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                    ${active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  {(!isCollapsed || (isOpen && typeof window !== 'undefined' && window.innerWidth < 768)) && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {active && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 space-y-2 border-t border-white/5">
          {/* Back to Website */}
          <Link href="/">
            <div className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 cursor-pointer">
              <Globe className="w-5 h-5" />
              {(!isCollapsed || (isOpen && typeof window !== 'undefined' && window.innerWidth < 768)) && (
                <span className="text-sm font-medium">Public Site</span>
              )}
            </div>
          </Link>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            isLoading={loading}
            className="w-full justify-start gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            {(!isCollapsed || (isOpen && typeof window !== 'undefined' && window.innerWidth < 768)) && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
          </Button>
        </div>

        {/* Collapse Toggle - Only on desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center h-10 mx-4 mb-4 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-white/5"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </aside>
    </>
  )
}
