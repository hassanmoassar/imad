'use client'

import React from 'react'
import { Search, Bell, Settings } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
}

export function AdminTopbar({ title, subtitle }: TopbarProps) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Left - Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>

        {/* Right - Search and Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-slate-900 placeholder-slate-500 outline-none"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings */}
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
