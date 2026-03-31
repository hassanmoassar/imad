'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/admin/Card'
import { Button } from '@/components/admin/Button'
import { Plus, ArrowRight, TrendingUp } from 'lucide-react'

interface Stats {
  programs: number
  reservations: number
  pendingReservations: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    programs: 0,
    reservations: 0,
    pendingReservations: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [{ count: programCount }, { count: reservationCount }, { count: pendingCount }] =
          await Promise.all([
            supabase.from('programs').select('id', { count: 'exact' }).range(0, 0),
            supabase.from('reservations').select('id', { count: 'exact' }).range(0, 0),
            supabase
              .from('reservations')
              .select('id', { count: 'exact' })
              .eq('status', 'pending')
              .range(0, 0),
          ])

        setStats({
          programs: programCount ?? 0,
          reservations: reservationCount ?? 0,
          pendingReservations: pendingCount ?? 0,
        })
      } catch (err) {
        console.error('[Dashboard] Error loading stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Programs"
          value={stats.programs}
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total Reservations"
          value={stats.reservations}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Pending Reservations"
          value={stats.pendingReservations}
          icon={<TrendingUp className="w-6 h-6" />}
          color="amber"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/programs/create" className="block">
              <Button variant="primary" className="w-full justify-between group">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Program
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/admin/programs" className="block">
              <Button variant="secondary" className="w-full justify-between group">
                <span>View Programs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/admin/reservations" className="block">
              <Button variant="secondary" className="w-full justify-between group">
                <span>Manage Reservations</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardContent className="py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Pro Tip:</strong> Use the sidebar to navigate between different sections. Create new programs
              to make them available on your website.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'amber'
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <Card hover>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
