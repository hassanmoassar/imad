import React from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  actions?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'danger'
    isLoading?: boolean
  }[]
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions = [],
}: ModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          {children && <div className="px-6 py-4">{children}</div>}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex gap-3 justify-end">
              <Button variant="ghost" onClick={onClose} size="sm">
                Cancel
              </Button>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'primary'}
                  onClick={action.onClick}
                  isLoading={action.isLoading}
                  size="sm"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
