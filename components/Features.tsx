'use client'

import { motion } from 'framer-motion'
import { containerFade, itemFadeUp } from '@/lib/animations'

const features = [
  {
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'No Deposit Required',
    description: "Book with zero upfront cost — pay when you're ready to travel.",
  },
  {
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: '24/7 Support',
    description: 'Round-the-clock customer support in English, French, and Arabic.',
  },
  {
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    title: '4.9 Star Rated',
    description: 'Over 500 verified reviews — travellers consistently rate us excellent.',
  },
  {
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20v-2a6 6 0 0112 0v2" />
      </svg>
    ),
    title: 'Expert Local Guides',
    description: 'Knowledgeable, licensed local guides passionate about Moroccan culture.',
  },
]

export default function Features() {
  return (
    <section id="about" className="py-24 bg-neutral-900 text-white relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            🏆 Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Morocco Voyages?
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Experience Morocco with the leading luxury travel company
          </p>
        </motion.div>

        {/* Features 4-column grid */}
        <motion.div
          variants={containerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemFadeUp}
              whileHover={{ scale: 1.03, y: -4 }}
              className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300 group flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="text-primary mb-5 p-3 bg-white/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-black uppercase tracking-wider mb-3 text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
