'use client'

import React, { useState, useCallback } from 'react'
import { Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/admin/Card'
import { Badge } from '@/components/admin/Badge'
import { Button } from '@/components/admin/Button'
import { Modal } from '@/components/admin/Modal'
import { Toast } from '@/components/admin/Toast'

export interface ReservationRow {
  id: string
  program_id: string
  program_title: string
  customer_name: string
  customer_email: string
  customer_phone: string
  number_of_persons: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

interface ReservationsTableProps {
  reservations: ReservationRow[]
  loading?: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<void>
  onStatusChange: (id: string, status: string) => Promise<void>
}

export function ReservationsTable({
  reservations,
  loading = false,
  onEdit,
  onDelete,
  onStatusChange,
}: ReservationsTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedId(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedId) return

    setIsDeleting(true)
    try {
      await onDelete(selectedId)
      setToast({ type: 'success', message: 'Reservation deleted successfully' })
      setDeleteModalOpen(false)
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete reservation',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await onStatusChange(id, newStatus)
      setToast({ type: 'success', message: 'Status updated successfully' })
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update status',
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-600">Loading reservations...</p>
        </CardContent>
      </Card>
    )
  }

  if (reservations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-600 mb-4">No reservations yet</p>
          <p className="text-sm text-slate-500">Reservations will appear here once customers make bookings</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <h2 className="text-lg font-semibold text-slate-900">All Reservations</h2>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table - Modern SaaS look */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 first:rounded-tl-xl">
                    Customer Details
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Guests
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Total Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Booking Status
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Date Joined
                  </th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 last:rounded-tr-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {reservations.map((res) => (
                  <tr key={res.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-white">
                          {res.customer_name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{res.customer_name}</p>
                          <p className="text-xs text-slate-400 truncate">{res.customer_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-700">{res.program_title}</td>
                    <td className="px-6 py-5 text-sm">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase">
                        {res.number_of_persons} pax
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-900">
                      ${res.total_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={res.status}
                        onChange={(e) => handleStatusChange(res.id, e.target.value)}
                        className={`
                          px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer border-0 shadow-sm transition-all
                          focus:ring-2 focus:ring-offset-1 focus:ring-blue-500/20
                          ${res.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 
                            res.status === 'pending' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 
                            'bg-rose-50 text-rose-700 hover:bg-rose-100'}
                        `}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-slate-400">
                      {new Date(res.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(res.id)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(res.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {reservations.map((res) => (
              <div key={res.id} className="p-5 space-y-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{res.customer_name}</p>
                    <p className="text-xs text-slate-500 truncate">{res.customer_email}</p>
                  </div>
                  <div className="shrink-0">
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border-0 cursor-pointer shadow-sm"
                      style={{
                        backgroundColor:
                          res.status === 'confirmed'
                            ? '#d1fae5'
                            : res.status === 'pending'
                              ? '#fef3c7'
                              : '#fee2e2',
                        color:
                          res.status === 'confirmed'
                            ? '#065f46'
                            : res.status === 'pending'
                              ? '#92400e'
                              : '#991b1b',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-0.5">Program</p>
                    <p className="font-medium text-slate-900 line-clamp-1">{res.program_title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-0.5">Total Price</p>
                    <p className="font-bold text-slate-900">${res.total_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-0.5">Persons</p>
                    <p className="font-medium text-slate-900">{res.number_of_persons}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-0.5">Booking Date</p>
                    <p className="font-medium text-slate-900">{new Date(res.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(res.id)}
                    className="flex-1 h-10 shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(res.id)}
                    className="flex-1 h-10 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Reservation"
        description="This action cannot be undone"
        actions={[
          {
            label: 'Delete',
            onClick: handleConfirmDelete,
            variant: 'danger',
            isLoading: isDeleting,
          },
        ]}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </>
  )
}
