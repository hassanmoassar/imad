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
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Persons
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Total Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{res.customer_name}</p>
                        <p className="text-sm text-slate-500">{res.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{res.program_title}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{res.number_of_persons}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      ${res.total_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={res.status}
                        onChange={(e) => handleStatusChange(res.id, e.target.value)}
                        className="px-3 py-1 rounded-lg text-sm font-medium border-0 cursor-pointer"
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
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(res.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(res.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(res.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-200">
            {reservations.map((res) => (
              <div key={res.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900">{res.customer_name}</p>
                    <p className="text-xs text-slate-500">{res.customer_email}</p>
                  </div>
                  <Badge status={res.status}>{res.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-600">Program</p>
                    <p className="font-medium text-slate-900">{res.program_title}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Price</p>
                    <p className="font-medium text-slate-900">${res.total_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Persons</p>
                    <p className="font-medium text-slate-900">{res.number_of_persons}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Date</p>
                    <p className="font-medium text-slate-900">{new Date(res.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(res.id)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(res.id)}
                    className="flex-1"
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
