'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ReservationsTable, ReservationRow } from '@/components/admin/ReservationsTable'
import { Button } from '@/components/admin/Button'
import { Plus } from 'lucide-react'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        console.log('[Reservations] Fetching reservations...')
        const { data, error: fetchError } = await supabase
          .from('reservations')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('[Reservations] Fetch error:', fetchError)
          throw new Error(fetchError.message)
        }

        console.log('[Reservations] Loaded:', data?.length)
        setReservations(data || [])
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch reservations'
        console.error('[Reservations] Error:', errorMsg)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('reservations').delete().eq('id', id)

      if (deleteError) throw deleteError

      setReservations(reservations.filter(r => r.id !== id))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete'
      throw new Error(errorMsg)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id)

      if (updateError) throw updateError

      setReservations(
        reservations.map(r => (r.id === id ? { ...r, status: newStatus as any } : r))
      )
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update'
      throw new Error(errorMsg)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/reservations/${id}/edit`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reservations</h1>
          <p className="text-slate-600 mt-1">Manage customer reservations and bookings</p>
        </div>
        <Link href="/admin/reservations/create">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            New Reservation
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-900 font-medium">Error loading reservations</p>
          <p className="text-red-800 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Table */}
      <ReservationsTable
        reservations={reservations}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
