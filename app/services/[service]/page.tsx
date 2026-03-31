'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Program = {
  id: string
  title: string
  description: string
  category: string
  price_per_person: number
  image: string
  steps: any[]
  created_at: string
}

type Props = { params: { service: string } }

export default function ServiceList({ params }: Props) {
  const service = params.service
  const [list, setList] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        console.log(`[ServiceList] Fetching programs for service: ${service}`)
        const { data, error: fetchError } = await supabase
          .from('programs')
          .select('*')
          .eq('category', service)
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('[ServiceList] Fetch error:', fetchError)
          throw new Error(fetchError.message)
        }

        setList(data || [])
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch programs'
        console.error('[ServiceList] Error:', errorMsg)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [service])

  const getServiceTitle = (srv: string) => {
    switch (srv) {
      case 'transfers':
        return 'Premium Transfers'
      case 'excursions':
        return 'Desert Excursions'
      case 'tour-circuits':
        return 'Cultural Tours'
      default:
        return srv.replace('-', ' ')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Link href="/services" className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Services
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 capitalize">
              {getServiceTitle(service)}
            </h1>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-4"></div>
              <p className="text-neutral-600">Loading programs...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-8">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && list.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center">
              <p className="text-xl text-neutral-600 mb-6">No programs found for this service yet.</p>
              <Link
                href="/programs"
                className="inline-block px-8 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors"
              >
                Browse All Programs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {list.map((p) => (
                <Link key={p.id} href={`/program/${p.id}`} className="group h-full">
                  <div className="h-full bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-amber-300 transition-all duration-300 hover:shadow-xl flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-neutral-100">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🌍
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-neutral-600 text-sm mb-6 line-clamp-3 flex-grow">
                        {p.description}
                      </p>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">From</p>
                          <p className="text-2xl font-bold text-amber-600">
                            ${p.price_per_person?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
