import React from 'react'

interface BadgeProps {
  status: 'pending' | 'confirmed' | 'cancelled' | 'active' | 'inactive'
  children: React.ReactNode
  className?: string
}

export function Badge({ status, children, className = '' }: BadgeProps) {
  const statusClasses = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    active: 'bg-blue-100 text-blue-800',
    inactive: 'bg-slate-100 text-slate-800',
  }

  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full text-xs font-medium
        ${statusClasses[status]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
