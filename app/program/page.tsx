'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function ProgramDetail() {
  const [selectedDate, setSelectedDate] = useState('')
  const [guestCount, setGuestCount] = useState(1)

  const program = {
    id: 1,
    title: 'Sahara Desert 3-Day Tour',
    description: 'Experience the magic of the Sahara with our comprehensive 3-day tour.',
    price: 299,
    duration: '3 Days / 2 Nights',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=600&fit=crop',
    rating: 4.8,
    reviews: 245,
    highlights: [
      'Camel trekking in the golden dunes',
      'Overnight Berber camp experience',
      'Sunset and sunrise viewing',
      'Local cuisine and traditional meals',
      'Expert guides and drivers',
      'Comfortable accommodations',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Desert Preparation',
        description: 'Pick up from your hotel, journey to the desert, camel introduction and first trek',
      },
      {
        day: 2,
        title: 'Deep Desert Adventure',
        description: 'Full day in the dunes, sunset viewing, overnight camp with traditional dinner',
      },
      {
        day: 3,
        title: 'Return Journey',
        description: 'Sunrise viewing, breakfast, camel trek back, return to hotel',
      },
    ],
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

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
          <Image
            src={program.image}
            alt={program.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 flex items-end"
          >
            <div className="p-8 text-white">
              <h1 className="text-5xl font-bold font-serif mb-2">{program.title}</h1>
              <p className="text-lg text-gray-200">{program.duration}</p>
            </div>
          </motion.div>
        </motion.section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 space-y-8"
            >
              {/* Description */}
              <motion.section variants={itemVariants} className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {program.description}
                </p>
              </motion.section>

              {/* Highlights */}
              <motion.section variants={itemVariants}>
                <h2 className="text-3xl font-bold font-serif text-secondary mb-6">
                  Tour Highlights
                </h2>
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {program.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-3 p-4 bg-background rounded-lg"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl flex-shrink-0 mt-1"
                      >
                        ✓
                      </motion.span>
                      <p className="text-gray-700">{highlight}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>

              {/* Itinerary */}
              <motion.section variants={itemVariants}>
                <h2 className="text-3xl font-bold font-serif text-secondary mb-6">
                  Itinerary
                </h2>
                <motion.div
                  variants={containerVariants}
                  className="space-y-6"
                >
                  {program.itinerary.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="relative pl-8 pb-6 border-l-2 border-primary"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        className="absolute -left-4 w-6 h-6 bg-primary rounded-full"
                      />
                      <h3 className="text-xl font-bold font-serif text-secondary">
                        Day {item.day}: {item.title}
                      </h3>
                      <p className="text-gray-600 mt-2">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            </motion.div>

            {/* Booking Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="sticky top-24 p-6 bg-gradient-to-br from-background to-white rounded-2xl border border-primary/20 shadow-lg"
              >
                {/* Price */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-6"
                >
                  <p className="text-gray-600 text-sm mb-1">Starting from</p>
                  <p className="text-4xl font-bold text-accent">
                    ${program.price}
                  </p>
                  <p className="text-gray-600 text-sm">per person</p>
                </motion.div>

                {/* Rating */}
                <motion.div className="flex items-center gap-2 mb-6 pb-6 border-b border-primary/20">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-accent"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {program.rating} ({program.reviews} reviews)
                  </span>
                </motion.div>

                {/* Booking Form */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      Select Date
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-primary/30 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-2 border border-primary/30 rounded-lg p-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="px-3 py-1 hover:bg-gray-100 rounded"
                      >
                        −
                      </motion.button>
                      <input
                        type="number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value)))}
                        className="flex-1 text-center outline-none"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setGuestCount(guestCount + 1)}
                        className="px-3 py-1 hover:bg-gray-100 rounded"
                      >
                        +
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="text-sm text-gray-600 mb-1">Total Price</p>
                    <p className="text-2xl font-bold text-accent">
                      ${program.price * guestCount}
                    </p>
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Book Now
                  </motion.button>

                  <motion.p
                    variants={itemVariants}
                    className="text-xs text-gray-600 text-center"
                  >
                    You will not be charged yet
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
