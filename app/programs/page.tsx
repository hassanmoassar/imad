'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Globe } from 'lucide-react'
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

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        console.log('[Programs] Fetching programs from database...')
        let query = supabase.from('programs').select('*')

        if (selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory)
        }

        const { data, error: fetchError } = await query.order('created_at', {
          ascending: false,
        })

        if (fetchError) {
          console.error('[Programs] Fetch error:', fetchError)
          throw new Error(fetchError.message)
        }

        console.log('[Programs] Loaded', data?.length, 'programs')
        setPrograms(data || [])
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch programs'
        console.error('[Programs] Error:', errorMsg)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [selectedCategory])

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'transfers':
        return 'Transfers'
      case 'excursions':
        return 'Excursions'
      case 'tour-circuits':
        return 'Tour Circuits'
      default:
        return cat
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'transfers':
        return 'bg-amber-100 text-amber-800'
      case 'excursions':
        return 'bg-rose-100 text-rose-800'
      case 'tour-circuits':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
              <Sparkles className="w-4 h-4" /> Browse
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
              Our Programs
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover our curated selection of travel programs designed to give you the best
              Moroccan experience
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap gap-3 justify-center">
            {['all', 'transfers', 'excursions', 'tour-circuits'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:border-amber-600'
                }`}
              >
                {cat === 'all' ? 'All Programs' : getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-neutral-600">Loading programs...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              <p>Error: {error}</p>
            </div>
          )}

          {/* Programs Grid */}
          {!loading && programs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {programs.map(program => (
                <Link key={program.id} href={`/program/${program.id}`}>
                  <div className="h-full group cursor-pointer">
                    {/* Card */}
                    <div className="h-full rounded-2xl overflow-hidden border border-neutral-200 hover:border-amber-300 transition-all duration-300 hover:shadow-xl bg-white">
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden bg-gray-200">
                        {program.image ? (
                          <Image
                            src={program.image}
                            alt={program.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-200">
                            <Globe size={64} strokeWidth={1} />
                          </div>
                        )}
                        {/* Category Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(program.category)}`}>
                          {getCategoryLabel(program.category)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col h-full">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                          {program.title}
                        </h3>

                        {/* Description */}
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2 flex-grow">
                          {program.description}
                        </p>

                        {/* Steps Info */}
                        {program.steps && Array.isArray(program.steps) && program.steps.length > 0 && (
                          <div className="mb-4 text-sm text-neutral-600">
                            <p className="font-semibold text-neutral-900">
                              {program.steps.length} Days
                            </p>
                          </div>
                        )}

                        {/* Price */}
                        <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">Price per person</p>
                            <p className="text-2xl font-bold text-amber-600">
                              {program.price_per_person?.toFixed(0) || '0'} MAD
                            </p>
                          </div>
                          <div className="text-amber-600 group-hover:translate-x-1 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && programs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-2xl text-neutral-600 mb-4">No programs found</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                View All Programs
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
