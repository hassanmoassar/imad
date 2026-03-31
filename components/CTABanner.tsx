'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CTABanner() {
  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
            ✈️ Start Your Journey
          </span>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Explore{' '}
            <span className="text-primary">Morocco</span>?
          </h2>

          <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book your dream Moroccan adventure today — from desert excursions to city transfers. No deposit required. Cancel anytime.
          </p>

          <Link href="/services">
            <motion.span
              whileHover={{ scale: 1.06, boxShadow: '0 24px 48px rgba(212, 184, 150, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-block px-10 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 cursor-pointer"
            >
              Browse All Services
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
