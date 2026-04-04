'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, Clock, Star, ShieldCheck } from 'lucide-react'
import { containerFade, itemFadeUp } from '@/lib/animations'

const trustBadges = [
  { icon: CheckCircle2, label: 'No Deposit Required' },
  { icon: Clock, label: '24/7 Support' },
  { icon: Star, label: '4.9 Rated · 500+ Reviews' },
  { icon: ShieldCheck, label: 'Secure Booking' },
]

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image / Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerFade}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center"
      >
        <motion.h1
          variants={itemFadeUp}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Discover Morocco in{' '}
          <span className="text-primary drop-shadow-md">Comfort</span>{' '}
          &amp; Style
        </motion.h1>

        <motion.p
          variants={itemFadeUp}
          className="text-lg md:text-xl text-white drop-shadow-md mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Premium transfers, curated excursions, and unforgettable tour circuits — crafted for the modern explorer.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemFadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link href="/programs">
            <motion.span
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Book Your Ride
            </motion.span>
          </Link>

          <Link href="/programs?category=excursions">
            <motion.span
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3.5 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all cursor-pointer"
            >
              Explore Excursions
            </motion.span>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={itemFadeUp}
          className="flex flex-wrap gap-3 justify-center"
        >
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-medium"
              >
                <Icon className="w-4 h-4" />
                <span>{badge.label}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 text-white/70">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </motion.div>
    </section>
  )
}
