'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

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

type Step = {
  title: string
  description: string
}

export default function ProgramDetail() {
  const params = useParams()
  const programId = params?.id as string
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [guestCount, setGuestCount] = useState(1)

  useEffect(() => {
    const fetchProgram = async () => {
      if (!programId) return

      try {
        console.log('[ProgramDetail] Fetching program:', programId)
        const { data, error: fetchError } = await supabase
          .from('programs')
          .select('*')
          .eq('id', programId)
          .single()

        if (fetchError) {
          console.error('[ProgramDetail] Fetch error:', fetchError)
          throw new Error('Program not found')
        }

        console.log('[ProgramDetail] Program loaded:', data?.title)
        setProgram(data)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load program'
        console.error('[ProgramDetail] Error:', errorMsg)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchProgram()
  }, [programId])

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

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-neutral-600">Loading program...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !program) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900 mb-4">Program Not Found</p>
            <p className="text-neutral-600">{error || 'The program you are looking for does not exist.'}</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const totalPrice = program.price_per_person * guestCount

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Image */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-96 overflow-hidden"
        >
          {program.image ? (
            <Image
              src={program.image}
              alt={program.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 flex items-end"
          >
            <div className="p-8 text-white">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getCategoryColor(program.category)}`}>
                {getCategoryLabel(program.category)}
              </div>
              <h1 className="text-5xl font-bold mb-2">{program.title}</h1>
            </div>
          </motion.div>
        </motion.section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Description */}
              <section>
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">About This Program</h2>
                <p className="text-neutral-700 leading-relaxed text-lg">
                  {program.description}
                </p>
              </section>

              {/* Itinerary/Steps */}
              {program.steps && Array.isArray(program.steps) && program.steps.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                    Itinerary ({program.steps.length} Days)
                  </h2>
                  <div className="space-y-6">
                    {program.steps.map((step: Step, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative pl-8 pb-6 border-l-2 border-amber-600"
                      >
                        <div className="absolute -left-4 w-6 h-6 bg-amber-600 rounded-full" />
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">
                          Day {index + 1}: {step.title}
                        </h3>
                        <p className="text-neutral-600">{step.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>

            {/* Booking Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 p-6 bg-white rounded-2xl border border-neutral-200 shadow-lg space-y-6">
                {/* Price */}
                <div>
                  <p className="text-neutral-600 text-sm mb-1">Price per person</p>
                  <p className="text-4xl font-bold text-amber-600">
                    ${program.price_per_person.toFixed(2)}
                  </p>
                </div>

                {/* Booking Form */}
                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-2 border border-neutral-300 rounded-lg p-2">
                      <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="px-3 py-1 hover:bg-gray-100 rounded"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 text-center outline-none"
                      />
                      <button
                        onClick={() => setGuestCount(guestCount + 1)}
                        className="px-3 py-1 hover:bg-gray-100 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-neutral-600 mb-1">Total Price</p>
                    <p className="text-3xl font-bold text-amber-600">
                      ${totalPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      {guestCount} guest{guestCount > 1 ? 's' : ''} × ${program.price_per_person.toFixed(2)}
                    </p>
                  </div>

                  {/* Book Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Book Now
                  </motion.button>

                  <p className="text-xs text-neutral-600 text-center">
                    You will not be charged yet
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
