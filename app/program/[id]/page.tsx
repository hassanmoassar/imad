'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { containerFade, itemFadeUp } from '@/lib/animations'

type Program = {
  id: string
  title: string
  description: string
  category: string
  price_per_person: number
  image: string
  steps: Array<{ day: string; title: string; description: string }>
  created_at: string
}

function getCategoryLabel(cat: string) {
  if (cat === 'transfers') return 'Transfers'
  if (cat === 'excursions') return 'Excursions'
  if (cat === 'tour-circuits') return 'Tour Circuits'
  return cat
}

function getCategoryHref(cat: string) {
  return `/services/${cat}`
}

// Default included/not-included (can be extended with DB fields)
const DEFAULT_INCLUDED = [
  'Professional licensed guide',
  'Air-conditioned vehicle',
  'Hotel pick-up & drop-off',
  'All entrance fees',
  'Mineral water on board',
]
const DEFAULT_NOT_INCLUDED = [
  'Personal travel insurance',
  'Gratuities (optional)',
  'Meals unless specified',
]

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  const [program, setProgram] = useState<Program | null>(null)
  const [relatedTours, setRelatedTours] = useState<Program[]>([])
  const [loadingProgram, setLoadingProgram] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    travel_date: '',
    number_of_persons: 1,
  })
  const [priceMode, setPriceMode] = useState<'per_person' | 'flat'>('per_person')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [openItineraryDay, setOpenItineraryDay] = useState<number | null>(0)

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('programs')
          .select('*')
          .eq('id', params.id)
          .single()

        if (fetchError) throw new Error(fetchError.message)
        if (!data) throw new Error('Program not found')

        setProgram(data)

        // Fetch related tours (same category, different id)
        const { data: related } = await supabase
          .from('programs')
          .select('*')
          .eq('category', data.category)
          .neq('id', params.id)
          .limit(3)
        setRelatedTours(related || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load program')
      } finally {
        setLoadingProgram(false)
      }
    }
    fetchProgram()
  }, [params.id])

  const totalPrice = program
    ? priceMode === 'per_person'
      ? program.price_per_person * formData.number_of_persons
      : program.price_per_person
    : 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'number_of_persons' ? parseInt(value) : value,
    }))
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!program) { setSubmitError('Program not loaded. Refresh and try again.'); return }
    if (!formData.customer_name.trim()) { setSubmitError('Please enter your full name'); return }
    if (!formData.customer_email.trim()) { setSubmitError('Please enter your email'); return }

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const { error: insertError } = await supabase.from('reservations').insert([{
        program_id: program.id,
        program_title: program.title,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        number_of_persons: formData.number_of_persons,
        total_price: totalPrice,
        status: 'pending',
      }])
      if (insertError) throw new Error(insertError.message)
      setSubmitSuccess(true)
      setFormData({ customer_name: '', customer_email: '', customer_phone: '', travel_date: '', number_of_persons: 1 })
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit reservation')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (loadingProgram) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-b-2 border-primary mb-4" />
            <p className="text-neutral-500">Loading tour details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Error state
  if (error || !program) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Tour Not Found</h1>
            <p className="text-neutral-600 mb-6">{error}</p>
            <Link href="/services" className="inline-block px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors">
              Browse Services
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-20">

        {/* ── Hero Section ── */}
        <section className="relative h-[28rem] md:h-[36rem] overflow-hidden">
          {program.image && (
            <Image src={program.image} alt={program.title} fill className="object-cover" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute bottom-0 left-0 right-0 p-8"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="inline-block px-3 py-1 bg-primary/90 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                  {getCategoryLabel(program.category)}
                </span>
                {program.steps?.length > 0 && (
                  <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                    {program.steps.length} Day{program.steps.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">
                {program.title}
              </h1>
              <p className="text-white/80 text-sm drop-shadow-md">
                {getCategoryLabel(program.category)} · Morocco
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── Breadcrumb ── */}
        <div className="bg-neutral-50 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <span>›</span>
              <Link href={getCategoryHref(program.category)} className="hover:text-neutral-900 transition-colors">
                {getCategoryLabel(program.category)}
              </Link>
              <span>›</span>
              <span className="text-neutral-900 font-medium truncate max-w-xs">{program.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ── Left: Body Content ── */}
            <div className="lg:col-span-2 space-y-12">

              {/* Description */}
              <motion.section
                variants={containerFade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.h2 variants={itemFadeUp} className="text-2xl font-bold text-neutral-900 mb-5 flex items-center gap-3">
                  <span className="w-1 h-7 bg-primary rounded-full inline-block" />
                  About This Tour
                </motion.h2>
                <motion.p variants={itemFadeUp} className="text-neutral-600 leading-relaxed text-lg">
                  {program.description}
                </motion.p>
              </motion.section>

              {/* What's Included / Not Included */}
              <motion.section
                variants={containerFade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Included */}
                <motion.div variants={itemFadeUp}>
                  <h2 className="text-xl font-bold text-neutral-900 mb-5 flex items-center gap-3">
                    <span className="w-1 h-7 bg-green-500 rounded-full inline-block" />
                    What's Included
                  </h2>
                  <ul className="space-y-3">
                    {DEFAULT_INCLUDED.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-neutral-700">
                        <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Not Included */}
                <motion.div variants={itemFadeUp}>
                  <h2 className="text-xl font-bold text-neutral-900 mb-5 flex items-center gap-3">
                    <span className="w-1 h-7 bg-red-400 rounded-full inline-block" />
                    What's Not Included
                  </h2>
                  <ul className="space-y-3">
                    {DEFAULT_NOT_INCLUDED.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-neutral-700">
                        <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-500 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.section>

              {/* Itinerary */}
              {program.steps && program.steps.length > 0 && (
                <motion.section
                  variants={containerFade}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.h2 variants={itemFadeUp} className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-7 bg-primary rounded-full inline-block" />
                    Itinerary
                  </motion.h2>
                  <div className="space-y-3">
                    {program.steps.map((step, index) => (
                      <motion.div key={index} variants={itemFadeUp}>
                        <button
                          onClick={() => setOpenItineraryDay(openItineraryDay === index ? null : index)}
                          className="w-full flex items-center justify-between p-5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-left transition-colors duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <span className="flex-shrink-0 w-9 h-9 bg-neutral-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">{step.day}</p>
                              <p className="font-bold text-neutral-900">{step.title}</p>
                            </div>
                          </div>
                          <svg
                            className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${openItineraryDay === index ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openItineraryDay === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-5 pt-4 pb-5 bg-white border border-t-0 border-neutral-200 rounded-b-xl"
                          >
                            <p className="text-neutral-600 leading-relaxed">{step.description}</p>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* ── Right: Booking Widget ── */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="sticky top-24 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden"
              >
                {/* Price header */}
                <div className="p-6 bg-neutral-900 text-white">
                  <p className="text-sm text-neutral-400 mb-1">Starting from</p>
                  <p className="text-4xl font-bold text-primary">
                    {program.price_per_person.toFixed(0)} <span className="text-xl font-semibold">MAD</span>
                  </p>

                  {/* Per-person / Flat toggle */}
                  <div className="flex mt-4 bg-neutral-800 rounded-lg p-1 w-full">
                    <button
                      onClick={() => setPriceMode('per_person')}
                      className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${priceMode === 'per_person' ? 'bg-primary text-white' : 'text-neutral-400 hover:text-white'}`}
                    >
                      Per Person
                    </button>
                    <button
                      onClick={() => setPriceMode('flat')}
                      className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${priceMode === 'flat' ? 'bg-primary text-white' : 'text-neutral-400 hover:text-white'}`}
                    >
                      Flat Rate
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Date picker */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Travel Date</label>
                    <input
                      type="date"
                      name="travel_date"
                      value={formData.travel_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Number of people +/- */}
                  {priceMode === 'per_person' && (
                    <div>
                      <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Number of People</label>
                      <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, number_of_persons: Math.max(1, p.number_of_persons - 1) }))}
                          className="px-4 py-2.5 text-neutral-600 hover:bg-neutral-100 text-xl font-bold transition-colors border-r border-neutral-300"
                          disabled={isSubmitting}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          name="number_of_persons"
                          value={formData.number_of_persons}
                          onChange={handleChange}
                          className="flex-1 text-center py-2.5 text-sm font-bold outline-none bg-transparent"
                          min={1}
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, number_of_persons: p.number_of_persons + 1 }))}
                          className="px-4 py-2.5 text-neutral-600 hover:bg-neutral-100 text-xl font-bold transition-colors border-l border-neutral-300"
                          disabled={isSubmitting}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div className="flex justify-between items-center text-sm text-neutral-500 mb-1">
                      <span>{program.price_per_person.toFixed(0)} MAD × {priceMode === 'per_person' ? `${formData.number_of_persons} person${formData.number_of_persons > 1 ? 's' : ''}` : 'flat rate'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-900">Total</span>
                      <span className="text-xl font-black text-primary">{totalPrice.toFixed(0)} MAD</span>
                    </div>
                  </div>

                  {/* Errors / Success */}
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {submitError}
                    </div>
                  )}
                  {submitSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Reservation submitted! We'll contact you within 24 hours.
                    </div>
                  )}

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Book Now'
                    )}
                  </motion.button>

                  <p className="text-xs text-neutral-400 text-center">
                    No deposit required · Cancel anytime
                  </p>
                </form>
              </motion.div>
            </div>
          </div>

          {/* ── Related Tours ── */}
          {relatedTours.length > 0 && (
            <motion.section
              variants={containerFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-20"
            >
              <motion.h2 variants={itemFadeUp} className="text-2xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                <span className="w-1 h-7 bg-primary rounded-full inline-block" />
                Related Tours
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedTours.map((tour) => (
                  <motion.div
                    key={tour.id}
                    variants={itemFadeUp}
                    whileHover={{ y: -6 }}
                    className="group"
                  >
                    <Link href={`/program/${tour.id}`}>
                      <div className="relative h-52 rounded-2xl overflow-hidden mb-4">
                        {tour.image ? (
                          <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-5xl">🌍</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-bold text-sm drop-shadow-md line-clamp-2">{tour.title}</p>
                          <p className="text-white/80 text-xs mt-1 drop-shadow-md">{tour.price_per_person?.toFixed(0)} MAD / person</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
