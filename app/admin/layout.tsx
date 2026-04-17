'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/Sidebar'
import { AdminTopbar } from '@/components/admin/Topbar'
import { getCurrentUser } from '@/lib/supabaseAuth'

const pageConfig: Record<string, { title: string; subtitle?: string }> = {
  '/admin': { title: 'Dashboard', subtitle: 'Welcome back to your admin panel' },
  '/admin/programs': { title: 'Programs', subtitle: 'Manage all travel programs' },
  '/admin/programs/create': { title: 'Create Program', subtitle: 'Add a new travel program' },
  '/admin/reservations': { title: 'Reservations', subtitle: 'Manage customer reservations' },
  '/admin/login': { title: 'Admin Login', subtitle: 'Sign in to your account' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin/login'
  const pageInfo = pageConfig[pathname] || { title: 'Admin Panel' }

  // ... (auth check logic stays the same) ...
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()

        if (!user) {
          if (!isLoginPage) {
            router.push('/admin/login')
          }
          return
        }

        setIsAuthorized(true)
      } catch (err) {
        console.error('[AdminLayout] Auth check error:', err)
        if (!isLoginPage) {
          router.push('/admin/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, isLoginPage])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page without layout
  if (isLoginPage) {
    return children
  }

  // Show protected pages with layout
  if (!isAuthorized) {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans">
      {/* Sidebar - Dark Modern */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white md:bg-transparent">
        {/* Topbar - Glassmorphism */}
        <AdminTopbar
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Page Content - Improved viewport handling */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
          <div className="p-4 sm:p-8 lg:p-10 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
