'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { containerFade, itemFadeUp } from '@/lib/animations'

type Tour = {
  id: string
  title: string
  category: string
  price_per_person: number
  image: string
  steps: any[]
}

function getDuration(steps: any[]): string {
  if (!steps || steps.length === 0) return '1 Day'
  const count = steps.length
  return count === 1 ? '1 Day' : `${count} Days`
}

function getCategoryLabel(cat: string): string {
  if (cat === 'transfers') return 'Transfers'
  if (cat === 'excursions') return 'Excursions'
  if (cat === 'tour-circuits') return 'Tour Circuit'
  return cat
}

export default function Experiences() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('programs')
        .select('id, title, category, price_per_person, image, steps')
        .order('created_at', { ascending: false })
        .limit(6)
      setTours(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <section id="experiences" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            <Globe className="w-4 h-4" /> Featured Tours
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Featured Excursions
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover hand-picked tours designed for unforgettable Moroccan memories
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        )}

        {/* Tour Cards */}
        {!loading && tours.length > 0 && (
          <motion.div
            variants={containerFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {tours.map((tour) => (
              <motion.div
                key={tour.id}
                variants={itemFadeUp}
                whileHover={{ y: -8 }}
                className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
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
                    <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-white/20">
                      <Globe size={64} strokeWidth={1} />
                    </div>
                  )}
                  {/* Dark overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                {/* Overlaid content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Top: category badge */}
                  <div className="flex justify-between items-start">
                    <span className="text-white text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full drop-shadow-md">
                      {getCategoryLabel(tour.category)}
                    </span>
                    <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full drop-shadow-md">
                      {getDuration(tour.steps)}
                    </span>
                  </div>

                  {/* Bottom: title, price, button */}
                  <div>
                    <h3 className="text-white text-xl font-bold drop-shadow-md mb-1 line-clamp-2">
                      {tour.title}
                    </h3>
                    <p className="text-white/90 text-sm drop-shadow-md mb-4">
                      From{' '}
                      <span className="font-bold text-base text-white">
                        {tour.price_per_person?.toFixed(0)} MAD
                      </span>{' '}
                      / person
                    </p>
                    <Link href={`/program/${tour.id}`}>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-5 py-2 border-2 border-white text-white text-sm font-semibold rounded-lg hover:bg-white hover:text-neutral-900 transition-all duration-200 cursor-pointer"
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
          <div className="text-center py-16 text-neutral-500">
            <p className="text-xl">No tours available at the moment.</p>
          </div>
        )}

        {/* View All */}
        {!loading && tours.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link href="/programs?category=excursions">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors duration-300 cursor-pointer"
              >
                View All Excursions
              </motion.span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
