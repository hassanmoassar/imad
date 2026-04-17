'use client'

import React from 'react'
import { Search, Bell, Settings, Menu } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function AdminTopbar({ title, subtitle, onMenuClick }: TopbarProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 h-20 flex items-center shadow-sm">
      <div className="w-full px-4 sm:px-8 flex items-center justify-between">
        {/* Left - Title & Menu Toggle */}
        <div className="flex items-center gap-6">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2.5 text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none">{title}</h1>
            {subtitle && <p className="hidden sm:block text-xs font-medium text-slate-400 mt-1.5 uppercase tracking-widest">{subtitle}</p>}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Search Bar - Modern Look */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search everything..."
              className="bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none w-48 focus:w-64 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Actions */}
            <button className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all relative group">
              <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </button>

            <button className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all group">
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </button>

            <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block" />

            {/* User Avatar Short */}
            <div className="hidden sm:flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-inner">
                AD
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
