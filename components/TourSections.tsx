'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { containerFade, itemFadeUp } from '@/lib/animations'
import { CarIcon, DesertIcon, PalaceIcon } from './Icons'

type Tour = {
  id: string
  title: string
  category: string
  price_per_person: number
  image: string
  steps: any[]
}

const CATEGORIES = [
  {
    key: 'transfers',
    label: 'Transfers',
    subtitle: 'Reliable, comfortable vehicle transfers between airports, hotels & cities.',
    icon: <CarIcon />,
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    accentHex: '#d97706',
  },
  {
    key: 'excursions',
    label: 'Excursions',
    subtitle: 'Full-day guided adventures into the desert, mountains, and coastal towns.',
    icon: <DesertIcon />,
    accent: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    accentHex: '#e11d48',
  },
  {
    key: 'tour-circuits',
    label: 'Tour Circuits',
    subtitle: "Multi-day immersive circuits exploring Morocco's imperial cities and heritage.",
    icon: <PalaceIcon />,
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    accentHex: '#2563eb',
  },
]

function getDuration(steps: any[]): string {
  if (!steps || steps.length === 0) return '1 Day'
  return steps.length === 1 ? '1 Day' : `${steps.length} Days`
}

function CategorySection({ category }: { category: typeof CATEGORIES[number] }) {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('programs')
        .select('id, title, category, price_per_person, image, steps')
        .eq('category', category.key)
        .order('created_at', { ascending: false })
        .limit(3)
      setTours(data || [])
      setLoading(false)
    }
    fetch()
  }, [category.key])

  return (
    <section className="py-20 border-b border-neutral-100 last:border-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${category.bg} ${category.accent} flex items-center justify-center flex-shrink-0 border ${category.border}`}>
              {category.icon}
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
                {category.label}
              </h2>
              <p className="text-neutral-500 mt-1 max-w-xl text-sm md:text-base">
                {category.subtitle}
              </p>
            </div>
          </div>
          <Link
            href={`/services/${category.key}`}
            className={`inline-flex items-center gap-2 text-sm font-semibold ${category.accent} hover:underline flex-shrink-0`}
          >
            View all {category.label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2`} style={{ borderColor: category.accentHex }} />
          </div>
        )}

        {/* Cards grid */}
        {!loading && tours.length > 0 && (
          <motion.div
            variants={containerFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {tours.map((tour) => (
              <motion.div
                key={tour.id}
                variants={itemFadeUp}
                whileHover={{ y: -6 }}
                className="relative h-72 rounded-2xl overflow-hidden group"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  {tour.image ? (
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-5xl">
                      🌍
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Overlaid content */}
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <div className="flex justify-end">
                    <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full drop-shadow-md">
                      {getDuration(tour.steps)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-white text-lg font-bold drop-shadow-md mb-1 line-clamp-2">
                      {tour.title}
                    </h3>
                    <p className="text-white/80 text-sm drop-shadow-md mb-4">
                      From{' '}
                      <span className="font-bold text-white">
                        {tour.price_per_person?.toFixed(0)} MAD
                      </span>
                      {' '}/ person
                    </p>
                    <Link href={`/program/${tour.id}`}>
                      <motion.span
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-block px-4 py-2 border-2 border-white text-white text-xs font-semibold rounded-lg hover:bg-white hover:text-neutral-900 transition-all duration-200 cursor-pointer"
                      >
                        View Details →
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && tours.length === 0 && (
          <div className={`rounded-2xl border ${category.border} ${category.bg} p-12 text-center`}>
            <p className={`${category.accent} font-medium`}>No {category.label.toLowerCase()} available yet.</p>
            <p className="text-neutral-500 text-sm mt-1">Check back soon for new options.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default function TourSections() {
  return (
    <div className="bg-white">
      {CATEGORIES.map((cat) => (
        <CategorySection key={cat.key} category={cat} />
      ))}
    </div>
  )
}
