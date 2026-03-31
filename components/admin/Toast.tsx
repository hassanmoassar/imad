import React, { useState } from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  type: ToastType
  message: string
  onClose: () => void
}

export function Toast({ type, message, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const iconClasses = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }

  const bgClasses = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }

  const IconComponent = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[type]

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bgClasses[type]}`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${iconClasses[type]}`} />
      <p className="flex-1 text-sm font-medium text-slate-900">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
